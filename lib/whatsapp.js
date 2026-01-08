import venom from "venom-bot";

let clientInstance = null;

export const initWhatsApp = async () => {
  if (clientInstance) return clientInstance;

  clientInstance = await venom.create({
    session: "whatsapp-session",
    multidevice: true,
    headless: true,
    logQR: true, // Shows QR code in terminal on first run
  });

  console.log("✅ WhatsApp client initialized!");
  return clientInstance;
};

export const sendWhatsAppMessage = async (to, message) => {
  try {
    const client = await initWhatsApp();
    const result = await client.sendText(to, message);
    console.log("📩 Message sent:", result);
    return { success: true };
  } catch (error) {
    console.error("❌ Failed to send message:", error);
    return { success: false, error: error.message };
  }
};
