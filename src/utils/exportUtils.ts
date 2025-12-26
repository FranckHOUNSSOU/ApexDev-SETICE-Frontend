import * as XLSX from 'xlsx';
import type { Promotion } from '../types/promotion.types';

export const exportPromotionsToExcel = (promotions: Promotion[], filename: string = 'promotions.xlsx') => {
  const ws = XLSX.utils.json_to_sheet(promotions);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Promotions');
  XLSX.writeFile(wb, filename);
};

export const exportPromotionsToCSV = (promotions: Promotion[], filename: string = 'promotions.csv') => {
  const ws = XLSX.utils.json_to_sheet(promotions);
  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};