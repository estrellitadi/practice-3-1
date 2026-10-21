import { BookCatalog } from './task6-classes';
import { Book } from './task1-types';

export class Wishlist {
  private favoriteIds: string[] = [];

  constructor(favoriteIds: string[] = []) {
    this.favoriteIds = [...favoriteIds];
  }

  toggle(id: string): void {
    if (this.has(id)) {
      this.favoriteIds = this.favoriteIds.filter((favId) => favId !== id);
    } else {
      this.favoriteIds = [...this.favoriteIds, id];
    }
  }

  has(id: string): boolean {
    return this.favoriteIds.includes(id);
  }

  getFavorites(catalog: BookCatalog): Book[] {
    const allBooks = catalog.getBooks();
    return allBooks.filter((book) => this.favoriteIds.includes(book.id));
  }

  getFavoriteIds(): string[] {
    return [...this.favoriteIds];
  }

  get count(): number {
    return this.favoriteIds.length;
  }
}