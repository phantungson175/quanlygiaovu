// src/utils/dateUtils.js
// Tiện ích xử lý ngày tháng
import { format, differenceInMonths, parseISO, isValid } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Format ngày thành dd/MM/yyyy
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const d = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr);
    if (!isValid(d)) return '—';
    return format(d, 'dd/MM/yyyy');
  } catch {
    return '—';
  }
};

/**
 * Format timestamp Firestore thành dd/MM/yyyy HH:mm
 */
export const formatTimestamp = (ts) => {
  if (!ts) return '—';
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return format(d, 'dd/MM/yyyy HH:mm', { locale: vi });
  } catch {
    return '—';
  }
};

/**
 * Tính số tháng còn lại từ ngày đưa vào sử dụng + khấu hao
 * @returns {number} số tháng còn lại (âm = đã hết hạn)
 */
export const getDepreciationMonthsLeft = (startDateStr, depreciationMonths) => {
  if (!startDateStr || !depreciationMonths) return null;
  const start = parseISO(startDateStr);
  const expiry = new Date(start);
  expiry.setMonth(expiry.getMonth() + parseInt(depreciationMonths));
  const now = new Date();
  return differenceInMonths(expiry, now);
};

/**
 * Tính số tháng còn lại đến ngày kết thúc hợp đồng
 */
export const getContractMonthsLeft = (endDateStr) => {
  if (!endDateStr) return null;
  const end = parseISO(endDateStr);
  const now = new Date();
  return differenceInMonths(end, now);
};

/**
 * Trả về class cảnh báo dựa trên số tháng còn lại
 */
export const getWarningRowClass = (monthsLeft, warningThreshold = 1) => {
  if (monthsLeft === null) return '';
  if (monthsLeft <= 0) return 'row-danger';
  if (monthsLeft <= warningThreshold) return 'row-warning';
  return '';
};

/**
 * Trả về badge status cho khấu hao tài sản
 */
export const getDepreciationBadge = (monthsLeft) => {
  if (monthsLeft === null) return { label: '—', variant: 'badge-default' };
  if (monthsLeft <= 0) return { label: 'Đã hết khấu hao', variant: 'badge-danger' };
  if (monthsLeft <= 1) return { label: `Sắp hết (${monthsLeft} tháng)`, variant: 'badge-warning' };
  return { label: `Còn ${monthsLeft} tháng`, variant: 'badge-success' };
};

/**
 * Trả về badge status cho hợp đồng chuyên gia
 */
export const getContractBadge = (monthsLeft) => {
  if (monthsLeft === null) return { label: '—', variant: 'badge-default' };
  if (monthsLeft <= 0) return { label: 'Đã hết hạn HĐ', variant: 'badge-danger' };
  if (monthsLeft <= 2) return { label: `Sắp hết hạn (${monthsLeft} tháng)`, variant: 'badge-warning' };
  return { label: `Còn ${monthsLeft} tháng`, variant: 'badge-success' };
};

/**
 * Hôm nay dạng YYYY-MM-DD (dùng cho giá trị mặc định input date)
 */
export const todayStr = () => format(new Date(), 'yyyy-MM-dd');
