import { getTranslations } from "@/src/locales/i18n";
import { dateformatter } from "@/src/utils/date-formatter";
import { formatCurrency } from "@/src/utils/helper";

export const professionalTemplate = (data: any, currency: string) => {
  const {
    invoiceNumber,
    issueDate,
    dueDate,
    paymentTerms,
    sender,
    client,
    lineItems = [],
    subTotal,
    taxAmount,
    totalAmount,
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
  const y = getTranslations().clients;

  const itemRows = lineItems
    .map((item: any, index: number) => {
      const qty = item.hours ?? item.quantity ?? 1;
      const amount = item.unitPrice * qty;
      return `
        <tr style="background-color: ${index % 2 === 0 ? "#ffffff" : "#fafafa"};">
          <td style="padding: 14px 16px; font-size: 13px; color: #27272a; font-weight: 500; border-bottom: 1px solid #e4e4e7; width: 45%;">${item.product?.name ?? item.description}</td>
          <td style="padding: 14px 16px; font-size: 13px; color: #52525b; text-align: center; border-bottom: 1px solid #e4e4e7; width: 15%;">${qty}</td>
          <td style="padding: 14px 16px; font-size: 13px; color: #52525b; text-align: right; border-bottom: 1px solid #e4e4e7; width: 20%;">${formatCurrency(item.unitPrice, currency)}</td>
          <td style="padding: 14px 16px; font-size: 13px; color: #27272a; font-weight: 600; text-align: right; border-bottom: 1px solid #e4e4e7; width: 20%;">${formatCurrency(amount, currency)}</td>
        </tr>`;
    })
    .join("");

  const taxRow =
    computedTaxAmount > 0
      ? `
        <tr>
          <td style="padding: 7px 0; font-size: 13px; color: #52525b;">Tax</td>
          <td style="padding: 7px 0; font-size: 13px; color: #27272a; font-weight: 600; text-align: right;">${formatCurrency(computedTaxAmount, currency)}</td>
        </tr>`
      : "";

  const notesSection = notes
    ? `
      <div style="margin: 0 16px 16px; background: #ffffff; border-radius: 12px; padding: 18px; border-left: 3px solid #4F46E5;">
        <p style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; color: #4F46E5; text-transform: uppercase; margin: 0 0 8px;">Notes</p>
        <p style="font-size: 13px; color: #52525b; line-height: 20px; margin: 0;">${notes}</p>
      </div>`
    : "";

  const paymentTermsCell = paymentTerms
    ? `
      <td style="width: 1px; padding: 0 16px;">
        <div style="width: 1px; height: 32px; background: rgba(255,255,255,0.2);"></div>
      </td>
      <td>
        <p style="color: rgba(255,255,255,0.6); font-size: 10px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 3px;">Terms</p>
        <p style="color: #ffffff; font-size: 13px; font-weight: 600; margin: 0;">${paymentTerms}</p>
      </td>`
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
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #fafafa; color: #27272a; }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 0; }
        }
      </style>
    </head>
    <body>
 
      <!-- HEADER -->
      <div style="background-color: #4F46E5; padding: 32px 24px 28px;">
 
        <!-- Invoice number + status -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr>
            <td style="vertical-align: top;">
              <p style="color: rgba(255,255,255,0.65); font-size: 11px; font-weight: 700; letter-spacing: 3px; margin-bottom: 4px; text-transform: uppercase;">${t.title}</p>
              <p style="color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: 0.5px;">${invoiceNumber}</p>
            </td>
            <td style="text-align: right; vertical-align: top;">
              <span style="background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 20px; padding: 6px 14px; color: #ffffff; font-size: 11px; font-weight: 700; letter-spacing: 1.5px;">${data.status}</span>
            </td>
          </tr>
        </table>
 
        <!-- Dates row -->
        <table style="border-collapse: collapse;">
          <tr>
            <td style="padding-right: 16px;">
              <p style="color: rgba(255,255,255,0.6); font-size: 10px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 3px;">${t.issueDate}</p>
              <p style="color: #ffffff; font-size: 13px; font-weight: 600;">${dateformatter(issueDate)}</p>
            </td>
            <td style="width: 1px; padding: 0 16px;">
              <div style="width: 1px; height: 32px; background: rgba(255,255,255,0.2);"></div>
            </td>
            <td style="padding: 0 16px;">
              <p style="color: rgba(255,255,255,0.6); font-size: 10px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 3px;">${t.dueDate}</p>
              <p style="color: #ffffff; font-size: 13px; font-weight: 600;">${dateformatter(dueDate)}</p>
            </td>
            ${paymentTermsCell}
          </tr>
        </table>
 
      </div>
 
      <!-- PARTIES -->
      <div style="background: #ffffff; margin: 0 16px; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; padding: 20px; margin-bottom: 20px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 46%; vertical-align: top;">
              <p style="font-size: 10px; font-weight: 700; letter-spacing: 2px; color: #4F46E5; text-transform: uppercase; margin-bottom: 8px;">${t.from}</p>
              <p style="font-size: 14px; font-weight: 700; color: #27272a; margin-bottom: 4px;">${data?.currentUser.fullName ?? "Your Company"}</p>
              ${sender?.addressLine1 ? `<p style="font-size: 12px; color: #52525b; line-height: 18px;">${sender.addressLine1}</p>` : ""}
              ${sender?.addressLine2 ? `<p style="font-size: 12px; color: #52525b; line-height: 18px;">${sender.addressLine2}</p>` : ""}
              ${sender?.city || sender?.state ? `<p style="font-size: 12px; color: #52525b; line-height: 18px;">${[sender?.city, sender?.state].filter(Boolean).join(", ")}</p>` : ""}
              ${sender?.country ? `<p style="font-size: 12px; color: #52525b; line-height: 18px;">${sender.country}</p>` : ""}
              ${sender?.email ? `<p style="font-size: 12px; color: #4F46E5; margin-top: 4px;">${sender.email}</p>` : ""}
              ${sender?.phone ? `<p style="font-size: 12px; color: #52525b;">${sender.phone}</p>` : ""}
            </td>
            <td style="width: 8%; text-align: center; vertical-align: middle; color: #a1a1aa; font-size: 20px;">→</td>
            <td style="width: 46%; vertical-align: top; text-align: right;">
              <p style="font-size: 10px; font-weight: 700; letter-spacing: 2px; color: #4F46E5; text-transform: uppercase; margin-bottom: 8px;">${t.to}</p>
              <p style="font-size: 14px; font-weight: 700; color: #27272a; margin-bottom: 4px;">${client.name}</p>
              ${client.addressLine1 ? `<p style="font-size: 12px; color: #52525b; line-height: 18px;">${client.addressLine1}</p>` : ""}
              ${client.addressLine2 ? `<p style="font-size: 12px; color: #52525b; line-height: 18px;">${client.addressLine2}</p>` : ""}
              ${client.city || client.state ? `<p style="font-size: 12px; color: #52525b; line-height: 18px;">${[client.city, client.state].filter(Boolean).join(", ")}</p>` : ""}
              ${client.country ? `<p style="font-size: 12px; color: #52525b; line-height: 18px;">${client.country}</p>` : ""}
              ${client.clientEmail ? `<p style="font-size: 12px; color: #4F46E5; margin-top: 4px;">${client.clientEmail}</p>` : ""}
              ${client.phone ? `<p style="font-size: 12px; color: #52525b;">${client.phone}</p>` : ""}
            </td>
          </tr>
        </table>
      </div>
 
      <!-- LINE ITEMS TABLE -->
      <div style="margin: 0 16px 16px; border-radius: 12px; overflow: hidden; background: #ffffff;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #4F46E5;">
              <th style="padding: 13px 16px; font-size: 11px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: rgba(255,255,255,0.9); text-align: left; width: 45%;">${t.item}</th>
              <th style="padding: 13px 16px; font-size: 11px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: rgba(255,255,255,0.9); text-align: center; width: 15%;">${t.quantity}</th>
              <th style="padding: 13px 16px; font-size: 11px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: rgba(255,255,255,0.9); text-align: right; width: 20%;">${t.unitPrice}</th>
              <th style="padding: 13px 16px; font-size: 11px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: rgba(255,255,255,0.9); text-align: right; width: 20%;">${t.amount}</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows}
          </tbody>
        </table>
      </div>
 
      <!-- TOTALS -->
      <table style="width: 100%; border-collapse: collapse; margin: 0 0 16px;">
        <tr>
          <td style="width: 45%;"></td>
          <td style="width: 55%; padding: 0 16px;">
            <div style="background: #ffffff; border-radius: 12px; padding: 16px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 7px 0; font-size: 13px; color: #52525b;">${t.subtotal}</td>
                  <td style="padding: 7px 0; font-size: 13px; color: #27272a; font-weight: 600; text-align: right;">${formatCurrency(computedSubTotal, currency)}</td>
                </tr>
                ${taxRow}
                <tr>
                  <td colspan="2" style="padding: 8px 0;">
                    <div style="height: 1px; background: #e4e4e7;"></div>
                  </td>
                </tr>
                <tr style="background-color: #EEF2FF;">
                  <td style="padding: 14px 16px; font-size: 14px; color: #3730A3; font-weight: 700;">${t.total}</td>
                  <td style="padding: 14px 16px; font-size: 16px; color: #4F46E5; font-weight: 800; text-align: right;">${formatCurrency(totalAmount, currency)}</td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
      </table>
 
      <!-- NOTES -->
      ${notesSection}
 
      <!-- FOOTER -->
      <div style="margin: 8px 16px 24px; padding-top: 20px; border-top: 1px solid #e4e4e7; text-align: center;">
        <p style="font-size: 13px; color: #52525b; font-weight: 500; margin-bottom: 4px;">${t.thankYou}</p>
        <p style="font-size: 11px; color: #a1a1aa; line-height: 16px;">${t.includeNumber} <strong>${invoiceNumber}</strong> ${t.withPayment}.</p>
      </div>
 
    </body>
    </html>
  `;
};