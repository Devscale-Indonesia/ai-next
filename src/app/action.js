"use server";

import OpenAI from "openai";

const openAi = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateRecipe(_prevState, formData) {
  const ingredients = formData.get("ingredients");
  const style = formData.get("style");

  const response = await openAi.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: [
          {
            type: "text",
            text: "You are a cooking expert, you will be given with user ingredients, and style, Please generate a recipe only with provided ingredients.\n\nIMPORTANT :\n- You are allowed to add additional ingredients as long as it's an aside ingredients.\n- Do not include any ingredients such as Alcohol, Arak, and Non-Halal Ingredients\n\nIMPORTANT :\nALWAYS RESPONSE WITH VALID JSON OBJECT WITH FOLLOWING KEYS : dishName, ingredients (string Array), howToMake (string Array)\n\nIMPORANT:\nDO NOT INCLUDE ```json as RESPONSE",
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Buat recipe dengan bahan : ${ingredients}, dengan style ${style}`,
          },
        ],
      },
    ],
    temperature: 1,
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    response_format: {
      type: "text",
    },
  });

  const result = JSON.parse(response.choices[0].message.content);

  return result;
}
