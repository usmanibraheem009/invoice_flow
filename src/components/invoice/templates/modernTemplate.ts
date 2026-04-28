import { getTranslations } from "@/src/locales/i18n";
import { dateformatter } from "@/src/utils/date-formatter";
import { formatCurrency } from "@/src/utils/helper";

// src/components/invoice/templates/modernTemplate.ts
export const modernTemplate = (data: any, currency: string) => {
  const {
    invoiceNumber,
    issueDate,
    dueDate,
    sender,
    clientName,
    items,
    subTotal,
    tax,
    taxAmount,
    total,
    footerText,
    footerText2,
  } = data;

  const t = getTranslations().invoice;
  const y = getTranslations().clients;

  // Generate table rows for items
  const itemsRows = (data.lineItems ?? [])
    .map(
      (item: any) => `
    <tr>
      <td>${item.product.name ?? item.description}</td>
      <td style="text-align: right;">${item.hours ?? item.quantity ?? 0}</td>
      <td style="text-align: right;">${formatCurrency(item.unitPrice, currency)}</td>
    </tr>`
    )
    .join('');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>${t.title}</title>
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
      .totals tr td { border: none; padding: 13px 13px; }
      .total-row { font-weight: bold; font-size: 20px; color: #667eea; padding: 25px !important; }
      .notes { margin-top: 40px; padding: 25px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 12px; }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="invoice-title">${t.title}</div>
      <div class="invoice-meta">
        <div><strong>${t.invoiceNumber}:</strong> ${invoiceNumber}</div>
        <div><strong>${t.issueDate}:</strong> ${dateformatter(issueDate)}</div>
        <div><strong>${t.dueDate}:</strong> ${dateformatter(dueDate)}</div>
      </div>
    </div>
    
    <div class="content">
      <div class="parties">
        <div class="party">
          <h3>${t.from}</h3>
          <strong>${data.currentUser.fullName ?? ''}</strong><br>
          ${data.currentUser.currentOrganization.legalName ?? `${y.noOrganization}`}<br>
          ${data.client.addressLine2 ?? ''}<br>
          ${data.lineItems.taxRate ?? `${t.noTaxRate}`}
        </div>
        <div class="party" style="text-align: right;">
          <h3>${t.to}</h3>
          <strong>${data.client.name}</strong><br>
          ${data.client.addressLine1 ?? ''}<br>
          ${data.client.addressLine2 ?? ''}<br>
          ${data.taxRate ?? `${t.noTaxRate}`}
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>${t.item}</th>
            <th style="text-align: right;">${t.quantity}</th>
            <th style="text-align: right;">${t.amount}</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>
      
      <table class="totals">
        <tr class="total-row"><td>${t.total}:</td><td style="text-align: right;">${formatCurrency(data.totalAmount, currency)}</td></tr>
      </table>
      
      <div class="notes">
        <strong style="color: #667eea;">${t.notes}:</strong><br>
        ${data.notes ?? ''}<br>
      </div>
    </div>
  </body>
  </html>
  `;
};