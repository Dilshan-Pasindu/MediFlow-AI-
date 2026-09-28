import type { Invoice, Order } from '../types/order';
import { formatCurrency } from './orderCalculations';

export async function downloadInvoicePDF(invoice: Invoice, order?: Order) {
  try {
    const pkgName = 'jspdf';
    const jspdfModule = await import(/* @vite-ignore */ pkgName);
    const jsPDF = jspdfModule.jsPDF || jspdfModule.default;
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
  } catch (err) {
    console.warn('jsPDF not loaded, falling back to browser print invoice:', err);
    printInvoiceHTML(invoice, order);
  }
}

function printInvoiceHTML(invoice: Invoice, order?: Order) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const itemsRows = (invoice.items || [])
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.medicineName}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.dosage || '—'}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.unitPrice)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.subtotal)}</td>
    </tr>`
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice ${invoice.invoiceNumber}</title>
        <style>
          body { font-family: sans-serif; margin: 30px; color: #333; }
          .header { background: #0f766e; color: white; padding: 20px; display: flex; justify-content: space-between; align-items: center; border-radius: 6px; }
          .info-grid { display: flex; justify-content: space-between; margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #f5f7fa; padding: 10px; text-align: left; font-size: 13px; color: #555; }
          .total { margin-top: 20px; text-align: right; font-size: 18px; font-weight: bold; color: #0f766e; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>MEDIFLOW AI PHARMACY</h2>
          <h3>INVOICE</h3>
        </div>
        <div class="info-grid">
          <div>
            <strong>Invoice Details</strong><br/>
            Number: ${invoice.invoiceNumber}<br/>
            Issued: ${new Date(invoice.issuedAt).toLocaleString()}<br/>
            Status: ${invoice.isPaid ? 'PAID' : 'UNPAID'}
          </div>
          <div>
            <strong>Order & Patient Info</strong><br/>
            Order ID: #${invoice.medicineOrderId}<br/>
            ${order?.patientName ? `Patient: ${order.patientName}<br/>` : ''}
            ${order?.pharmacyName ? `Pharmacy: ${order.pharmacyName}<br/>` : ''}
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Item Description</th>
              <th>Dosage</th>
              <th style="text-align:center;">Qty</th>
              <th style="text-align:right;">Unit Price</th>
              <th style="text-align:right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>${itemsRows}</tbody>
        </table>
        <div class="total">Grand Total: ${formatCurrency(invoice.totalAmount)}</div>
        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
    </html>
  `;
  printWindow.document.write(html);
  printWindow.document.close();
}

