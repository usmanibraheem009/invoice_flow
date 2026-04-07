// src/components/invoice/templates/modernTemplate2.ts
export const professionalTemplate = (invoice: any) => {
  const {
    invoiceNumber,
    createdDate,
    dueDate,
    sender,
    receiver,
    items,
    subTotal,
    taxRate,
    taxAmount,
    total,
    currency = '$',
    footerText,
    footerText2,
  } = invoice;

  // Generate table rows for items
  const itemsRows = items
    .map(
      (item: any) => `
      <tr>
        <td>${item.description}</td>
        <td style="text-align: right;">${item.hours ?? item.quantity ?? 0}</td>
        <td style="text-align: right;">${currency} ${item.price}</td>
      </tr>`
    )
    .join('');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Invoice</title>
    <style>
      body { font-family: 'Inter', -apple-system, sans-serif; margin: 0; padding: 0; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; }
      .invoice-title { font-size: 42px; font-weight: 700; margin-bottom: 20px; }
      .invoice-meta { display: flex; gap: 30px; font-size: 14px; }
      .content { padding: 40px; }
      .parties { display: flex; justify-content: space-between; margin-bottom: 40px; background: #f8f9fa; padding: 30px; border-radius: 12px; }
      .party h3 { color: #667eea; font-size: 14px; margin-bottom: 10px; font-weight: 600; }
      table { width: 100%; border-collapse: collapse; margin: 30px 0; }
      th { background: #667eea; color: white; padding: 15px; text-align: left; font-weight: 600; }
      td { padding: 15px; border-bottom: 1px solid #e9ecef; }
      .totals { width: 350px; margin-left: auto; background: #f8f9fa; padding: 20px; border-radius: 12px; }
      .totals tr td { border: none; padding: 10px 0; }
      .total-row { font-weight: bold; font-size: 20px; color: #667eea; border-top: 2px solid #667eea; padding-top: 15px !important; }
      .notes { margin-top: 40px; padding: 25px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 12px; }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="invoice-title">INVOICE</div>
      <div class="invoice-meta">
        <div><strong>Invoice #:</strong> ${invoiceNumber}</div>
        <div><strong>Date:</strong> ${createdDate}</div>
        <div><strong>Due:</strong> ${dueDate}</div>
      </div>
    </div>
    
    <div class="content">
      <div class="parties">
        <div class="party">
          <h3>FROM</h3>
          <strong>${sender.name}</strong><br>
          ${sender.address1}<br>
          ${sender.address2}<br>
          ${sender.tax}
        </div>
        <div class="party" style="text-align: right;">
          <h3>TO</h3>
          <strong>${receiver.name}</strong><br>
          ${receiver.address1}<br>
          ${receiver.address2}<br>
          ${receiver.tax}
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th style="text-align: right;">Hours</th>
            <th style="text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>
      
      <table class="totals">
        <tr><td>Subtotal:</td><td style="text-align: right;">${currency} ${subTotal}</td></tr>
        <tr><td>Tax (${taxRate}%):</td><td style="text-align: right;">${currency} ${taxAmount}</td></tr>
        <tr class="total-row"><td>Total:</td><td style="text-align: right;">${currency} ${total}</td></tr>
      </table>
      
      <div class="notes">
        <strong style="color: #667eea;">Notes:</strong><br>
        ${footerText}<br>
        ${footerText2}
      </div>
    </div>
  </body>
  </html>
  `;
};