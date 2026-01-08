import { callAIService } from "@/app/services/AIService";

export async function POST(req) {
  try {
    const body = await req.json(); 
    console.log(body);

    const { message, customerInfo } = body; // Extract message and customer info

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400 }
      );
    }

    // Log incoming request
    console.log("AI Request Body:", body);

    // Call AI service with provided data
    const aiResponse = await callAIService(message, customerInfo);

    if (!aiResponse) {
      return new Response(
        JSON.stringify({ error: "Failed to generate AI message" }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ message: aiResponse }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error in POST handler:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Internal Server Error in AI response",
      }),
      { status: 500 }
    );
  }
}
