import { getTranslations } from "@/src/locales/i18n";
import { dateformatter } from "@/src/utils/date-formatter";
import { formatCurrency } from "@/src/utils/helper";

export const classicTemplate = (data: any, currency: string) => {

  const t = getTranslations().invoice;
  const y = getTranslations().clients;

  const itemsHtml = (data.lineItems || [])
    .map((item: any) => `
      <tr>
        <td>
          ${item.product.name || item.description || ""}
        </td>

        <td style="text-align: right;">
          ${item.quantity || 0}
        </td>

        <td style="text-align: right;">
          ${formatCurrency(item.lineTotal || 0, currency)}
        </td>
      </tr>
    `)
    .join("");

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <style>
      body {
        font-family: Helvetica, Arial;
        margin: 40px;
        color: #333;
      }

      .header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 40px;
        border-bottom: 2px solid #000;
        padding-bottom: 20px;
      }

      .invoice-title {
        font-size: 36px;
        font-weight: bold;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin: 30px 0;
      }

      th {
        background: #f5f5f5;
        padding: 12px;
        text-align: left;
      }

      td {
        padding: 12px;
        border-bottom: 1px solid #eee;
      }

      .totals {
        width: 300px;
        margin-left: auto;
      }

      .total-row {
        font-weight: bold;
        font-size: 18px;
      }

      .notes {
        margin-top: 40px;
        padding: 20px;
        background: #f9f9f9;
      }

    </style>
  </head>

  <body>

    <div class="header">
      <div class="invoice-title">
        ${t.title}
      </div>

      <div>
        <div>
          <strong>${t.title} #:</strong>
          ${data.invoiceNumber || ""}
        </div>

        <div>
          <strong>${t.issueDate}:</strong>
          ${dateformatter(data.issueDate) || ""}
        </div>

        <div>
          <strong>${t.dueDate}:</strong>
          ${dateformatter(data.dueDate) || ""}
        </div>
      </div>
    </div>

    <div>
      <strong>${y.clientName}:</strong>
      ${data.client.name || ""}
    </div>

    <table>

      <thead>
        <tr>
          <th>${t.item}</th>
          <th style="text-align:right">
            ${t.quantity}
          </th>
          <th style="text-align:right">
            ${t.amount}
          </th>
        </tr>
      </thead>

      <tbody>
        ${itemsHtml}
      </tbody>

    </table>

    <table class="totals">

      <tr>
        <td>${t.subtotal}:</td>
        <td style="text-align:right">
          ${data.subTotal || 0}
        </td>
      </tr>

      <tr>
        <td>${t.tax}:</td>
        <td style="text-align:right">
          ${data.taxRate || 0}
        </td>
      </tr>

      <tr class="total-row">
        <td>${t.total}:</td>
        <td style="text-align:right">
          ${formatCurrency(data.totalAmount || 0, currency)}
        </td>
      </tr>

    </table>

    <div class="notes">
      <strong>${t.notes}:</strong>
      <br/>
      ${data.notes || ""}
    </div>

  </body>

  </html>
  `;
};