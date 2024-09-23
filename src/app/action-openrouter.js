"use server";

export async function generateRecipeOpenRouter(_prevState, formData) {
  const ingredients = formData.get("ingredients");
  const style = formData.get("style");

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "nousresearch/hermes-3-llama-3.1-405b:free",
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
    }),
  });

  const data = await res.json();
  const result = JSON.parse(data.choices[0].message.content);

  return result;
}
