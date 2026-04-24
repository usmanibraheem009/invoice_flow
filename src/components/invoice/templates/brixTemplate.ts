import { getTranslations } from "@/src/locales/i18n";
import { dateformatter } from "@/src/utils/date-formatter";
import { formatCurrency } from "@/src/utils/helper";

export const brixTemplate = (data: any) => {
  const {
    invoiceNumber,
    issueDate,
    dueDate,
    paymentTerms,
    client,
    lineItems = [],
    subTotal,
    taxAmount,
    totalAmount,
    currency = "USD",
    notes,
  } = data;

  const computedSubTotal =
    subTotal ??
    lineItems.reduce(
      (sum: number, item: any) =>
        sum + item.unitPrice * (item.hours ?? item.quantity ?? 1),
      0
    );

  const computedTaxAmount = taxAmount ?? 0;
  const t = getTranslations().invoice;

  const itemRows = lineItems
    .map(
      (item: any, index: number) => {
        const qty = item.hours ?? item.quantity ?? 1;
        const amount = item.unitPrice * qty;
        return `
        <tr>
          <td style="padding: 20px 15px; border-bottom: 1px solid #eee; color: #555; width: 45%;">${item.product.name ?? item.description ?? ""}</td>
          <td style="padding: 20px 15px; border-bottom: 1px solid #eee; color: #555; text-align: center; width: 15%;">${qty}</td>
          <td style="padding: 20px 15px; border-bottom: 1px solid #eee; color: #555; text-align: right; width: 20%;">${formatCurrency(item.unitPrice, currency)}</td>
          <td style="padding: 20px 15px; border-bottom: 1px solid #eee; color: #555; text-align: right; width: 20%;"><strong>${formatCurrency(amount, currency)}</strong></td>
        </tr>`;
      }
    )
    .join("");

  const taxRow =
    computedTaxAmount > 0
      ? `
        <div style="display: table-row;">
          <span>TAX</span>
          <span>${formatCurrency(computedTaxAmount, currency)}</span>
        </div>`
      : "";

  const notesSection = notes
    ? `
      <div style="margin: 30px 0; padding: 20px; background: #f9f9f9; border-radius: 12px;">
        <p style="font-size: 12px; font-weight: 700; color: #2581FF; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">${t.notes}</p>
        <p style="font-size: 13px; color: #555; line-height: 20px;">${notes}</p>
      </div>`
    : "";

  const paymentTermsCell = paymentTerms
    ? `<p style="margin-top: 6px; font-size: 13px; color: #555;"><strong>Terms:</strong> ${paymentTerms}</p>`
    : "";

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=600, initial-scale=0.5" />
      <title>Invoice ${invoiceNumber}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #ffffff; color: #333; }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 0; }
        }
      </style>
    </head>
    <body>

      <!-- CONTAINER -->
      <div style="background: white; padding: 40px; position: relative; overflow: hidden;">

        <!-- HEADER -->
        <div style="background: #2581FF; color: white; padding: 30px; border-radius: 20px; margin-bottom: 40px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <!-- Logo + Brand -->
              <td style="vertical-align: top; width: 30%;">
                <div style="background: white; padding: 12px 16px; border-radius: 16px; display: inline-block;">
                  <span style="color: #000; font-weight: 800; font-size: 22px; letter-spacing: -0.5px;">
                    ${data?.currentUser?.fullName ?? "Your Company"}
                  </span>
                </div>
              </td>

              <!-- Company details -->
              <td style="vertical-align: top; padding-left: 20px; width: 30%;">
                <p style="font-size: 13px; color: rgba(255,255,255,0.85); line-height: 22px;">
                  ${data?.currentUser?.email ?? ""}<br/>
                  ${data?.currentUser?.phone ?? ""}
                </p>
              </td>

              <!-- Invoice number badge -->
              <td style="text-align: right; vertical-align: top; width: 40%;">
                <span style="background: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 30px; font-weight: 700; font-size: 14px; letter-spacing: 0.5px;">
                ${invoiceNumber}
                </span>
              </td>
            </tr>
          </table>
        </div>

        <!-- BILLING INFO -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
          <tr>
            <!-- Bill To -->
            <td style="width: 50%; vertical-align: top; padding-right: 20px;">
              <p style="font-size: 12px; color: #777; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">👤 ${t.billTo}:</p>
              <p style="font-size: 15px; font-weight: 700; color: #1A2B4A; margin-bottom: 6px;">${client.name}</p>
              ${client.addressLine1 ? `<p style="font-size: 13px; color: #555; line-height: 20px;">${client.addressLine1}</p>` : ""}
              ${client.addressLine2 ? `<p style="font-size: 13px; color: #555; line-height: 20px;">${client.addressLine2}</p>` : ""}
              ${client.city || client.state ? `<p style="font-size: 13px; color: #555; line-height: 20px;">${[client.city, client.state, client.country].filter(Boolean).join(", ")}</p>` : ""}
              ${client.phone ? `<p style="font-size: 13px; color: #555; margin-top: 4px;">${client.phone}</p>` : ""}
              ${client.clientEmail ? `<p style="font-size: 13px; color: #2581FF; margin-top: 4px;">${client.clientEmail}</p>` : ""}
            </td>

            <!-- Date Info -->
            <td style="width: 50%; vertical-align: top; padding-left: 20px;">
              <p style="font-size: 12px; color: #777; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">📅 ${t.date}:</p>
              <p style="font-size: 13px; color: #555; margin-bottom: 6px;">${t.issueDate}: <strong>${dateformatter(issueDate)}</strong></p>
              <p style="font-size: 13px; color: #555; margin-bottom: 6px;">${t.dueDate}: <strong>${dateformatter(dueDate)}</strong></p>
              <p style="font-size: 13px; color: #555;">${t.invoiceStatus}: <strong style="color: #2581FF;">${data.status ?? "Unpaid"}</strong></p>
              ${paymentTermsCell}
            </td>
          </tr>
        </table>

        <!-- LINE ITEMS TABLE -->
        <table style="width: 100%; border-collapse: separate; border-spacing: 0 10px; margin-bottom: 10px;">
          <thead>
            <tr>
              <th style="text-align: left; background: #F8FAFC; padding: 15px; border-radius: 10px; font-size: 12px; color: #555; width: 45%;">🕹️ ${t.item}</th>
              <th style="text-align: center; background: #F8FAFC; padding: 15px; border-radius: 10px; font-size: 12px; color: #555; width: 15%;">📊 ${t.quantity}</th>
              <th style="text-align: right; background: #F8FAFC; padding: 15px; border-radius: 10px; font-size: 12px; color: #555; width: 20%;">💵 ${t.price}</th>
              <th style="text-align: right; background: #F8FAFC; padding: 15px; border-radius: 10px; font-size: 12px; color: #555; width: 20%;">💰 ${t.total}</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows}
          </tbody>
        </table>

        <!-- TOTALS -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 30px; margin-bottom: 30px;">
          <tr>
            <td style="width: 55%;"></td>
            <td style="width: 45%;">
              <div style="background: #2581FF; color: white; padding: 30px; border-radius: 25px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 6px 0; font-size: 14px; color: rgba(255,255,255,0.85);">${t.subtotal}</td>
                    <td style="padding: 6px 0; font-size: 14px; color: white; text-align: right;">${formatCurrency(computedSubTotal, currency)}</td>
                  </tr>
                  ${computedTaxAmount > 0 ? `
                  <tr>
                    <td style="padding: 6px 0; font-size: 14px; color: rgba(255,255,255,0.85);">${t.tax}</td>
                    <td style="padding: 6px 0; font-size: 14px; color: white; text-align: right;">${formatCurrency(computedTaxAmount, currency)}</td>
                  </tr>` : ""}
                  <tr>
                    <td colspan="2" style="padding: 10px 0;">
                      <div style="height: 1px; background: rgba(255,255,255,0.3);"></div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-size: 20px; font-weight: 700;">${t.grandTotal}</td>
                    <td style="padding: 10px 0; font-size: 20px; font-weight: 700; text-align: right;">${formatCurrency(totalAmount, currency)}</td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
        </table>

        <!-- NOTES -->
        ${notesSection}

        <!-- FOOTER -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <tr>
            <td style="vertical-align: middle;">
              <p style="font-size: 14px; font-weight: 700; color: #1A2B4A; margin-bottom: 4px;">${data?.currentUser?.fullName ?? ""}</p>
              ${data?.currentUser?.email ? `<p style="font-size: 12px; color: #777;">${data.currentUser.email}</p>` : ""}
              ${data?.currentUser?.phone ? `<p style="font-size: 12px; color: #777;">${data.currentUser.phone}</p>` : ""}
            </td>
            <td style="text-align: right; vertical-align: middle;">
              <!-- Decorative dots -->
              <div style="display: inline-block; width: 60px; height: 60px;
                background-image: radial-gradient(#FF4B5C 20%, transparent 20%),
                                  radial-gradient(#2581FF 20%, transparent 20%);
                background-position: 0 0, 10px 10px;
                background-size: 20px 20px;">
              </div>
            </td>
          </tr>
        </table>

      </div>

    </body>
    </html>
  `;
};