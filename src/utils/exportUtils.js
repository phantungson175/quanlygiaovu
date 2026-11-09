// src/utils/exportUtils.js
// Tiện ích xuất báo cáo Excel và PDF chuẩn tiếng Việt 100% không lỗi font
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { formatDate } from './dateUtils';

// =============================================
// XUẤT EXCEL
// =============================================

/**
 * Xuất danh sách tài sản ra Excel
 */
export const exportAssetsToExcel = (assets) => {
  const data = assets.map((a, i) => ({
    'STT': i + 1,
    'Mã tài sản': a.code,
    'Tên tài sản': a.name,
    'Loại tài sản': a.type,
    'Số lượng': a.quantity,
    'Phòng sử dụng': a.room,
    'Ngày đưa vào SD': formatDate(a.startDate),
    'Thời gian khấu hao (tháng)': a.depreciationMonths,
    'Tình trạng': a.condition,
    'Ghi chú': a.notes || '',
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Danh sách tài sản');
  XLSX.writeFile(wb, 'DanhSachTaiSan.xlsx');
};

/**
 * Xuất danh sách chuyên gia thỉnh giảng ra Excel
 */
export const exportExpertsToExcel = (experts) => {
  const data = experts.map((e, i) => ({
    'STT': i + 1,
    'Ông/Bà': e.honorific || (e.gender === 'Nữ' ? 'Bà' : 'Ông'),
    'Họ và tên': e.name,
    'Giới tính': e.gender || '',
    'Ngày tháng năm sinh': e.birthDate ? formatDate(e.birthDate) : '',
    'Ngày sinh': e.birthDay || '',
    'Tháng sinh': e.birthMonth || '',
    'Năm sinh': e.birthYear || '',
    'Quê quán': e.hometown || '',
    'Địa chỉ thường trú': e.permanentAddress || '',
    'Nơi ở hiện tại': e.currentAddress || '',
    'Học hàm': e.academicTitle || '',
    'Học vị': e.degree || e.title || '',
    'Ngày bổ nhiệm GS/PGS': e.appointedDate ? formatDate(e.appointedDate) : '',
    'Đơn vị tiếp nhận': e.faculty || '',
    'Đơn vị công tác': e.workplace || '',
    'Nghề nghiệp': e.occupation || '',
    'Số CCCD': e.cccd || '',
    'SĐT': e.phone || '',
    'STK': e.bankAccount || '',
    'Ngân hàng': e.bankName || '',
    'Số HĐ': e.contractNo,
    'Ngày tháng HĐ hiện tại': formatDate(e.contractSignDate),
    'Từ ngày (HĐ)': formatDate(e.startDate),
    'Đến ngày (HĐ)': formatDate(e.endDate),
    'Ghi chú': e.notes || '',
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Thỉnh giảng chuyên gia');
  XLSX.writeFile(wb, 'DanhSachThinhGiang.xlsx');
};

/**
 * Xuất danh sách văn bản đến ra Excel
 */
export const exportIncomingDocsToExcel = (docs) => {
  const data = docs.map((d, i) => ({
    'STT': i + 1,
    'Số ký hiệu': d.refNo,
    'Ngày văn bản': formatDate(d.date),
    'Nơi gửi': d.sender,
    'Trích yếu nội dung': d.summary,
    'Người phụ trách': d.assignee || '',
    'Hạn xử lý': formatDate(d.deadline),
    'Trạng thái': d.status,
    'Ghi chú': d.notes || '',
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Văn bản đến');
  XLSX.writeFile(wb, 'VanBanDen.xlsx');
};

// =============================================
// XUẤT PDF CHUẨN TIẾNG VIỆT UNICODE (KHÔNG LỖI FONT)
// =============================================

/**
 * Trình tạo PDF chuẩn Unicode Tiếng Việt sắc nét 100%
 */
const generateUnicodePdf = async ({ title, subtitle, columns, rows, filename, orientation = 'landscape' }) => {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = orientation === 'landscape' ? '1120px' : '800px';
  container.style.backgroundColor = '#ffffff';
  container.style.padding = '35px 40px';
  container.style.fontFamily = "'Segoe UI', Roboto, Arial, sans-serif";
  container.style.color = '#1c2b3a';
  container.style.boxSizing = 'border-box';

  const theadHtml = columns.map(c => `
    <th style="padding: 10px 8px; border: 1px solid #1a3a5c; background-color: #1a3a5c; color: #ffffff; font-weight: 700; text-align: ${c.align || 'left'}; width: ${c.width || 'auto'}; font-size: 11.5px;">
      ${c.header}
    </th>
  `).join('');

  const tbodyHtml = rows.map((r, i) => `
    <tr style="background-color: ${i % 2 === 1 ? '#f8fafc' : '#ffffff'};">
      ${r.map((val, ci) => `
        <td style="padding: 8px; border: 1px solid #d4dce8; font-size: 11.5px; text-align: ${columns[ci]?.align || 'left'};">
          ${val ?? ''}
        </td>
      `).join('')}
    </tr>
  `).join('');

  const now = new Date();

  container.innerHTML = `
    <div style="text-align: center; margin-bottom: 12px;">
      <h2 style="font-size: 16px; font-weight: 700; color: #1c2b3a; margin: 0; letter-spacing: 1.5px; text-transform: uppercase;">
        ${title}
      </h2>
    </div>
    <div style="margin-bottom: 10px; font-size: 11px; color: #1c2b3a;">
      Ngày xuất: ${now.toLocaleDateString('vi-VN')}
    </div>

    <table style="width: 100%; border-collapse: collapse; font-family: inherit;">
      <thead><tr>${theadHtml}</tr></thead>
      <tbody>${tbodyHtml}</tbody>
    </table>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4',
    });

    const pdfPageWidth = orientation === 'landscape' ? 297 : 210;
    const pdfPageHeight = orientation === 'landscape' ? 210 : 297;
    const margin = 10;
    const printableWidth = pdfPageWidth - margin * 2;
    const printableHeight = (canvas.height * printableWidth) / canvas.width;

    if (printableHeight <= pdfPageHeight - margin * 2) {
      pdf.addImage(imgData, 'PNG', margin, margin, printableWidth, printableHeight);
    } else {
      let heightLeft = printableHeight;
      let position = margin;

      pdf.addImage(imgData, 'PNG', margin, position, printableWidth, printableHeight);
      heightLeft -= (pdfPageHeight - margin * 2);

      while (heightLeft > 0) {
        position = heightLeft - printableHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, position, printableWidth, printableHeight);
        heightLeft -= (pdfPageHeight - margin * 2);
      }
    }

    pdf.save(filename);
  } finally {
    document.body.removeChild(container);
  }
};

/**
 * Xuất danh sách tài sản ra PDF (Tiếng Việt chuẩn đẹp)
 */
export const exportAssetsToPDF = async (assets) => {
  await generateUnicodePdf({
    title: 'DANH SÁCH TÀI SẢN',
    filename: 'DanhSachTaiSan.pdf',
    orientation: 'landscape',
    columns: [
      { header: 'STT', align: 'center', width: '45px' },
      { header: 'Mã TS', align: 'left', width: '90px' },
      { header: 'Tên tài sản', align: 'left' },
      { header: 'Loại tài sản', align: 'left' },
      { header: 'SL', align: 'center', width: '50px' },
      { header: 'Phòng sử dụng', align: 'left' },
      { header: 'Ngày đưa vào SD', align: 'center', width: '120px' },
      { header: 'Khấu hao (tháng)', align: 'center', width: '110px' },
      { header: 'Tình trạng', align: 'left', width: '120px' },
    ],
    rows: assets.map((a, i) => [
      i + 1,
      a.code,
      a.name,
      a.type,
      a.quantity,
      a.room,
      formatDate(a.startDate),
      a.depreciationMonths ? `${a.depreciationMonths} tháng` : '—',
      a.condition,
    ]),
  });
};

/**
 * Xuất danh sách chuyên gia ra PDF (Tiếng Việt chuẩn đẹp)
 */
export const exportExpertsToPDF = async (experts) => {
  await generateUnicodePdf({
    title: 'DANH SÁCH CHUYÊN GIA THỈNH GIẢNG',
    filename: 'DanhSachThinhGiang.pdf',
    orientation: 'landscape',
    columns: [
      { header: 'STT', align: 'center', width: '38px' },
      { header: 'Ông/Bà', align: 'center', width: '55px' },
      { header: 'Họ và tên', align: 'left', width: '130px' },
      { header: 'Giới tính', align: 'center', width: '60px' },
      { header: 'Ngày sinh', align: 'center', width: '75px' },
      { header: 'Học hàm/Vị', align: 'left', width: '85px' },
      { header: 'Đơn vị tiếp nhận', align: 'left', width: '120px' },
      { header: 'Nơi công tác chính', align: 'left' },
      { header: 'Số CCCD', align: 'center', width: '90px' },
      { header: 'Số ĐT', align: 'center', width: '85px' },
      { header: 'Số HĐ', align: 'center', width: '85px' },
      { header: 'Thời hạn HĐ', align: 'center', width: '120px' },
    ],
    rows: experts.map((e, i) => [
      i + 1,
      e.honorific || (e.gender === 'Nữ' ? 'Bà' : 'Ông'),
      e.name,
      e.gender || '—',
      e.birthDate ? formatDate(e.birthDate) : (e.birthYear || '—'),
      (e.academicTitle && e.academicTitle !== 'Không có' ? `${e.academicTitle}. ` : '') + (e.degree || e.title || '—'),
      e.faculty || '—',
      e.workplace || '—',
      e.cccd || '—',
      e.phone || '—',
      e.contractNo,
      `${formatDate(e.startDate)} - ${formatDate(e.endDate)}`,
    ]),
  });
};
