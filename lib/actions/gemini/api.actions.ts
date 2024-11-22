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
  transactions.map(async (transaction) => {
    try {
      const category = await getCategoryFromTransaction(transaction);
      await updateTransactionCategory({
        user_id: user.id,
        transaction_id: transaction.id,
        category: category ? category : "undefined",
      });
    } catch (error) {
      console.log(error);
    }
  });
};

export const getCategoryFromTransaction = async (
  transaction: TransactionResponse
) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  const categories = defaultCategories.toString();
  const transactionString = `${getTransactionString(transaction)}`;
  const prompt = `Use a one word answer from the words within the categories array provided. Use all lowercase letters. Use undefined as a fallback option. Choose one of the following categories: [${categories}] which category does the following transaction belong to: ${transactionString}.`;
  try {
    const result = await model.generateContent(prompt);
    return result.response.text()
      ? trimWhiteSpace(result.response.text())
      : "undefined";
  } catch (error) {
    console.log(error);
  }
};
