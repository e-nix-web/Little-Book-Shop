export async function searchOpenLibrary(query) {
  const searchTerm = query.trim();
  if (!searchTerm) return [];

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 20_000);
  let response;
  try {
    response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(searchTerm)}&limit=8`,
      { signal: controller.signal },
    );
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Book discovery took too long. Please try again.");
    }
    throw new Error("Could not reach Open Library. Check your connection and try again.");
  } finally {
    window.clearTimeout(timeoutId);
  }
  if (!response.ok) {
    throw new Error("Book discovery is temporarily unavailable. Please try again.");
  }

  const result = await response.json();
  return (result.docs || []).map((book, index) => ({
    id: book.key || `${book.title}-${index}`,
    title: book.title || "Untitled book",
    author: book.author_name?.[0] || "Author unknown",
    year: book.first_publish_year,
    cover: book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : "",
  }));
}
