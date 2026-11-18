export const initialCategories = [
  { id: "fiction", name: "Fiction" },
  { id: "nonfiction", name: "Non-fiction" },
  { id: "fantasy", name: "Fantasy" },
  { id: "mystery", name: "Mystery" },
];

export const initialBooks = [
  {
    id: "book-1",
    title: "The Secret Garden",
    author: "Frances Hodgson Burnett",
    categoryId: "fiction",
    price: 12.5,
    stock: 8,
    description:
      "A lonely garden, a hidden key, and the beginning of a remarkable friendship.",
    cover: "https://covers.openlibrary.org/b/isbn/9780141321066-M.jpg",
    archived: false,
  },
  {
    id: "book-2",
    title: "The Hobbit",
    author: "J. R. R. Tolkien",
    categoryId: "fantasy",
    price: 15.99,
    stock: 5,
    description:
      "Bilbo Baggins sets off on an unexpected adventure beyond the Shire.",
    cover: "https://covers.openlibrary.org/b/isbn/9780547928227-M.jpg",
    archived: false,
  },
  {
    id: "book-3",
    title: "The Thursday Murder Club",
    author: "Richard Osman",
    categoryId: "mystery",
    price: 18,
    stock: 0,
    description:
      "Four friends in a retirement village meet weekly to investigate cold cases.",
    cover: "https://covers.openlibrary.org/b/isbn/9781984880987-M.jpg",
    archived: false,
  },
  {
    id: "book-4",
    title: "A Short History of Nearly Everything",
    author: "Bill Bryson",
    categoryId: "nonfiction",
    price: 19.5,
    stock: 3,
    description:
      "A witty journey through the discoveries that explain our world.",
    cover: "https://covers.openlibrary.org/b/isbn/9780767908184-M.jpg",
    archived: false,
  },
];

export const readStoredList = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return fallback;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

export const saveStoredList = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    throw new Error("Your browser could not save this demo data.");
  }
};
