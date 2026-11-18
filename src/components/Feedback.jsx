export function Feedback({ error, success }) {
  if (error) return <p className="feedback error" role="alert">{error}</p>;
  if (success) return <p className="feedback success" role="status">{success}</p>;
  return null;
}

export function EmptyState({ title, children }) {
  return <div className="empty-state"><h3>{title}</h3><p>{children}</p></div>;
}
