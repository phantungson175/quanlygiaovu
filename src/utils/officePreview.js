// src/utils/officePreview.js
// Trình đọc & dựng xem trước trực tiếp cho Word (.docx) và Excel (.xlsx, .xls, .csv) trên trình duyệt
import * as XLSX from 'xlsx';
import { unzipSync, strFromU8 } from 'fflate';

const MAX_EXCEL_ROWS = 500;
const MAX_EXCEL_COLS = 50;

/**
 * Đọc file Excel (.xlsx, .xls, .csv) thành danh sách Sheet và mảng dòng/cột
 */
export const parseExcelPreview = (arrayBuffer) => {
  const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true });
  const sheets = workbook.SheetNames.map((name) => {
    const sheet = workbook.Sheets[name];
    const allRows = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: '',
      raw: false,
    });
    const truncated = allRows.length > MAX_EXCEL_ROWS;
    const slicedRows = allRows.slice(0, MAX_EXCEL_ROWS).map((row) =>
      Array.isArray(row) ? row.slice(0, MAX_EXCEL_COLS) : []
    );
    const maxCols = slicedRows.reduce((max, r) => Math.max(max, r.length), 0);
    return {
      name,
      rows: slicedRows,
      maxCols: Math.max(1, maxCols),
      totalRows: allRows.length,
      truncated,
    };
  });
  return { sheets };
};

// Lấy giá trị thuộc tính XML không phân biệt prefix namespace (w:val, r:embed, ...)
const getXmlAttr = (el, localName) => {
  if (!el || !el.attributes) return null;
  for (let i = 0; i < el.attributes.length; i++) {
    const attr = el.attributes[i];
    if (attr.localName === localName || attr.name === localName) {
      return attr.value;
    }
  }
  return null;
};

// Tìm con trực tiếp theo localName
const getDirectChildren = (parent, localName) => {
  const out = [];
  if (!parent || !parent.childNodes) return out;
  for (let i = 0; i < parent.childNodes.length; i++) {
    const child = parent.childNodes[i];
    if (child.nodeType === 1 && child.localName === localName) {
      out.push(child);
    }
  }
  return out;
};

const getFirstDirectChild = (parent, localName) => {
  if (!parent || !parent.childNodes) return null;
  for (let i = 0; i < parent.childNodes.length; i++) {
    const child = parent.childNodes[i];
    if (child.nodeType === 1 && child.localName === localName) {
      return child;
    }
  }
  return null;
};

const isToggleOn = (propEl) => {
  if (!propEl) return false;
  const val = getXmlAttr(propEl, 'val');
  return val !== '0' && val !== 'false' && val !== 'off';
};

const uint8ToBase64 = (bytes) => {
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
};

const getImageMime = (path) => {
  const ext = (path.split('.').pop() || '').toLowerCase();
  if (ext === 'png') return 'image/png';
  if (ext === 'gif') return 'image/gif';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'svg') return 'image/svg+xml';
  if (ext === 'bmp') return 'image/bmp';
  return 'image/jpeg';
};

/**
 * Đọc file Word (.docx) từ ArrayBuffer thành cấu trúc hiển thị giữ nguyên định dạng, bảng biểu, hình ảnh
 */
