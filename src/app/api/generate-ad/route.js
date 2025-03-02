// src/app/api/generate-ad/route.js
import { OpenAI } from "openai";

export async function POST(request) {
  const { userInput } = await request.json();
  
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const thread = await openai.beta.threads.create();
    const promptContent = `
      Create compelling ad copy for this product/service: "${userInput}".
      The ad should be minimalist in style and tone. Please provide four distinct parts:
      1. A headline (5-7 words max)
      2. A tagline (short phrase)
      3. A concise product description (2-3 sentences max)
      4. A call-to-action (1-3 words)
      Format your response as a JSON object with these keys: headline, tagline, description, callToAction.
      Do not include any explanation or additional text.
    `;
    
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: promptContent,
    });
    
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.ASSISTANT_ID,
      max_completion_tokens: 300,
    });
    
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    while (runStatus.status !== "completed") {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      if (["failed", "cancelled", "expired"].includes(runStatus.status)) {
        throw new Error(`Run ended with status: ${runStatus.status}`);
      }
    }
    
    const messages = await openai.beta.threads.messages.list(thread.id);
    let assistantResponse = messages.data
      .filter((msg) => msg.role === "assistant")
      .map((msg) => msg.content[0].text.value)
      .join("\n");
    
    let adContent;
    try {
      if (assistantResponse.includes("```json")) {
        assistantResponse = assistantResponse
          .split("```json")[1]
          .split("```")[0]
          .trim();
      } else if (assistantResponse.includes("```")) {
        assistantResponse = assistantResponse
          .split("```")[1]
          .split("```")[0]
          .trim();
      }
      adContent = JSON.parse(assistantResponse);
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      adContent = {
        headline: "Innovative Solution",
        tagline: "Simplicity meets functionality",
        description:
          "Our product enhances your life with elegant design and powerful features. Experience the difference today.",
        callToAction: "Discover More",
      };
    }
    
    return Response.json({ adContent });
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      {
        error: "Failed to generate ad content",
        adContent: {
          headline: "Error Occurred",
          tagline: "Please try again",
          description:
            "We were unable to generate ad content at this time. Please try again later.",
          callToAction: "Retry",
        },
      },
      { status: 500 }
    );
  }
}