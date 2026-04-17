import { dateformatter } from "@/src/utils/date-formatter";

export const classicTemplate = (data: any) => {

  const itemsHtml = (data.lineItems || [])
    .map((item: any) => `
      <tr>
        <td>
          ${item.productName || item.description || ""}
        </td>

        <td style="text-align: right;">
          ${item.quantity || 0}
        </td>

        <td style="text-align: right;">
          $ ${item.lineTotal || 0}
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
        INVOICE
      </div>

      <div>
        <div>
          <strong>Invoice #:</strong>
          ${data.invoiceNumber || ""}
        </div>

        <div>
          <strong>Date:</strong>
          ${dateformatter(data.issueDate) || ""}
        </div>

        <div>
          <strong>Due:</strong>
          ${dateformatter(data.dueDate) || ""}
        </div>
      </div>
    </div>

    <div>
      <strong>Client:</strong>
      ${data.clientName || ""}
    </div>

    <table>

      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align:right">
            Qty
          </th>
          <th style="text-align:right">
            Amount
          </th>
        </tr>
      </thead>

      <tbody>
        ${itemsHtml}
      </tbody>

    </table>

    <table class="totals">

      <tr>
        <td>Subtotal:</td>
        <td style="text-align:right">
          $ ${data.subTotal || 0}
        </td>
      </tr>

      <tr>
        <td>Tax:</td>
        <td style="text-align:right">
          $ ${data.taxRate || 0}
        </td>
      </tr>

      <tr>
        <td>Discount:</td>
        <td style="text-align:right">
          $ ${data.discount || 0}
        </td>
      </tr>

      <tr class="total-row">
        <td>Total:</td>
        <td style="text-align:right">
          $ ${data.subTotal || 0}
        </td>
      </tr>

    </table>

    <div class="notes">
      <strong>Notes:</strong>
      <br/>
      ${data.notes || ""}
    </div>

  </body>

  </html>
  `;
};