export const parseDocxPreview = (arrayBuffer) => {
  let files;
  try {
    files = unzipSync(new Uint8Array(arrayBuffer));
  } catch {
    return { supported: false, reason: 'not_zip' };
  }

  const docXmlBytes = files['word/document.xml'];
  if (!docXmlBytes) {
    return { supported: false, reason: 'not_docx' };
  }

  const parser = new DOMParser();

  // Đọc bảng quan hệ rId -> target (hình ảnh & liên kết)
  const relsMap = {};
  const relsBytes = files['word/_rels/document.xml.rels'];
  if (relsBytes) {
    try {
      const relsDoc = parser.parseFromString(strFromU8(relsBytes), 'application/xml');
      const relEls = relsDoc.getElementsByTagName('*');
      for (let i = 0; i < relEls.length; i++) {
        const el = relEls[i];
        if (el.localName === 'Relationship') {
          const id = getXmlAttr(el, 'Id');
          const target = getXmlAttr(el, 'Target');
          const type = getXmlAttr(el, 'Type') || '';
          const mode = getXmlAttr(el, 'TargetMode') || '';
          if (id && target) {
            relsMap[id] = { target, type, isExternal: mode === 'External' };
          }
        }
      }
    } catch (e) {
      console.warn('Parse docx rels error:', e);
    }
  }

  // Cache dataUrl cho ảnh nhúng trong word/media/
  const mediaCache = {};
  const resolveImageDataUrl = (rId) => {
    if (!rId || !relsMap[rId]) return null;
    if (mediaCache[rId]) return mediaCache[rId];
    const rel = relsMap[rId];
    if (rel.isExternal) return rel.target;
    const normalizedPath = rel.target.startsWith('/')
      ? rel.target.slice(1)
      : `word/${rel.target.replace(/^\.\//, '')}`;
    const imgBytes = files[normalizedPath] || files[rel.target];
    if (!imgBytes) return null;
    const mime = getImageMime(normalizedPath);
    const dataUrl = `data:${mime};base64,${uint8ToBase64(imgBytes)}`;
    mediaCache[rId] = dataUrl;
    return dataUrl;
  };

  const xmlDoc = parser.parseFromString(strFromU8(docXmlBytes), 'application/xml');
  const bodies = xmlDoc.getElementsByTagName('*');
  let bodyEl = null;
  for (let i = 0; i < bodies.length; i++) {
    if (bodies[i].localName === 'body') {
      bodyEl = bodies[i];
      break;
    }
  }
  if (!bodyEl) {
    return { supported: false, reason: 'invalid_xml' };
  }

  // Đọc một Run (<w:r>)
  const parseRun = (rEl, linkHref = null) => {
    const rPr = getFirstDirectChild(rEl, 'rPr');
    const style = {};
    if (rPr) {
      if (isToggleOn(getFirstDirectChild(rPr, 'b'))) style.bold = true;
      if (isToggleOn(getFirstDirectChild(rPr, 'i'))) style.italic = true;
      const uEl = getFirstDirectChild(rPr, 'u');
      if (uEl && getXmlAttr(uEl, 'val') !== 'none') style.underline = true;
      if (isToggleOn(getFirstDirectChild(rPr, 'strike'))) style.strike = true;

      const colorEl = getFirstDirectChild(rPr, 'color');
      const colorVal = colorEl ? getXmlAttr(colorEl, 'val') : null;
      if (colorVal && colorVal !== 'auto' && /^[0-9a-fA-F]{6}$/.test(colorVal)) {
        style.color = `#${colorVal}`;
      }

      const szEl = getFirstDirectChild(rPr, 'sz');
      const szVal = szEl ? parseInt(getXmlAttr(szEl, 'val'), 10) : NaN;
      if (!isNaN(szVal) && szVal > 0) {
        style.fontSize = Math.round((szVal / 2) * 10) / 10; // pt
      }
    }

    const items = [];
    for (let i = 0; i < rEl.childNodes.length; i++) {
      const node = rEl.childNodes[i];
      if (node.nodeType !== 1) continue;
      if (node.localName === 't') {
        items.push({ kind: 'text', text: node.textContent || '', style, linkHref });
      } else if (node.localName === 'tab') {
        items.push({ kind: 'text', text: '\u00A0\u00A0\u00A0\u00A0', style, linkHref });
      } else if (node.localName === 'br') {
        items.push({ kind: 'br' });
      } else if (node.localName === 'drawing' || node.localName === 'pict') {
        const descendants = node.getElementsByTagName('*');
        for (let d = 0; d < descendants.length; d++) {
          const desc = descendants[d];
          if (desc.localName === 'blip') {
            const embedId = getXmlAttr(desc, 'embed') || getXmlAttr(desc, 'link');
            const src = resolveImageDataUrl(embedId);
            if (src) items.push({ kind: 'img', src });
          } else if (desc.localName === 'imagedata') {
            const relId = getXmlAttr(desc, 'id');
            const src = resolveImageDataUrl(relId);
            if (src) items.push({ kind: 'img', src });
          }
        }
      }
    }
    return items;
  };

  // Đọc một đoạn văn (<w:p>)
  const parseParagraph = (pEl) => {
    const pPr = getFirstDirectChild(pEl, 'pPr');
    let align = 'left';
    let heading = null;
    let isList = false;

    if (pPr) {
      const jcEl = getFirstDirectChild(pPr, 'jc');
      const jcVal = jcEl ? getXmlAttr(jcEl, 'val') : null;
      if (jcVal === 'center') align = 'center';
      else if (jcVal === 'right') align = 'right';
      else if (jcVal === 'both' || jcVal === 'distribute') align = 'justify';

      const styleEl = getFirstDirectChild(pPr, 'pStyle');
      const styleVal = styleEl ? (getXmlAttr(styleEl, 'val') || '') : '';
      if (/^Title$/i.test(styleVal)) heading = 'title';
      else if (/^Subtitle$/i.test(styleVal)) heading = 'subtitle';
      else if (/Heading1|1$/i.test(styleVal) && /Heading|Tiêu/i.test(styleVal)) heading = 'h1';
      else if (/Heading2|2$/i.test(styleVal) && /Heading|Tiêu/i.test(styleVal)) heading = 'h2';
      else if (/Heading3|3$/i.test(styleVal) && /Heading|Tiêu/i.test(styleVal)) heading = 'h3';

      if (getFirstDirectChild(pPr, 'numPr')) {
        isList = true;
      }
    }

    const runs = [];
    for (let i = 0; i < pEl.childNodes.length; i++) {
      const child = pEl.childNodes[i];
      if (child.nodeType !== 1) continue;
      if (child.localName === 'r') {
        runs.push(...parseRun(child));
      } else if (child.localName === 'hyperlink') {
        const rId = getXmlAttr(child, 'id');
        const href = rId && relsMap[rId]?.isExternal ? relsMap[rId].target : null;
        getDirectChildren(child, 'r').forEach((hr) => {
          runs.push(...parseRun(hr, href));
        });
      } else if (child.localName === 'ins') {
        getDirectChildren(child, 'r').forEach((ir) => {
          runs.push(...parseRun(ir));
        });
      }
    }

    return { type: 'paragraph', align, heading, isList, runs };
  };

  // Đọc một bảng (<w:tbl>)
  const parseTable = (tblEl) => {
    const trEls = getDirectChildren(tblEl, 'tr');
    const rows = trEls.map((trEl) => {
      const tcEls = getDirectChildren(trEl, 'tc');
      return tcEls.map((tcEl) => {
        const tcPr = getFirstDirectChild(tcEl, 'tcPr');
        let colSpan = 1;
        let bgColor = null;
        if (tcPr) {
          const spanEl = getFirstDirectChild(tcPr, 'gridSpan');
          const spanVal = spanEl ? parseInt(getXmlAttr(spanEl, 'val'), 10) : NaN;
          if (!isNaN(spanVal) && spanVal > 1) colSpan = spanVal;

          const shdEl = getFirstDirectChild(tcPr, 'shd');
          const fill = shdEl ? getXmlAttr(shdEl, 'fill') : null;
          if (fill && fill !== 'auto' && /^[0-9a-fA-F]{6}$/.test(fill)) {
            bgColor = `#${fill}`;
          }
        }
        const blocks = parseContainerBlocks(tcEl);
        return { colSpan, bgColor, blocks };
      });
    });
    return { type: 'table', rows };
  };

  function parseContainerBlocks(containerEl) {
    const blocks = [];
    for (let i = 0; i < containerEl.childNodes.length; i++) {
      const child = containerEl.childNodes[i];
      if (child.nodeType !== 1) continue;
      if (child.localName === 'p') {
        blocks.push(parseParagraph(child));
      } else if (child.localName === 'tbl') {
        blocks.push(parseTable(child));
      }
    }
    return blocks;
  }

  const blocks = parseContainerBlocks(bodyEl);
  return { supported: true, blocks };
};
