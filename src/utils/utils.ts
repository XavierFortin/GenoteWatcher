import { CourseRow } from "../types/courseRow.ts";

export const shallowEqual = (object1: CourseRow, object2: CourseRow): boolean => {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (object1[key as keyof CourseRow] !== object2[key as keyof CourseRow]) {
      return false;
    }
  }

  return true;
}
