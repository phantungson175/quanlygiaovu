import fs from 'fs';
import path from 'path';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  TableLayoutType,
  ShadingType,
  VerticalAlign,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
  convertMillimetersToTwip,
} from 'docx';

const FONT_NAME = 'Times New Roman';
const CODE_FONT = 'Consolas';

// Twips constants
// 1 mm = 56.6929 twips
const MARGIN_TOP = 1417;     // 2.5 cm
const MARGIN_BOTTOM = 1417;  // 2.5 cm
const MARGIN_LEFT = 1984;    // 3.5 cm
const MARGIN_RIGHT = 1134;   // 2.0 cm
const INDENT_FIRST_LINE = 567; // 1.0 cm

const PAGE_SIZE_A4 = {
  width: 11906,  // 210 mm
  height: 16838, // 297 mm
};

// Thin borders for tables
const TABLE_BORDER = {
  style: BorderStyle.SINGLE,
  size: 4,
  color: 'A0AEC0',
};

const TABLE_BORDERS = {
  top: TABLE_BORDER,
  bottom: TABLE_BORDER,
  left: TABLE_BORDER,
  right: TABLE_BORDER,
  insideHorizontal: TABLE_BORDER,
  insideVertical: TABLE_BORDER,
};

// Helper: parse inline markdown (bold, italic, code) into TextRun[]
function parseInlineToRuns(text, baseOpts = {}) {
  const runs = [];
  if (!text) return runs;

  // Regex to match ***bold italic***, **bold**, *italic*, `code`
  const tokenRegex = /(\*\*\*[\s\S]+?\*\*\*|\*\*[\s\S]+?\*\*|\*[\s\S]+?\*|`[^`]+`)/g;
  const parts = text.split(tokenRegex);

  for (const part of parts) {
    if (!part) continue;

    if (part.startsWith('***') && part.endsWith('***') && part.length >= 6) {
      const content = part.slice(3, -3);
      runs.push(new TextRun({
        text: content,
        font: FONT_NAME,
        size: baseOpts.size || 26,
        bold: true,
        italic: true,
        color: baseOpts.color || '000000',
      }));
    } else if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      const content = part.slice(2, -2);
      runs.push(new TextRun({
        text: content,
        font: FONT_NAME,
        size: baseOpts.size || 26,
        bold: true,
        italic: baseOpts.italic || false,
        color: baseOpts.color || '000000',
      }));
    } else if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      const content = part.slice(1, -1);
      runs.push(new TextRun({
        text: content,
        font: FONT_NAME,
        size: baseOpts.size || 26,
        bold: baseOpts.bold || false,
        italic: true,
        color: baseOpts.color || '000000',
      }));
    } else if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      const content = part.slice(1, -1);
      runs.push(new TextRun({
        text: content,
        font: CODE_FONT,
        size: (baseOpts.size || 26) - 4,
        color: '1E293B',
        shading: {
          type: ShadingType.CLEAR,
          fill: 'F1F5F9',
        },
      }));
    } else {
      runs.push(new TextRun({
        text: part,
        font: FONT_NAME,
        size: baseOpts.size || 26,
        bold: baseOpts.bold || false,
        italic: baseOpts.italic || false,
        color: baseOpts.color || '000000',
      }));
    }
  }

  return runs;
}

// Function to convert an array of lines into docx elements
function convertLinesToElements(lines, isMainBody = false) {
  const elements = [];
  let inCode = false;
  let codeBuffer = [];
  let inTable = false;
  let tableRows = [];
  let isTableHeader = false;

  const flushTable = () => {
    if (!inTable || tableRows.length === 0) return;

    const colCount = Math.max(...tableRows.map(r => r.cells.length));
    const tableWidthPercent = 100;

    const rows = tableRows.map((r, rowIndex) => {
      const isHeader = r.isHeader;
      const cells = [];

      for (let cIdx = 0; cIdx < colCount; cIdx++) {
        const cellText = r.cells[cIdx] || '';
        const runs = parseInlineToRuns(cellText, {
          size: 22, // 11pt inside tables
          bold: isHeader,
        });

        cells.push(new TableCell({
          children: [
            new Paragraph({
              children: runs.length > 0 ? runs : [new TextRun({ text: ' ', size: 22 })],
              spacing: { line: 280, lineRule: 'auto', before: 40, after: 40 },
              alignment: isHeader ? AlignmentType.CENTER : AlignmentType.LEFT,
              indent: { firstLine: 0 },
            }),
          ],
          shading: {
            fill: isHeader ? 'EBF3FB' : (rowIndex % 2 === 1 ? 'F8FAFC' : 'FFFFFF'),
          },
          margins: {
            top: 100,
            bottom: 100,
            left: 120,
            right: 120,
          },
          verticalAlign: VerticalAlign.CENTER,
          borders: TABLE_BORDERS,
        }));
      }

      return new TableRow({
        children: cells,
        tableHeader: isHeader,
        cantSplit: true,
      });
    });

    elements.push(new Table({
      rows: rows,
      width: { size: tableWidthPercent, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.AUTOFIT,
      borders: TABLE_BORDERS,
    }));

    // Small spacing after table
    elements.push(new Paragraph({
      spacing: { line: 240, before: 0, after: 120 },
      children: [],
    }));

    inTable = false;
    tableRows = [];
  };

  const flushCode = () => {
    if (!inCode) return;
    const codeText = codeBuffer.join('\n');
    
    // Create a styled callout box for code or PlantUML
    const linesOfCode = codeBuffer.map(codeLine => {
      return new Paragraph({
        children: [
          new TextRun({
            text: codeLine.length > 0 ? codeLine : ' ',
            font: CODE_FONT,
            size: 19, // ~9.5pt
            color: '0F172A',
          }),
        ],
        spacing: { line: 240, lineRule: 'auto', before: 20, after: 20 },
        indent: { firstLine: 0 },
        alignment: AlignmentType.LEFT,
      });
    });

    const codeBox = new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: linesOfCode,
              shading: { fill: 'F8FAFC' },
              margins: { top: 120, bottom: 120, left: 180, right: 180 },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 2, color: 'CBD5E1' },
                bottom: { style: BorderStyle.SINGLE, size: 2, color: 'CBD5E1' },
                left: { style: BorderStyle.SINGLE, size: 12, color: '0284C7' }, // Accent blue left bar
                right: { style: BorderStyle.SINGLE, size: 2, color: 'CBD5E1' },
              },
            }),
          ],
        }),
      ],
      width: { size: 100, type: WidthType.PERCENTAGE },
    });

    elements.push(codeBox);
    elements.push(new Paragraph({ spacing: { line: 240, before: 0, after: 100 }, children: [] }));

    inCode = false;
    codeBuffer = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Code block toggle
    if (trimmed.startsWith('```')) {
      if (!inCode) {
        if (inTable) flushTable();
        inCode = true;
        codeBuffer = [];
      } else {
        flushCode();
      }
      continue;
    }

    if (inCode) {
      codeBuffer.push(rawLine);
      continue;
    }

    // Markdown Table handling
    if (trimmed.startsWith('|')) {
      if (!inTable) {
        inTable = true;
        isTableHeader = true;
        tableRows = [];
      }

      // Check if this is the separator row
      if (trimmed.includes('---')) {
        isTableHeader = false;
        continue;
      }

      const parts = trimmed.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      const cells = parts.map(p => p.trim());
      tableRows.push({
        cells: cells,
        isHeader: isTableHeader,
      });
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Blank line
    if (trimmed.length === 0) {
      continue;
    }

    // Horizontal Rule
    if (trimmed === '---') {
      elements.push(new Paragraph({
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
        },
        spacing: { before: 140, after: 140 },
        children: [],
      }));
      continue;
    }

    // Heading 1 (# ...)
    if (trimmed.startsWith('# ')) {
      const headingText = trimmed.replace(/^#\s+/, '').trim();
      elements.push(new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [
          new TextRun({
            text: headingText.toUpperCase(),
            font: FONT_NAME,
            size: 28, // 14pt
            bold: true,
            color: '0D233A',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { line: 360, lineRule: 'auto', before: 280, after: 140 },
        pageBreakBefore: elements.length > 0, // start new page for top-level chapters
        indent: { firstLine: 0 },
      }));
      continue;
    }

    // Heading 2 (## ...)
    if (trimmed.startsWith('## ')) {
      const headingText = trimmed.replace(/^##\s+/, '').trim();
      elements.push(new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [
          new TextRun({
            text: headingText,
            font: FONT_NAME,
            size: 26, // 13pt
            bold: true,
            color: '1E3A8A',
          }),
        ],
        alignment: AlignmentType.LEFT,
        spacing: { line: 360, lineRule: 'auto', before: 200, after: 100 },
        keepWithNext: true,
        indent: { firstLine: 0 },
      }));
      continue;
    }

    // Heading 3 (### ...)
    if (trimmed.startsWith('### ')) {
      const headingText = trimmed.replace(/^###\s+/, '').trim();
      elements.push(new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [
          new TextRun({
            text: headingText,
            font: FONT_NAME,
            size: 26, // 13pt
            bold: true,
            italic: true,
            color: '0F172A',
          }),
        ],
        alignment: AlignmentType.LEFT,
        spacing: { line: 360, lineRule: 'auto', before: 160, after: 80 },
        keepWithNext: true,
        indent: { firstLine: 0 },
      }));
      continue;
    }

    // Table caption: *Bảng X.Y: ...* (Always above table)
    if (trimmed.startsWith('*Bảng ') && trimmed.endsWith('*')) {
      const captionText = trimmed.slice(1, -1);
      elements.push(new Paragraph({
        children: parseInlineToRuns(captionText, { bold: true, italic: true, size: 24 }),
        alignment: AlignmentType.CENTER,
        spacing: { line: 300, lineRule: 'auto', before: 180, after: 80 },
        keepWithNext: true,
        indent: { firstLine: 0 },
      }));
      continue;
    }

    // Figure caption: *Hình X.Y: ...* (Always below figure)
    if (trimmed.startsWith('*Hình ') && trimmed.endsWith('*')) {
      const captionText = trimmed.slice(1, -1);
      elements.push(new Paragraph({
        children: parseInlineToRuns(captionText, { italic: true, size: 24, bold: true }),
        alignment: AlignmentType.CENTER,
        spacing: { line: 300, lineRule: 'auto', before: 80, after: 180 },
        indent: { firstLine: 0 },
      }));
      continue;
    }

    // Bullet points (- or *)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const bulletContent = trimmed.substring(2);
      elements.push(new Paragraph({
        children: parseInlineToRuns(bulletContent, { size: 26 }),
        bullet: { level: 0 },
        alignment: AlignmentType.JUSTIFIED,
        spacing: { line: 360, lineRule: 'auto', before: 40, after: 60 },
        indent: { firstLine: 0 },
      }));
      continue;
    }

    // Numbered list item: 1. ... or 2. ...
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch && !trimmed.startsWith('1.1') && !trimmed.startsWith('1.2') && !trimmed.startsWith('2.1') && !trimmed.startsWith('3.1')) {
      const itemNum = numMatch[1];
      const itemText = numMatch[2];
      elements.push(new Paragraph({
        children: [
          new TextRun({ text: `${itemNum}. `, bold: true, font: FONT_NAME, size: 26 }),
          ...parseInlineToRuns(itemText, { size: 26 }),
        ],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { line: 360, lineRule: 'auto', before: 40, after: 60 },
        indent: { left: 400, firstLine: 0 },
      }));
      continue;
    }

    // Normal text paragraph
    elements.push(new Paragraph({
      children: parseInlineToRuns(trimmed, { size: 26 }),
      alignment: AlignmentType.JUSTIFIED,
      spacing: { line: 360, lineRule: 'auto', before: 0, after: 100 },
      indent: { firstLine: INDENT_FIRST_LINE }, // 1cm indent
    }));
  }

  if (inTable) flushTable();
  if (inCode) flushCode();

  return elements;
}

