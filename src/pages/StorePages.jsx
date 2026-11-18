import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BookCard from "../components/BookCard.jsx";
import { EmptyState, Feedback } from "../components/Feedback.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useStore } from "../context/StoreContext.jsx";
import { searchOpenLibrary } from "../services/bookApi.js";

function useFavorites() {
  const { user } = useAuth();
  const key = `little-bookshop-demo-favorites:${user.id}`;
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  function toggleFavorite(bookId) {
    const next = favorites.includes(bookId)
      ? favorites.filter((id) => id !== bookId)
      : [...favorites, bookId];
    try {
      localStorage.setItem(key, JSON.stringify(next));
      setFavorites(next);
      return "";
    } catch {
      return "Your browser could not save this demo favorite.";
    }
  }
  return { favorites, toggleFavorite };
}

export function BooksPage() {
  const { books, categories } = useStore();
  const { favorites, toggleFavorite } = useFavorites();
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [discoveryQuery, setDiscoveryQuery] = useState("");
  const [discovery, setDiscovery] = useState([]);
  const [discoverySearched, setDiscoverySearched] = useState(false);
  const [loadingDiscovery, setLoadingDiscovery] = useState(false);
  const [error, setError] = useState("");
  const visibleBooks = useMemo(() => books.filter((book) => {
    const matchesText = `${book.title} ${book.author}`.toLowerCase().includes(query.toLowerCase());
    return !book.archived && matchesText && (categoryId === "all" || book.categoryId === categoryId);
  }), [books, categoryId, query]);

  async function discover(event) {
    event.preventDefault();
    setError("");
    setDiscovery([]);
    setDiscoverySearched(false);
    setLoadingDiscovery(true);
    try {
      setDiscovery(await searchOpenLibrary(discoveryQuery));
      setDiscoverySearched(true);
    } catch (issue) {
      setError(issue.message);
    } finally {
      setLoadingDiscovery(false);
    }
  }

  function handleFavorite(bookId) {
    setError(toggleFavorite(bookId));
  }

  return (
    <section className="page-section">
      <div className="page-heading"><span className="eyebrow">Take your time</span><h1>Browse the books</h1><p>Find a new favorite from our little collection.</p></div>
      <div className="toolbar">
        <label className="search-field">Search the shop<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Title or author" /></label>
        <label>Category<select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}><option value="all">All categories</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
      </div>
      <Feedback error={error} />
      {visibleBooks.length ? (
        <div className="book-grid">{visibleBooks.map((book) => <BookCard key={book.id} book={book} category={categories.find((item) => item.id === book.categoryId)?.name} favorite={favorites.includes(book.id)} onFavorite={handleFavorite} />)}</div>
      ) : <EmptyState title="No books found">Try another search or category. We may have just the thing.</EmptyState>}
      <section className="discovery-panel">
        <div><span className="eyebrow">Beyond our shelves</span><h2>Discover public books</h2><p>Search Open Library for inspiration. These results are not shop inventory.</p></div>
        <form className="discovery-form" onSubmit={discover}><label className="sr-only" htmlFor="open-library-search">Search Open Library</label><input id="open-library-search" value={discoveryQuery} onChange={(event) => setDiscoveryQuery(event.target.value)} placeholder="Try “sea stories”" required /><button className="button secondary" disabled={loadingDiscovery}>{loadingDiscovery ? "Searching…" : "Discover"}</button></form>
        {loadingDiscovery && <p role="status">Looking for books…</p>}
        {!loadingDiscovery && discovery.length > 0 && <div className="discovery-results">{discovery.map((book) => <article key={book.id}>{book.cover && <img src={book.cover} alt="" />}<div><strong>{book.title}</strong><p>{book.author}{book.year ? ` · ${book.year}` : ""}</p></div></article>)}</div>}
        {!loadingDiscovery && discoverySearched && discovery.length === 0 && !error && <p className="muted">No books found for that search. Try another title or author.</p>}
      </section>
    </section>
  );
}

