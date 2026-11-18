import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Layout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  function handleSignOut() {
    signOut();
    navigate("/");
  }

  return (
    <div className="app-shell">
      <div className="demo-banner">
        Frontend demo only — account and role checks are not secure authentication.
      </div>
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Little Bookshop home">
          <span className="brand-icon" aria-hidden="true">LB</span>
          <span>little bookshop</span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/">Home</NavLink>
          {user?.role === "customer" && (
            <>
              <NavLink to="/books">Books</NavLink>
              <NavLink to="/favorites">Favorites</NavLink>
              <NavLink to="/account">Account</NavLink>
            </>
          )}
          {user?.role === "admin" && (
            <>
              <NavLink to="/admin">Dashboard</NavLink>
              <NavLink to="/admin/books">Manage books</NavLink>
              <NavLink to="/admin/categories">Categories</NavLink>
              <NavLink to="/admin/inventory">Inventory</NavLink>
            </>
          )}
          {user ? (
            <button className="nav-button" onClick={handleSignOut}>Sign out</button>
          ) : (
            <NavLink to="/login">Sign in</NavLink>
          )}
        </nav>
      </header>
      <main className="main-content"><Outlet /></main>
      <footer className="site-footer">A cozy corner for curious readers.</footer>
    </div>
  );
}
