import { jsPDF } from 'jspdf';
import type { Invoice, Order } from '../types/order';
import { formatCurrency } from './orderCalculations';

export function downloadInvoicePDF(invoice: Invoice, order?: Order) {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(15, 118, 110); // Teal background
  doc.rect(0, 0, 210, 28, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('MEDIFLOW AI PHARMACY', 14, 18);

  doc.setFontSize(14);
  doc.text('INVOICE', 196, 18, { align: 'right' });

  // Metadata Section
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice Details', 14, 38);

  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice Number: ${invoice.invoiceNumber}`, 14, 45);
  doc.text(`Issued Date: ${new Date(invoice.issuedAt).toLocaleString()}`, 14, 51);
  if (invoice.paymentMethod) {
    doc.text(`Payment Method: ${invoice.paymentMethod}`, 14, 57);
  }
  doc.text(`Payment Status: ${invoice.isPaid ? 'PAID' : 'UNPAID'}`, 14, invoice.paymentMethod ? 63 : 57);

  // Patient / Order Info
  doc.setFont('helvetica', 'bold');
  doc.text('Order & Patient Info', 120, 38);
  doc.setFont('helvetica', 'normal');
  doc.text(`Order ID: #${invoice.medicineOrderId}`, 120, 45);
  if (order?.patientName) {
    doc.text(`Patient: ${order.patientName}`, 120, 51);
  }
  if (order?.appointmentNumber) {
    doc.text(`Appt #: ${order.appointmentNumber}`, 120, 57);
  }
  if (order?.pharmacyName) {
    doc.text(`Pharmacy: ${order.pharmacyName}`, 120, 63);
  }

  // Divider line
  const startY = 72;
  doc.setDrawColor(220, 220, 220);
  doc.line(14, startY, 196, startY);

  // Table Header
  let currentY = startY + 8;
  doc.setFillColor(245, 247, 250);
  doc.rect(14, currentY - 4, 182, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text('Item Description', 18, currentY);
  doc.text('Dosage', 95, currentY);
  doc.text('Qty', 130, currentY, { align: 'center' });
  doc.text('Unit Price', 160, currentY, { align: 'right' });
  doc.text('Subtotal', 192, currentY, { align: 'right' });

  // Table Rows
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);

  currentY += 8;
  (invoice.items || []).forEach((item) => {
    doc.text(item.medicineName, 18, currentY);
    doc.text(item.dosage || '—', 95, currentY);
    doc.text(String(item.quantity), 130, currentY, { align: 'center' });
    doc.text(formatCurrency(item.unitPrice), 160, currentY, { align: 'right' });
    doc.text(formatCurrency(item.subtotal), 192, currentY, { align: 'right' });

    currentY += 7;
    // Add light separator
    doc.setDrawColor(240, 240, 240);
    doc.line(14, currentY - 2, 196, currentY - 2);
  });

  // Total Section
  currentY += 6;
  doc.setFillColor(240, 253, 250); // Light teal tint
  doc.rect(110, currentY - 2, 86, 14, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 118, 110);
  doc.text('Grand Total:', 115, currentY + 7);
  doc.text(formatCurrency(invoice.totalAmount), 192, currentY + 7, { align: 'right' });

  // Footer
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Thank you for choosing MediFlow AI Pharmacy System.', 105, 280, { align: 'center' });

  // Trigger Download
  doc.save(`Invoice_${invoice.invoiceNumber || invoice.id}.pdf`);
}