export function BookDetailsPage() {
  const { bookId } = useParams();
  const { books, categories } = useStore();
  const { favorites, toggleFavorite } = useFavorites();
  const [error, setError] = useState("");
  const book = books.find((item) => item.id === bookId && !item.archived);
  if (!book) return <section className="page-section"><EmptyState title="This book has moved">It may have been archived or is no longer available. <Link to="/books">Back to the books</Link></EmptyState></section>;

  function handleFavorite() {
    setError(toggleFavorite(book.id));
  }

  return (
    <section className="detail-layout">
      <div className="detail-cover">{book.cover ? <img src={book.cover} alt={`Cover of ${book.title}`} /> : <div className="cover-placeholder">A good read</div>}</div>
      <div className="detail-copy">
        <Link className="back-link" to="/books">← Back to the books</Link>
        <span className="eyebrow">{categories.find((item) => item.id === book.categoryId)?.name || "Book"}</span>
        <h1>{book.title}</h1><p className="detail-author">by {book.author}</p>
        <p>{book.description || "A lovely addition to your next reading afternoon."}</p>
        <p className="stock-note">{book.stock > 0 ? `${book.stock} in stock` : "Currently out of stock"}</p>
        <strong className="detail-price">${Number(book.price).toFixed(2)}</strong>
        <Feedback error={error} />
        <button className="button primary" onClick={handleFavorite}>{favorites.includes(book.id) ? "♥ Saved to favorites" : "♡ Add to favorites"}</button>
      </div>
    </section>
  );
}

export function FavoritesPage() {
  const { books, categories } = useStore();
  const { favorites, toggleFavorite } = useFavorites();
  const [error, setError] = useState("");
  const favoriteBooks = books.filter((book) => favorites.includes(book.id) && !book.archived);

  function handleFavorite(bookId) {
    setError(toggleFavorite(bookId));
  }

  return (
    <section className="page-section">
      <div className="page-heading"><span className="eyebrow">Saved for later</span><h1>Your favorites</h1><p>A personal little reading list.</p></div>
      <Feedback error={error} />
      {favoriteBooks.length ? <div className="book-grid">{favoriteBooks.map((book) => <BookCard key={book.id} book={book} category={categories.find((item) => item.id === book.categoryId)?.name} favorite onFavorite={handleFavorite} />)}</div> : <EmptyState title="Nothing saved just yet">Browse the shelves and tap the heart on a book you love.</EmptyState>}
    </section>
  );
}

export function AccountPage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user.name);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function submit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    try {
      updateProfile(name);
      setSuccess("Your demo profile has been updated.");
    } catch (issue) {
      setError(issue.message);
    }
  }

  return (
    <section className="form-page">
      <div className="form-heading"><span className="eyebrow">Your little corner</span><h1>Account</h1><p>Manage your own demo profile.</p></div>
      <form className="card-form" onSubmit={submit}>
        <Feedback error={error} success={success} />
        <label>Your name<input value={name} onChange={(event) => setName(event.target.value)} maxLength={70} required /></label>
        <label>Email<input value={user.email} readOnly /></label>
        <label>Role<input value="Customer" readOnly /></label>
        <button className="button primary full-width">Save changes</button>
      </form>
    </section>
  );
}

export function AdminDashboardPage() {
  const { books, categories } = useStore();
  const { user } = useAuth();
  const activeBooks = books.filter((book) => !book.archived);
  const lowStock = activeBooks.filter((book) => book.stock < 4).length;
  return (
    <section className="page-section">
      <div className="page-heading"><span className="eyebrow">Shopkeeper corner</span><h1>Good morning, {user.name}</h1><p>Your demo shop at a glance.</p></div>
      <div className="stat-grid"><article className="stat-card"><span>Active books</span><strong>{activeBooks.length}</strong></article><article className="stat-card"><span>Categories</span><strong>{categories.length}</strong></article><article className="stat-card"><span>Needs a restock</span><strong>{lowStock}</strong></article></div>
      <div className="admin-shortcuts"><Link className="shortcut-card" to="/admin/books"><span>01</span><strong>Manage books</strong><small>Add, update, or archive catalog items →</small></Link><Link className="shortcut-card" to="/admin/categories"><span>02</span><strong>Manage categories</strong><small>Keep your shelves organized →</small></Link><Link className="shortcut-card" to="/admin/inventory"><span>03</span><strong>Inventory</strong><small>Update available stock →</small></Link></div>
    </section>
  );
}

