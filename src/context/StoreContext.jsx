import { createContext, useContext, useState } from "react";
import { initialBooks, initialCategories, readStoredList, saveStoredList } from "../data/demoData.js";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [books, setBooks] = useState(() => readStoredList("little-bookshop-demo-books", initialBooks));
  const [categories, setCategories] = useState(() => readStoredList("little-bookshop-demo-categories", initialCategories));

  function updateBooks(nextBooks) {
    saveStoredList("little-bookshop-demo-books", nextBooks);
    setBooks(nextBooks);
  }

  function updateCategories(nextCategories) {
    saveStoredList("little-bookshop-demo-categories", nextCategories);
    setCategories(nextCategories);
  }

  return (
    <StoreContext.Provider value={{ books, categories, updateBooks, updateCategories }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside StoreProvider.");
  return context;
}
