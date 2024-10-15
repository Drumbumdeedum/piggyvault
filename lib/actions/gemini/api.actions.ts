"use server";

import { defaultCategories } from "@/constants/defaultCategories";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  readUncategorizedTransactionsByUserId,
  updateTransactionCategory,
} from "../enablebanking/db.actions";
import { getLoggedInUser } from "../auth.actions";
import { getTransactionString, trimWhiteSpace } from "@/lib/utils";

export const categorizeTransactions = async () => {
  const user = await getLoggedInUser();
  const transactions = await readUncategorizedTransactionsByUserId(user.id);
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  const categories = defaultCategories.toString();
  transactions.map(async (transaction) => {
    const transactionString = `${getTransactionString(transaction)}`;
    const prompt = `Use a one word answer from the words within the categories array provided. Use all lowercase letters. Use undefined as a fallback option. Choose one of the following categories: [${categories}] which category does the following transaction belong to: ${transactionString}.`;
    try {
      const result = await model.generateContent(prompt);
      await updateTransactionCategory({
        user_id: user.id,
        transaction_id: transaction.id,
        category: trimWhiteSpace(result.response.text()),
      });
    } catch (error) {
      console.log(error);
    }
  });
};