export function AdminBooksPage() {
  const { books, categories, updateBooks } = useStore();
  const blankBook = { title: "", author: "", categoryId: categories[0]?.id || "", price: "", stock: "", description: "", cover: "" };
  const [form, setForm] = useState(blankBook);
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function resetForm() {
    setEditingId("");
    setForm({ title: "", author: "", categoryId: categories[0]?.id || "", price: "", stock: "", description: "", cover: "" });
  }

  function submit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    const price = Number(form.price);
    const stock = Number(form.stock);
    if (!form.title.trim() || !form.author.trim() || !form.categoryId || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
      setError("Add a title, author, category, valid non-negative price, and whole-number stock.");
      return;
    }
    const oldBook = books.find((book) => book.id === editingId);
    const record = {
      ...form,
      id: editingId || `book-${globalThis.crypto?.randomUUID?.() || Date.now()}`,
      title: form.title.trim(),
      author: form.author.trim(),
      price,
      stock,
      description: form.description.trim(),
      cover: form.cover.trim(),
      archived: oldBook?.archived || false,
    };
    try {
      updateBooks(editingId ? books.map((book) => book.id === editingId ? record : book) : [record, ...books]);
      resetForm();
      setSuccess(editingId ? "Book updated." : "Book added to the demo catalog.");
    } catch (issue) {
      setError(issue.message);
    }
  }

  function editBook(book) {
    setEditingId(book.id);
    setForm({ ...book, price: String(book.price), stock: String(book.stock) });
    setError("");
    setSuccess("");
  }

  function toggleArchived(book) {
    setError("");
    setSuccess("");
    try {
      updateBooks(books.map((item) => item.id === book.id ? { ...item, archived: !item.archived } : item));
      if (editingId === book.id) resetForm();
      setSuccess(book.archived ? "Book restored to the catalog." : "Book archived from the customer shelves.");
    } catch (issue) {
      setError(issue.message);
    }
  }

  return (
    <section className="page-section">
      <div className="page-heading"><span className="eyebrow">Your catalog</span><h1>Manage books</h1><p>Add new reads, update details, or archive a listing.</p></div>
      <div className="admin-content-grid">
        <form className="card-form admin-form" onSubmit={submit}>
          <h2>{editingId ? "Update book" : "Add a book"}</h2><Feedback error={error} success={success} />
          <label>Title<input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></label>
          <label>Author<input value={form.author} onChange={(event) => setForm({ ...form, author: event.target.value })} required /></label>
          <label>Category<select value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })} required><option value="" disabled>Select a category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
          <div className="input-row"><label>Price ($)<input type="number" min="0" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required /></label><label>Stock<input type="number" min="0" step="1" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} required /></label></div>
          <label>Description<textarea rows="3" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
          <label>Cover image URL <span className="muted">(optional)</span><input type="url" value={form.cover} onChange={(event) => setForm({ ...form, cover: event.target.value })} /></label>
          <button className="button primary">{editingId ? "Save book" : "Add book"}</button>
          {editingId && <button className="button text-button" type="button" onClick={resetForm}>Cancel editing</button>}
        </form>
        <div className="admin-list">
          <h2>Catalog ({books.length})</h2>
          {books.length === 0 && <EmptyState title="Your shelves are empty">Add a book with the form.</EmptyState>}
          {books.map((book) => <article className={`admin-book-row ${book.archived ? "archived" : ""}`} key={book.id}><div><strong>{book.title}</strong><p>{book.author} · ${Number(book.price).toFixed(2)} · {book.archived ? "Archived" : "Active"}</p></div><div className="row-actions"><button className="small-button" onClick={() => editBook(book)}>Edit</button><button className="small-button" onClick={() => toggleArchived(book)}>{book.archived ? "Restore" : "Archive"}</button></div></article>)}
        </div>
      </div>
    </section>
  );
}