// Function to construct the special Cover Page
function createCoverSection() {
  const coverElements = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: 260, before: 0, after: 40 },
      children: [
        new TextRun({
          text: 'BỘ CÔNG THƯƠNG',
          font: FONT_NAME,
          size: 26, // 13pt
          bold: true,
        }),
      ],
      indent: { firstLine: 0 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: 260, before: 0, after: 60 },
      children: [
        new TextRun({
          text: 'TRƯỜNG ĐẠI HỌC ĐIỆN LỰC',
          font: FONT_NAME,
          size: 28, // 14pt
          bold: true,
          color: '0D233A',
        }),
      ],
      indent: { firstLine: 0 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: 260, before: 0, after: 200 },
      children: [
        new TextRun({
          text: 'KHOA CÔNG NGHỆ THÔNG TIN',
          font: FONT_NAME,
          size: 26, // 13pt
          bold: true,
        }),
      ],
      indent: { firstLine: 0 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: 240, before: 0, after: 500 },
      children: [
        new TextRun({
          text: '----------------***----------------',
          font: FONT_NAME,
          size: 24,
          bold: true,
          color: '64748B',
        }),
      ],
      indent: { firstLine: 0 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: 360, before: 400, after: 300 },
      children: [
        new TextRun({
          text: 'BÁO CÁO THỰC TẬP TỐT NGHIỆP',
          font: FONT_NAME,
          size: 36, // 18pt
          bold: true,
          color: '0B2545',
        }),
      ],
      indent: { firstLine: 0 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: 300, before: 100, after: 100 },
      children: [
        new TextRun({
          text: 'ĐỀ TÀI:',
          font: FONT_NAME,
          size: 26, // 13pt
          bold: true,
          italic: true,
        }),
      ],
      indent: { firstLine: 0 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: 360, before: 100, after: 500 },
      children: [
        new TextRun({
          text: 'PHÂN TÍCH, THIẾT KẾ VÀ XÂY DỰNG HỆ THỐNG QUẢN LÝ GIÁO VỤ\nTRƯỜNG ĐẠI HỌC ĐIỆN LỰC (QUANLYGIAOVU - EPU 2026)',
          font: FONT_NAME,
          size: 30, // 15pt
          bold: true,
          color: '1A365D',
        }),
      ],
      indent: { firstLine: 0 },
    }),
    // Table containing student and advisor details
    new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Khoa:', font: FONT_NAME, size: 26, bold: true })],
                  spacing: { line: 300, before: 40, after: 40 },
                  indent: { firstLine: 0 },
                }),
              ],
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
              width: { size: 35, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Công nghệ Thông tin', font: FONT_NAME, size: 26 })],
                  spacing: { line: 300, before: 40, after: 40 },
                  indent: { firstLine: 0 },
                }),
              ],
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
              width: { size: 65, type: WidthType.PERCENTAGE },
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Chuyên ngành:', font: FONT_NAME, size: 26, bold: true })],
                  spacing: { line: 300, before: 40, after: 40 },
                  indent: { firstLine: 0 },
                }),
              ],
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Công nghệ Phần mềm', font: FONT_NAME, size: 26 })],
                  spacing: { line: 300, before: 40, after: 40 },
                  indent: { firstLine: 0 },
                }),
              ],
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Khóa học:', font: FONT_NAME, size: 26, bold: true })],
                  spacing: { line: 300, before: 40, after: 40 },
                  indent: { firstLine: 0 },
                }),
              ],
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: '2022 – 2027 (Khóa D17)', font: FONT_NAME, size: 26 })],
                  spacing: { line: 300, before: 40, after: 40 },
                  indent: { firstLine: 0 },
                }),
              ],
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Sinh viên thực hiện:', font: FONT_NAME, size: 26, bold: true })],
                  spacing: { line: 300, before: 40, after: 40 },
                  indent: { firstLine: 0 },
                }),
              ],
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'PHAN TÙNG SƠN', font: FONT_NAME, size: 26, bold: true, color: '0D233A' })],
                  spacing: { line: 300, before: 40, after: 40 },
                  indent: { firstLine: 0 },
                }),
              ],
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Mã số sinh viên:', font: FONT_NAME, size: 26, bold: true })],
                  spacing: { line: 300, before: 40, after: 40 },
                  indent: { firstLine: 0 },
                }),
              ],
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: '22810310206', font: FONT_NAME, size: 26, bold: true })],
                  spacing: { line: 300, before: 40, after: 40 },
                  indent: { firstLine: 0 },
                }),
              ],
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Lớp:', font: FONT_NAME, size: 26, bold: true })],
                  spacing: { line: 300, before: 40, after: 40 },
                  indent: { firstLine: 0 },
                }),
              ],
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'D17CNPM3', font: FONT_NAME, size: 26, bold: true })],
                  spacing: { line: 300, before: 40, after: 40 },
                  indent: { firstLine: 0 },
                }),
              ],
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Giảng viên hướng dẫn:', font: FONT_NAME, size: 26, bold: true })],
                  spacing: { line: 300, before: 40, after: 40 },
                  indent: { firstLine: 0 },
                }),
              ],
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'TS. TRẦN THỊ MINH THƯ', font: FONT_NAME, size: 26, bold: true, color: 'B91C1C' })],
                  spacing: { line: 300, before: 40, after: 40 },
                  indent: { firstLine: 0 },
                }),
              ],
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Cán bộ hướng dẫn cơ sở:', font: FONT_NAME, size: 26, bold: true })],
                  spacing: { line: 300, before: 40, after: 40 },
                  indent: { firstLine: 0 },
                }),
              ],
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'ThS. Hoàng Văn Tuấn (Kỹ sư Trưởng - Công ty TNHH Công nghệ KTL)', font: FONT_NAME, size: 24 })],
                  spacing: { line: 300, before: 40, after: 40 },
                  indent: { firstLine: 0 },
                }),
              ],
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Đơn vị thực tập:', font: FONT_NAME, size: 26, bold: true })],
                  spacing: { line: 300, before: 40, after: 40 },
                  indent: { firstLine: 0 },
                }),
              ],
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'CÔNG TY TNHH CÔNG NGHỆ KTL (Số 100 ngõ 1 phố Phạm Tuấn Tài, Cầu Giấy, HN)', font: FONT_NAME, size: 24, bold: true })],
                  spacing: { line: 300, before: 40, after: 40 },
                  indent: { firstLine: 0 },
                }),
              ],
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Đơn vị ứng dụng đề tài:', font: FONT_NAME, size: 26, bold: true })],
                  spacing: { line: 300, before: 40, after: 40 },
                  indent: { firstLine: 0 },
                }),
              ],
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Bộ phận Giáo vụ – Phòng Đào tạo (kết hợp Khoa CNTT) – Trường Đại học Điện Lực', font: FONT_NAME, size: 24 })],
                  spacing: { line: 300, before: 40, after: 40 },
                  indent: { firstLine: 0 },
                }),
              ],
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            }),
          ],
        }),
      ],
      width: { size: 90, type: WidthType.PERCENTAGE },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: 260, before: 700, after: 0 },
      children: [
        new TextRun({
          text: 'Hà Nội, Năm 2026',
          font: FONT_NAME,
          size: 26, // 13pt
          italic: true,
          bold: true,
        }),
      ],
      indent: { firstLine: 0 },
    }),
  ];

  return {
    properties: {
      page: {
        size: PAGE_SIZE_A4,
        margin: {
          top: MARGIN_TOP,
          bottom: MARGIN_BOTTOM,
          left: MARGIN_LEFT,
          right: MARGIN_RIGHT,
        },
      },
    },
    children: coverElements,
  };
}

