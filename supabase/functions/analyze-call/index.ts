// LurkGuard-AI: Transcribe audio + analyze for fraud using Google Gemini via Lovable AI Gateway
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const { audioBase64, mimeType } = await req.json();
    if (!audioBase64 || !mimeType) {
      return new Response(
        JSON.stringify({ error: "audioBase64 and mimeType are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const systemPrompt = `You are LurkGuard-AI, an unbiased fraud-detection assistant analyzing recorded phone calls for the Google Solution Challenge.

Your job:
1. Transcribe the audio accurately (any language; if non-English, also provide an English translation).
2. Classify the call into EXACTLY one verdict: "safe", "suspicious", or "fraud".
3. Provide a confidence score from 0-100.
4. List specific red-flag indicators detected (urgency tactics, requests for OTP/passwords/money, impersonation of bank/police/government, threats, prizes, fake tech support, phishing links, etc.).
5. Give a short, neutral explanation. Be objective — judge ONLY on call content, not the speaker's accent, gender, or identity.

Respond ONLY by calling the report_analysis tool.`;

    const tools = [
      {
        type: "function",
        function: {
          name: "report_analysis",
          description: "Return the call analysis result",
          parameters: {
            type: "object",
            properties: {
              transcript: { type: "string", description: "Full verbatim transcript of the audio" },
              language: { type: "string", description: "Detected language" },
              translation: { type: "string", description: "English translation if non-English, else empty" },
              verdict: { type: "string", enum: ["safe", "suspicious", "fraud"] },
              confidence: { type: "number", description: "0-100" },
              red_flags: {
                type: "array",
                items: { type: "string" },
                description: "Specific suspicious indicators found",
              },
              explanation: { type: "string", description: "Short neutral reasoning" },
              summary: { type: "string", description: "One-sentence summary of the call" },
            },
            required: ["transcript", "verdict", "confidence", "red_flags", "explanation", "summary"],
            additionalProperties: false,
          },
        },
      },
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this phone call recording. Transcribe and classify." },
              {
                type: "input_audio",
                input_audio: { data: audioBase64, format: mimeType.includes("mp4") ? "mp4" : "mp3" },
              },
            ],
          },
        ],
        tools,
        tool_choice: { type: "function", function: { name: "report_analysis" } },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      return new Response(
        JSON.stringify({ error: "AI analysis failed", detail: text }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(
        JSON.stringify({ error: "AI did not return structured output", raw: data }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const result = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-call error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
