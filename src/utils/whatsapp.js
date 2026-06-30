const WHATSAPP_NUMBER = "265999941540";

export function buildWhatsAppLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message) {
  window.open(buildWhatsAppLink(message), "_blank");
}

export const WHATSAPP_GREETING =
  "Hi Kudimba Farms, I'd like to place an order / make an enquiry.";

export function productOrderMessage(productName) {
  return `Hi Kudimba Farms, I'd like to order: ${productName}. Please let me know pricing and availability.`;
}
