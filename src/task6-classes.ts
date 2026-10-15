// ============================================================
// Практика 3: Классы и ООП
// ============================================================
// Цель: заменить функциональный каталог из Практик 2.1–2.2
// на класс с состоянием.
//
// Проверка: npm test -- task6
// ============================================================

import { Book } from "./task1-types";
import { filterByTitle, sortBooks } from "./task5-utils";

export class BookCatalog {
  private books: Book [];
  readonly id: string;

  constructor(id: string, books: Book [] = []){
    this.id = id;
    this.books = [...books];
}

  addBook(book: Book): void {
    this.books = [...this.books, book];
  }
  
  removeBook(id: string): void {
    this.books = this.books.filter(b => b.id !== id);
  }

  getBooks(): Book[] {
    return [...this.books]
  }
    
  searchByTitle(query: string): Book[] {
    return this.books.filter(filterByTitle(query));
  }

  sortBy(sortType: "year" | "rating"): Book[] {
    return sortBooks(this.books, sortType);
  }

  get count(): number {
    return this.books.length;
  }

}

export class BookClass {
  readonly id: string;
  title: string;
  authors: string[];
  year?: number;
  rating?: number;

  constructor(id: string, title: string, authors: string[], year?: number, rating?: number) {
    this.id = id;
    this.title = title;
    this.authors = authors;
    this.year = year;
    this.rating = rating;
  }

  format(): string {
    const yearStr = this.year !== undefined ? ` (${this.year})` : "";
    const authorsStr = this.authors.join(", ");
    return `${this.title}${yearStr} — ${authorsStr}`;
  }

  static createFromFormData(formData: FormData): BookClass {
    const id = crypto.randomUUID();
    const title = formData.get("title") as string;
    
    const authorsRaw = formData.get("authors") as string;
    const authors = authorsRaw
      .split(",")
      .map((author) => author.trim())
      .filter((author) => author.length > 0);

    const yearRaw = formData.get("year") as string;
    const year = yearRaw ? parseInt(yearRaw, 10) : undefined;

    const ratingRaw = formData.get("rating") as string;
    let rating: number | undefined = undefined;
    if (ratingRaw) {
      rating = parseFloat(ratingRaw);
      if (rating < 0 || rating > 5) {
        throw new Error("Рейтинг должен быть числом от 0 до 5");
      }
    }

    return new BookClass(id, title, authors, year, rating);
  }
}
/*
  Реализуйте класс BookCatalog.

  Состояние:
    - books: Book[]        — приватное, снаружи недоступно
    - id: string           — readonly

  Конструктор: (id: string, books: Book[] = [])

  Публичный API:
    addBook(book: Book): void
    removeBook(id: string): void
    getBooks(): Book[]
    searchByTitle(query: string): Book[]
    sortBy(sortType: 'year' | 'rating'): Book[]
    get count(): number

  Требования:
    - addBook / removeBook не мутируют массив, а создают новый
    - searchByTitle и sortBy переиспользуют filterByTitle / sortBooks
    - внешний код не может присвоить this.books напрямую

  Бонус: класс Book с полями id, title, authors, year?, rating?,
  методом format() и статическим createFromFormData(FormData).
*/
