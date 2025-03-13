import OpenAI from "openai";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { question } = req.body;
    if (!question) {
        return res.status(400).json({ error: "Question is required" });
    }

    try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: `Respond in the same language as the question. Fact-check this statement: "${question}"` }],
            max_tokens: 50
        });

        return res.status(200).json({ factCheck: response.choices[0].message.content });

    } catch (error) {
        console.error("Fact-check API error:", error);
        
        // Ensure proper JSON response even on error
        return res.status(500).json({ error: "Server error while processing request." });
    }
}
