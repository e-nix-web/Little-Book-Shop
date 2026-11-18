import { Link } from "react-router-dom";

export default function BookCard({ book, category, favorite, onFavorite }) {
  return (
    <article className="book-card">
      <Link to={`/books/${encodeURIComponent(book.id)}`} className="cover-link">
        {book.cover ? (
          <img className="book-cover" src={book.cover} alt={`Cover of ${book.title}`} />
        ) : (
          <div className="book-cover cover-placeholder" aria-hidden="true">A good read</div>
        )}
      </Link>
      <div className="book-card-copy">
        <span className="eyebrow">{category || "Book"}</span>
        <h3><Link to={`/books/${encodeURIComponent(book.id)}`}>{book.title}</Link></h3>
        <p>{book.author}</p>
        <div className="book-card-bottom">
          <strong>${Number(book.price).toFixed(2)}</strong>
          {onFavorite && (
            <button
              className={`favorite-button ${favorite ? "is-favorite" : ""}`}
              onClick={() => onFavorite(book.id)}
              aria-label={favorite ? `Remove ${book.title} from favorites` : `Add ${book.title} to favorites`}
              title={favorite ? "Remove from favorites" : "Add to favorites"}
            >
              {favorite ? "♥" : "♡"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
