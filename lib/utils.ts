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
  let [integerPart, decimalPart] = value.toString().split(".");
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  if (decimalPart) {
    decimalPart = decimalPart.slice(0, 2);
  } else {
    decimalPart = "00";
  }
  return `${integerPart},${decimalPart}`;
};

export const shortenString = (value: string) => {
  return `${value.substring(0, 19)}${value.length > 19 ? "..." : ""}`;
};