export function AdminCategoriesPage() {
  const { books, categories, updateCategories } = useStore();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function addCategory(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    const trimmed = name.trim();
    if (!trimmed) return setError("Enter a category name.");
    if (categories.some((category) => category.name.toLowerCase() === trimmed.toLowerCase())) return setError("That category already exists.");
    try {
      updateCategories([...categories, { id: `category-${globalThis.crypto?.randomUUID?.() || Date.now()}`, name: trimmed }]);
      setName("");
      setSuccess("Category added.");
    } catch (issue) {
      setError(issue.message);
    }
  }

  function removeCategory(category) {
    setError("");
    setSuccess("");
    if (books.some((book) => book.categoryId === category.id)) {
      setError("Move or archive its books before removing this category.");
      return;
    }
    try {
      updateCategories(categories.filter((item) => item.id !== category.id));
      setSuccess(`${category.name} removed.`);
    } catch (issue) {
      setError(issue.message);
    }
  }

  return (
    <section className="page-section">
      <div className="page-heading"><span className="eyebrow">Organize the shelves</span><h1>Manage categories</h1><p>Categories help readers find just the right book.</p></div>
      <div className="category-panel">
        <form className="inline-form" onSubmit={addCategory}><label htmlFor="category-name">New category</label><input id="category-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Poetry" maxLength={50} required /><button className="button primary">Add category</button></form>
        <Feedback error={error} success={success} />
        <div className="category-list">{categories.map((category) => <article className="category-row" key={category.id}><div><strong>{category.name}</strong><span>{books.filter((book) => book.categoryId === category.id).length} books</span></div><button className="small-button danger-text" onClick={() => removeCategory(category)}>Remove</button></article>)}</div>
      </div>
    </section>
  );
}

export function InventoryPage() {
  const { books, updateBooks } = useStore();
  const [drafts, setDrafts] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function saveStock(book) {
    setError("");
    setSuccess("");
    const stock = Number(drafts[book.id] ?? book.stock);
    if (!Number.isInteger(stock) || stock < 0) {
      setError("Stock must be a whole number greater than or equal to zero.");
      return;
    }
    try {
      updateBooks(books.map((item) => item.id === book.id ? { ...item, stock } : item));
      setDrafts((current) => ({ ...current, [book.id]: undefined }));
      setSuccess(`Stock updated for ${book.title}.`);
    } catch (issue) {
      setError(issue.message);
    }
  }

  return (
    <section className="page-section">
      <div className="page-heading"><span className="eyebrow">Back room</span><h1>Inventory</h1><p>Keep an eye on how many copies are ready to find a home.</p></div>
      <Feedback error={error} success={success} />
      <div className="inventory-list"><div className="inventory-header"><span>Book</span><span>Status</span><span>Copies</span><span>Update</span></div>
        {books.filter((book) => !book.archived).map((book) => <form className="inventory-row" key={book.id} onSubmit={(event) => { event.preventDefault(); saveStock(book); }}><div><strong>{book.title}</strong><small>{book.author}</small></div><span className={`stock-badge ${book.stock === 0 ? "out" : book.stock < 4 ? "low" : ""}`}>{book.stock === 0 ? "Out of stock" : book.stock < 4 ? "Low stock" : "In stock"}</span><label className="sr-only" htmlFor={`stock-${book.id}`}>Copies of {book.title}</label><input id={`stock-${book.id}`} type="number" min="0" step="1" value={drafts[book.id] ?? book.stock} onChange={(event) => setDrafts({ ...drafts, [book.id]: event.target.value })} /><button className="small-button">Save</button></form>)}
        {books.every((book) => book.archived) && <EmptyState title="No active inventory">Active books will appear here.</EmptyState>}
      </div>
    </section>
  );
}
