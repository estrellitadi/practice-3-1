import './styles.css';
import { Book } from './task1-types';
import { applyFilters, filterByAuthor, filterByMinYear } from './task3-filters';
import { createBookFromForm } from './task4-integration';
import { sortBooks } from './task5-utils';
import { BookCatalog } from './task6-classes';
import { Wishlist } from './task7-wishlist';

// Инициализация каталога
let catalog = new BookCatalog('main', [
  { id: '1', title: 'TypeScript Guide', authors: ['John Doe'], year: 2024 },
  { id: '2', title: 'JavaScript Basics', authors: ['Jane Smith'], year: 2022 },
]);

// Восстановление каталога из localStorage
const savedCatalog = localStorage.getItem('catalog');
if (savedCatalog) {
  try {
    const parsed = JSON.parse(savedCatalog);
    if (parsed.books && Array.isArray(parsed.books)) {
      catalog = new BookCatalog(parsed.id || 'main', parsed.books);
    } else {
      catalog = new BookCatalog('main', Object.values(parsed));
    }
  } catch (e) {
    console.error('Ошибка парсинга каталога из localStorage', e);
  }
}

const savedWishlist = localStorage.getItem('wishlist');
let initialFavoriteIds: string[] = [];
if (savedWishlist) {
  try {
    const parsedIds = JSON.parse(savedWishlist);
    if (Array.isArray(parsedIds)) {
      initialFavoriteIds = parsedIds;
    }
  } catch (e) {
    console.error('Ошибка парсинга избранного из localStorage', e);
  }
}

const wishlist = new Wishlist(initialFavoriteIds);

function saveCatalog() {
  localStorage.setItem('catalog', JSON.stringify({
    id: catalog.id,
    books: catalog.getBooks()
  }));
}

function saveWishlist() {
  localStorage.setItem('wishlist', JSON.stringify(wishlist.getFavoriteIds()));
}

const bookList = document.querySelector('#bookList') as HTMLDivElement;
const wishlistContainer = document.querySelector('#wishlistContainer') as HTMLDivElement;
const form = document.querySelector('#bookForm') as HTMLFormElement;
const filterBtn = document.querySelector('#applyFilters') as HTMLButtonElement;
const authorInput = document.querySelector('#filterAuthor') as HTMLInputElement;
const yearInput = document.querySelector('#filterYear') as HTMLInputElement;
const errorMessage = document.querySelector('#errorMessage') as HTMLDivElement;
const searchInput = document.querySelector('#searchInput') as HTMLInputElement;
const sortBySelect = document.querySelector('#sortBy') as HTMLSelectElement;

function createBookCard(book: Book): HTMLDivElement {
  const card = document.createElement('div');
  card.className = 'book-card';

  const titleEl = document.createElement('h3');
  titleEl.textContent = `${book.title} — ${book.authors.join(', ')}${book.year ? `, ${book.year}` : ''}`;
  card.append(titleEl);

  if (book.rating !== undefined) {
    const ratingEl = document.createElement('p');
    ratingEl.textContent = `Рейтинг: ${book.rating}`;
    card.append(ratingEl);
  }

  const btnContainer = document.createElement('div');
  btnContainer.style.display = 'flex';
  btnContainer.style.gap = '8px';
  btnContainer.style.marginTop = '8px';

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Удалить';
  deleteBtn.addEventListener('click', () => {
    catalog.removeBook(book.id);
    saveCatalog();
    renderBooks(catalog.getBooks());
    renderWishlist(); 
  });
  btnContainer.append(deleteBtn);

  const favBtn = document.createElement('button');
  const isFav = wishlist.has(book.id);
  favBtn.textContent = isFav ? '❤️ В избранном' : '🤍 В избранное';
  favBtn.addEventListener('click', () => {
    wishlist.toggle(book.id);
    saveWishlist();
    renderBooks(catalog.getBooks());
    renderWishlist();
  });
  btnContainer.append(favBtn);

  card.append(btnContainer);
  return card;
}

function renderBooks(books: Book[]) {
  bookList.innerHTML = '';

  if (books.length === 0) {
    bookList.textContent = 'Книги не найдены. Попробуйте изменить фильтры.';
    return;
  }

  books.forEach(book => {
    bookList.append(createBookCard(book));
  });
}

function renderWishlist() {
  wishlistContainer.innerHTML = '';
  const favorites = wishlist.getFavorites(catalog);

  if (favorites.length === 0) {
    wishlistContainer.textContent = 'Список избранного пуст.';
    return;
  }

  favorites.forEach(book => {
    wishlistContainer.append(createBookCard(book));
  });
}

renderBooks(catalog.getBooks());
renderWishlist();

form.addEventListener('submit', (e) => {
  e.preventDefault();
  errorMessage.textContent = '';
  try {
    const formData = new FormData(form);
    const newBook = createBookFromForm(formData);

    catalog.addBook(newBook);
    saveCatalog();
    form.reset();

    renderBooks(catalog.getBooks());
    // Избранное перерисовывать не нужно, новая книга туда не добавляется автоматически
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.textContent = error.message;
    }
  }
});

// Фильтры и сортировка
function refreshList() {
  const filters: ((book: Book) => boolean)[] = [];

  if (authorInput.value.trim()) {
    filters.push(filterByAuthor(authorInput.value.trim()));
  }
  if (yearInput.value) {
    filters.push(filterByMinYear(parseInt(yearInput.value, 10)));
  }

  let books = catalog.getBooks();

  if (searchInput.value.trim()) {
    const searchedBooks = catalog.searchByTitle(searchInput.value.trim());
    const searchedIds = new Set(searchedBooks.map(b => b.id));
    filters.push(book => searchedIds.has(book.id));
  }
  
  books = applyFilters(books, filters);
  books = sortBooks(books, sortBySelect.value as 'year' | 'rating');

  renderBooks(books);
}

filterBtn.addEventListener('click', refreshList);
searchInput.addEventListener('input', refreshList);
sortBySelect.addEventListener('change', refreshList);