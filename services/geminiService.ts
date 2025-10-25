// Fix: Implement Gemini service for AI order suggestions.
import { GoogleGenAI, Type } from '@google/genai';
import { getProducts, getCustomers } from './mockApi';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const generateOrderSchema = {
    type: Type.OBJECT,
    properties: {
        customerName: {
            type: Type.STRING,
            description: "The name of the customer placing the order. This must be an exact match from the provided customer list.",
        },
        items: {
            type: Type.ARRAY,
            description: "An array of items to be included in the order.",
            items: {
                type: Type.OBJECT,
                properties: {
                    productName: {
                        type: Type.STRING,
                        description: "The name of the product being ordered. This must be an exact match from the provided product list.",
                    },
                    quantity: {
                        type: Type.INTEGER,
                        description: "The number of units of the product to order.",
                    },
                },
                required: ["productName", "quantity"],
            },
        },
    },
    required: ["customerName", "items"],
};

export const generateOrderSuggestion = async (prompt: string) => {
    try {
        const products = await getProducts();
        const customers = await getCustomers();

        const productList = products.map(p => p.name).join(', ');
        const customerList = customers.map(c => c.name).join(', ');

        const systemInstruction = `You are an intelligent order booking assistant for Qazi Enterprises.
Your goal is to understand the user's request and structure it as a JSON object representing a new order.
Use the following lists to ensure customer and product names are correct.

Available Products: ${productList}
Available Customers: ${customerList}

If a customer or product mentioned by the user does not exist in the lists, do not create the order and instead inform the user that the entity is not found.
Only respond with the JSON object based on the schema.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: generateOrderSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error generating order suggestion:", error);
        return { error: "I'm having trouble understanding that. Could you please try rephrasing your order?" };
    }
};
