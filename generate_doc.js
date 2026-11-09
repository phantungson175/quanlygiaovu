// generate_doc.js
// Script tạo file Microsoft Word (.doc) chuẩn quy định Bộ GD&ĐT và Trường Đại học
import fs from 'fs';
import path from 'path';

const mdPath = path.resolve('BAO_CAO_THUC_TAP_TOT_NGHIEP_2026.md');
const mdContent = fs.readFileSync(mdPath, 'utf8');

// Hàm chuyển đổi Markdown sang HTML chuẩn Word với CSS MSO đặc tả
function convertMarkdownToWordHtml(markdown) {
  const lines = markdown.split('\n');
  let html = '';
  let inTable = false;
  let tableHeader = false;
  let tableRows = [];
  let inCode = false;
  let codeBuffer = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Xử lý Code Block
    if (line.trim().startsWith('```')) {
      if (!inCode) {
        inCode = true;
        codeBuffer = [];
      } else {
        inCode = false;
        html += `<pre class="code-block">${codeBuffer.join('\n')}</pre>\n`;
      }
      continue;
    }
    if (inCode) {
      codeBuffer.push(line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
      continue;
    }

    // Xử lý ngắt trang
    if (line.trim() === '\\newpage') {
      html += `<br clear="all" style="mso-special-character:line-break;page-break-before:always" />\n`;
      continue;
    }

    // Xử lý Table
    if (line.trim().startsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableHeader = true;
        tableRows = [];
      }
      // Bỏ qua dòng phân cách | :--- | :--- |
      if (line.includes('---')) {
        tableHeader = false;
        continue;
      }
      const cells = line.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1).map(c => c.trim());
      tableRows.push({ isHeader: tableHeader, cells });
      continue;
    } else if (inTable) {
      inTable = false;
      // Xuất bảng
      html += `<table class="report-table">\n`;
      for (const row of tableRows) {
        html += `  <tr>\n`;
        for (const c of row.cells) {
          const tag = row.isHeader ? 'th' : 'td';
          let parsedCell = parseInline(c);
          html += `    <${tag}>${parsedCell}</${tag}>\n`;
        }
        html += `  </tr>\n`;
      }
      html += `</table>\n`;
      tableRows = [];
    }

    // Heading 1 (# ...)
    if (line.startsWith('# ')) {
      const text = line.replace('# ', '').trim();
      html += `<h1 class="heading-1">${parseInline(text)}</h1>\n`;
      continue;
    }

    // Heading 2 (## ...)
    if (line.startsWith('## ')) {
      const text = line.replace('## ', '').trim();
      html += `<h2 class="heading-2">${parseInline(text)}</h2>\n`;
      continue;
    }

    // Heading 3 (### ...)
    if (line.startsWith('### ')) {
      const text = line.replace('### ', '').trim();
      html += `<h3 class="heading-3">${parseInline(text)}</h3>\n`;
      continue;
    }

    // Tiêu đề Bảng biểu (nằm trên bảng)
    if (line.trim().startsWith('*Bảng ') && line.trim().endsWith('*')) {
      const text = line.trim().replace(/^\*|\*$/g, '');
      html += `<p class="table-caption">${parseInline(text)}</p>\n`;
      continue;
    }

    // Tiêu đề Hình vẽ (nằm dưới hình)
    if (line.trim().startsWith('*Hình ') && line.trim().endsWith('*')) {
      const text = line.trim().replace(/^\*|\*$/g, '');
      html += `<p class="figure-caption">${parseInline(text)}</p>\n`;
      continue;
    }

    // Danh sách (- hoặc *)
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const text = line.trim().substring(2);
      html += `<p class="list-item">• ${parseInline(text)}</p>\n`;
      continue;
    }

    // Đoạn văn thông thường
    if (line.trim().length > 0) {
      // Bỏ qua đường kẻ ngang ---
      if (line.trim() === '---') {
        html += `<hr />\n`;
      } else {
        html += `<p class="normal-para">${parseInline(line)}</p>\n`;
      }
    }
  }

  return html;
}

function parseInline(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/\*(.*?)\*/g, '<i>$1</i>')
    .replace(/`(.*?)`/g, '<code style="font-family:\'Courier New\';background:#f0f2f5;padding:1px 4px;border-radius:3px;">$1</code>')
    .replace(/\$(.*?)\$/g, '<i>$1</i>');
}

const bodyHtml = convertMarkdownToWordHtml(mdContent);

