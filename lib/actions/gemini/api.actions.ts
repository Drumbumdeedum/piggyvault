"use server";

import { defaultCategories } from "@/constants/defaultCategories";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { readTransactionsByUserId } from "../enablebanking/db.actions";
import { getLoggedInUser } from "../auth.actions";
import { getTransactionString } from "@/lib/utils";

export const categorizeTransaction = async () => {
  console.log("START CATEGORIZATION");
  const user = await getLoggedInUser();
  const transactions = await readTransactionsByUserId(user.id);
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  const categories = defaultCategories.toString();

  //transactions.map(async (transaction) => {
  const transaction = transactions[20];
  const transactionString = `${getTransactionString(transaction)}`;
  console.log(transactionString);
  const prompt = `Use a one word answer, all lowercase letters. Use undefined as a fallback option. Choose one of the following categories: [${categories}] which category does the following transaction belong to: ${transactionString}.`;
  console.log(prompt);
  const result = await model.generateContent(prompt);
  console.log("RESULT:");
  console.log(result.response.text());
  //});
};
