import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const deepEqual = (obj1: any, obj2: any) => {
  if (obj1 === obj2) return true;
  if (
    typeof obj1 !== "object" ||
    typeof obj2 !== "object" ||
    obj1 === null ||
    obj2 === null
  ) {
    return false;
  }
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) {
    return false;
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