// Template Word processing Document
const wordDocument = `
<html xmlns:o='urn:schemas-microsoft-com:office:office'
      xmlns:w='urn:schemas-microsoft-com:office:word'
      xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>Báo Cáo Thực Tập Tốt Nghiệp 2026</title>
<!--[if gte mso 9]>
<xml>
 <w:WordDocument>
  <w:View>Print</w:View>
  <w:Zoom>100</w:Zoom>
  <w:DoNotOptimizeForBrowser/>
 </w:WordDocument>
</xml>
<![endif]-->
<style>
@page Section1 {
    size: 21.0cm 29.7cm; /* Khổ A4 */
    margin: 2.5cm 2.0cm 2.5cm 3.5cm; /* Lề trên 2.5cm, phải 2.0cm, dưới 2.5cm, trái 3.5cm */
    mso-header-margin: 1.5cm;
    mso-footer-margin: 1.5cm;
    mso-header: h1;
    mso-footer: f1;
}
div.Section1 {
    page: Section1;
}
p.MsoHeader, div.MsoHeader {
    margin: 0cm;
    text-align: center;
    font-size: 10pt;
    font-family: 'Times New Roman', serif;
}
p.MsoFooter, div.MsoFooter {
    margin: 0cm;
    text-align: center;
    font-size: 10pt;
    font-family: 'Times New Roman', serif;
}
body {
    font-family: 'Times New Roman', serif;
    font-size: 13pt;
    line-height: 1.5;
    text-align: justify;
    color: #000000;
}
h1.heading-1 {
    font-family: 'Times New Roman', serif;
    font-size: 16pt;
    font-weight: bold;
    text-align: center;
    text-transform: uppercase;
    margin-top: 24pt;
    margin-bottom: 14pt;
    color: #0d233a;
    page-break-before: always;
}
h2.heading-2 {
    font-family: 'Times New Roman', serif;
    font-size: 14pt;
    font-weight: bold;
    margin-top: 16pt;
    margin-bottom: 8pt;
    color: #1a365d;
}
h3.heading-3 {
    font-family: 'Times New Roman', serif;
    font-size: 13pt;
    font-weight: bold;
    margin-top: 12pt;
    margin-bottom: 6pt;
}
p.normal-para {
    font-family: 'Times New Roman', serif;
    font-size: 13pt;
    line-height: 1.5;
    text-indent: 1cm; /* Thụt đầu dòng 1cm */
    margin-top: 0pt;
    margin-bottom: 6pt;
    text-align: justify;
}
p.list-item {
    font-family: 'Times New Roman', serif;
    font-size: 13pt;
    line-height: 1.5;
    text-indent: 0.5cm;
    margin-top: 0pt;
    margin-bottom: 4pt;
    text-align: justify;
}
p.table-caption {
    font-family: 'Times New Roman', serif;
    font-size: 12pt;
    font-weight: bold;
    font-style: italic;
    text-align: center;
    margin-top: 12pt;
    margin-bottom: 4pt;
}
p.figure-caption {
    font-family: 'Times New Roman', serif;
    font-size: 12pt;
    font-style: italic;
    text-align: center;
    margin-top: 4pt;
    margin-bottom: 14pt;
}
table.report-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 6pt;
    margin-bottom: 12pt;
    font-family: 'Times New Roman', serif;
    font-size: 11.5pt;
    line-height: 1.3;
}
table.report-table th {
    border: 1px solid #333333;
    padding: 6pt 8pt;
    background-color: #f2f4f8;
    font-weight: bold;
    text-align: center;
}
table.report-table td {
    border: 1px solid #333333;
    padding: 5pt 7pt;
    text-align: left;
    vertical-align: middle;
}
pre.code-block {
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 10pt;
    font-family: 'Courier New', monospace;
    font-size: 10pt;
    line-height: 1.3;
    margin: 8pt 0;
    white-space: pre-wrap;
    word-break: break-all;
}
hr {
    border: 0;
    border-top: 1px solid #cccccc;
    margin: 16pt 0;
}
</style>
</head>
<body>
<div class="Section1">

<!-- Header chứa số trang ở giữa bên trên theo quy định -->
<div style='mso-element:header' id='h1'>
  <p class="MsoHeader" style="text-align:center;">
    <span style='mso-field-code:" PAGE "'></span>
  </p>
</div>
<div style='mso-element:footer' id='f1'>
  <p class="MsoFooter">
    <span>Báo cáo Thực tập Tốt nghiệp - Hệ thống Quản lý Giáo vụ 2026</span>
  </p>
</div>

${bodyHtml}

</div>
</body>
</html>
`;

let outputPath = path.resolve('BAO_CAO_THUC_TAP_TOT_NGHIEP_2026.doc');
try {
  fs.writeFileSync(outputPath, wordDocument, 'utf8');
  console.log(`Đã xuất thành công file Word tại: ${outputPath}`);
} catch (err) {
  if (err.code === 'EBUSY') {
    const altPath = path.resolve('BAO_CAO_THUC_TAP_TOT_NGHIEP_DH_DIEN_LUC_2026.doc');
    try {
      fs.writeFileSync(altPath, wordDocument, 'utf8');
      console.log(`File gốc đang mở trong Word, đã xuất file sang: ${altPath}`);
    } catch (err2) {
      if (err2.code === 'EBUSY') {
        const newPath = path.resolve('BAO_CAO_THUC_TAP_TOT_NGHIEP_DH_DIEN_LUC_BAN_MOI.doc');
        fs.writeFileSync(newPath, wordDocument, 'utf8');
        console.log(`Cả 2 file đang mở trong Word, đã xuất file sang: ${newPath}`);
      } else {
        throw err2;
      }
    }
  } else {
    throw err;
  }
}

