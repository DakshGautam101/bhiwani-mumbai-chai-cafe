import { GoogleGenAI } from "@google/genai";

// Initialize the AI client (no API key hardcoded — uses env variable)
const ai = new GoogleGenAI({});

/**
 * Generates a professional WhatsApp message for Bhiwani Mumbai Chai Cafe customers
 * @param {string} message - Custom message or order status
 * @param {Object} customerInfo - Customer/order information
 * @returns {Promise<string>} - AI-generated professional response
 */
export async function callAIService(message, customerInfo) {
  try {
    const prompt = `
You are a helpful assistant of the manager of Bhiwani Mumbai Chai Cafe.

Generate a polished, professional WhatsApp message for a customer using the following details:

Custom Message:
"${message}"

Customer/Order Info:
${JSON.stringify(customerInfo)}

The WhatsApp message should:
- Begin with a professional greeting (use customer's name if available, otherwise "<CUSTOMER_NAME>").
- Clearly mention "Bhiwani Mumbai Chai Cafe".
- Summarize the message context naturally (e.g., confirmation, delivery, payment, etc.).
- Include placeholders for:
  <CUSTOMER_NAME>, <DATE>, <TIME>, <ORDER_ID>, <TOTAL_AMOUNT>, <DELIVERY_ADDRESS>, <CITY>
- If data is provided in the object, fill it directly; otherwise keep the placeholder as is.
- Maintain a polite, professional, and warm tone.
- End with a thank you note and contact info (e.g., "For any queries, contact us at +91-8750017154").
- Return only the message body — no extra text, markdown, or commentary.
- Do NOT use emojis.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // Clean and return text output
    return response.text?.trim() || "Unable to generate message.";
  } catch (error) {
    console.error("Error in callAIService:", error);
    return "We are unable to generate the message at this time. Please try again.";
  }
}
