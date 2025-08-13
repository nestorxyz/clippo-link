export const getWhatsappBotLinkWithMessage = (message: string) => {
  return `https://wa.me/51970899781?text=${encodeURIComponent(message)}`;
};
