import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (a == null || typeof a != "object" || b == null || typeof b != "object")
    return false;
  let keysA = Object.keys(a),
    keysB = Object.keys(b);
  if (keysA.length != keysB.length) return false;
  for (let key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
  }
  return true;
};

export const filterDuplicates = (arr: any) => {
  return arr.filter(
    (obj: any, index: number, self: any) =>
      index === self.findIndex((otherObj: any) => deepEqual(obj, otherObj))
  );
};

export const getLastCharOfNumber = (number: number) => {
  const numberStr = number.toString();
  return numberStr.charAt(numberStr.length - 1);
};

export const formatAmount = (value: number) => {
  if (!value) return "0.00";
  let [integerPart, decimalPart] = value.toString().split(".");
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  if (decimalPart) {
    decimalPart = decimalPart.slice(0, 2);
  } else {
    decimalPart = "00";
  }
  return `${integerPart},${decimalPart}`;
};

export const shortenString = (value: string, limit: number = 19) => {
  return `${value.substring(0, limit)}${value.length > limit ? "..." : ""}`;
};

export const trimWhiteSpace = (input: string) => {
  return input ? input.replace(/\s/g, "") : "";
};

export const getCompositeId = (transaction: TransactionResponse) => {
  return `${transaction.transaction_amount.amount}-${transaction.transaction_amount.currency}-${transaction.booking_date}-${transaction.value_date}-${transaction.credit_debit_indicator}-${trimWhiteSpace(parseStringify(transaction.remittance_information.join()))}`;
};

export const haveMinutesPassedSinceDate = ({
  date,
  minutesPassed,
}: {
  date: string;
  minutesPassed: number;
}) => {
  const d1 = new Date(date);
  const d2 = Date.now();
  const differenceInMilliseconds = Math.abs(d1.getTime() - d2);
  const inputMinutesInMilliseconds = minutesPassed * 60 * 1000;
  return differenceInMilliseconds >= inputMinutesInMilliseconds;
};

export const getMonthRange = (monthsBefore: number) => {
  const currentDate = new Date();
  const targetMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1 - monthsBefore,
    currentDate.getDate()
  );
  const startDate = new Date(
    targetMonth.getFullYear(),
    targetMonth.getMonth() - 1,
    2
  );
  const endDate = new Date(
    targetMonth.getFullYear(),
    targetMonth.getMonth(),
    1
  );
  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
};

export const formatDate = (date: Date) => date.toISOString().split("T")[0];
