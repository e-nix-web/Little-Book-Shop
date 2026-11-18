import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function HomePage() {
  const { user } = useAuth();
  return (
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">A small shop for big imaginations</span>
        <h1>Find your next<br /><em>favorite chapter.</em></h1>
        <p>Thoughtful reads, friendly recommendations, and a little room to wander.</p>
        <div className="hero-actions">
          <Link className="button primary" to={user?.role === "customer" ? "/books" : "/login"}>Browse the shelves</Link>
          {!user && <Link className="button secondary" to="/signup">Join the book club</Link>}
        </div>
      </div>
      <div className="hero-art" aria-hidden="true">
        <div className="sun-disc" />
        <div className="book-stack"><span /><span /><span /></div>
        <span className="art-sprig">✳</span>
      </div>
      <section className="home-note">
        <span className="eyebrow">A note for learners</span>
        <h2>One little demo, two ways to explore.</h2>
        <p>Sign in as a reader to explore books, or use the shopkeeper demo to try catalog tools.</p>
        {user && <p className="signed-in-note">You are signed in as {user.name} ({user.role}).</p>}
      </section>
    </section>
  );
}