async function generateFullDocx() {
  console.log('Đang đọc tệp BAO_CAO_THUC_TAP_TOT_NGHIEP_2026.md...');
  const mdPath = path.resolve('BAO_CAO_THUC_TAP_TOT_NGHIEP_2026.md');
  const mdContent = fs.readFileSync(mdPath, 'utf8');

  // Split into sections by \newpage
  const rawSections = mdContent.split('\\newpage');
  console.log(`Tìm thấy ${rawSections.length} phân đoạn tách bởi \\newpage`);

  // Section 0 is Cover Page info (we will use custom createCoverSection)
  // Section 1..N are Prelims, Body, Appendix
  
  // Let's identify the sections:
  // Part 1: Prelims (Mục lục, Danh mục từ viết tắt, Danh mục bảng biểu, Danh mục hình vẽ, Lời cảm ơn)
  // Part 2: Main Body (Mở đầu, Chương 1, Chương 2, Chương 3, Kết luận, Tài liệu tham khảo)
  // Part 3: Phụ lục (Phụ lục 1, Phụ lục 2)

  let prelimLines = [];
  let bodyLines = [];
  let appendixLines = [];

  let currentCategory = 'prelim'; // 'prelim' -> 'body' -> 'appendix'

  for (let sIdx = 1; sIdx < rawSections.length; sIdx++) {
    const secText = rawSections[sIdx];
    const secLines = secText.split('\n');

    for (let l = 0; l < secLines.length; l++) {
      const line = secLines[l];
      const trimmed = line.trim();

      if (trimmed.startsWith('# MỞ ĐẦU') || trimmed.startsWith('# MO DAU')) {
        currentCategory = 'body';
      } else if (trimmed.startsWith('# PHỤ LỤC') || trimmed.startsWith('# PHU LUC')) {
        currentCategory = 'appendix';
      }

      if (currentCategory === 'prelim') {
        prelimLines.push(line);
      } else if (currentCategory === 'body') {
        bodyLines.push(line);
      } else {
        appendixLines.push(line);
      }
    }
  }

  console.log(`Số dòng: Prelims=${prelimLines.length}, Body=${bodyLines.length}, Appendix=${appendixLines.length}`);

  const coverSection = createCoverSection();

  // Prelims section (No page number or Roman numeral)
  const prelimElements = convertLinesToElements(prelimLines, false);
  const prelimSection = {
    properties: {
      page: {
        size: PAGE_SIZE_A4,
        margin: {
          top: MARGIN_TOP,
          bottom: MARGIN_BOTTOM,
          left: MARGIN_LEFT,
          right: MARGIN_RIGHT,
        },
      },
    },
    children: prelimElements,
  };

  // Main Body section with TOP CENTER Page Number as required by EPU rules:
  // "Số trang được đánh vào giữa bên trên (được đánh số bắt đầu từ mở đầu cho đến trang trước trang đầu tiên của phần của phụ lục)"
  const bodyElements = convertLinesToElements(bodyLines, true);
  const bodySection = {
    properties: {
      page: {
        size: PAGE_SIZE_A4,
        margin: {
          top: MARGIN_TOP,
          bottom: MARGIN_BOTTOM,
          left: MARGIN_LEFT,
          right: MARGIN_RIGHT,
        },
        pageNumbers: {
          start: 1,
          formatType: NumberFormat.DECIMAL,
        },
      },
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                children: [PageNumber.CURRENT],
                font: FONT_NAME,
                size: 24, // 12pt
              }),
            ],
            spacing: { line: 240, before: 0, after: 60 },
            indent: { firstLine: 0 },
          }),
        ],
      }),
    },
    children: bodyElements,
  };

  // Appendix section (Continuous or clean without top page header)
  const appendixElements = convertLinesToElements(appendixLines, false);
  const appendixSection = {
    properties: {
      page: {
        size: PAGE_SIZE_A4,
        margin: {
          top: MARGIN_TOP,
          bottom: MARGIN_BOTTOM,
          left: MARGIN_LEFT,
          right: MARGIN_RIGHT,
        },
      },
    },
    children: appendixElements,
  };

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: FONT_NAME,
            size: 26, // 13pt
          },
          paragraph: {
            spacing: { line: 360, lineRule: 'auto' }, // 1.5 line
          },
        },
      },
    },
    sections: [
      coverSection,
      prelimSection,
      bodySection,
      appendixSection,
    ],
  });

  console.log('Đang đóng gói tài liệu Word OpenXML (.docx)...');
  const buffer = await Packer.toBuffer(doc);

  const outputPath = path.resolve('BAO_CAO_THUC_TAP_TOT_NGHIEP_DH_DIEN_LUC_2026.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log(`\n======================================================`);
  console.log(`ĐÃ XUẤT THÀNH CÔNG TỆP WORD CHUẨN .DOCX TẠI:`);
  console.log(outputPath);
  console.log(`Kích thước tệp: ${(buffer.length / 1024).toFixed(2)} KB`);
  console.log(`======================================================\n`);
}

generateFullDocx().catch(err => {
  console.error('Lỗi khi xuất tài liệu docx:', err);
  process.exit(1);
});
