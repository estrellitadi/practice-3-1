import { describe, it, expect } from "vitest";
import { calculateAverageYear } from "../src/task1-types";
import type { Book } from '../src/task1-types';

describe("Task 1: Интерфейсы", () => {


  it("calculateAverageYear должен считать средний год", () => {
    const books: Book[] = [
      { id: "1", title: "A", authors: ["a"], year: 2020 },
      { id: "2", title: "B", authors: ["b"], year: 2022 },
      { id: "3", title: "C", authors: ["c"], year: 2024 },
    ];
    expect(calculateAverageYear(books)).toBe(2022);
  });

  it("calculateAverageYear должен игнорировать книги без года", () => {
    const books: Book[] = [
      { id: "1", title: "A", authors: ["a"], year: 2020 },
      { id: "2", title: "B", authors: ["b"] },
      { id: "3", title: "C", authors: ["c"], year: 2024 },
    ];
    expect(calculateAverageYear(books)).toBe(2022);
  });

  it("calculateAverageYear должен вернуть 0 для пустого массива", () => {
    expect(calculateAverageYear([])).toBe(0);
  });

  it("calculateAverageYear должен вернуть 0 если у всех книг нет года", () => {
    const books: Book[] = [
      { id: "1", title: "A", authors: ["a"] },
      { id: "2", title: "B", authors: ["b"] },
    ];
    expect(calculateAverageYear(books)).toBe(0);
  });
});