import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import RoleRoute from "./components/RoleRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { StoreProvider } from "./context/StoreContext.jsx";
import HomePage from "./pages/HomePage.jsx";
import { ForgotPasswordPage, LoginPage, ResetPasswordPage, SignupPage } from "./pages/AuthPages.jsx";
import {
  AccountPage,
  AdminBooksPage,
  AdminCategoriesPage,
  AdminDashboardPage,
  BookDetailsPage,
  BooksPage,
  FavoritesPage,
  InventoryPage,
} from "./pages/StorePages.jsx";

function AppRoutes() {
  const { user } = useAuth();
  const knownRole = user && ["customer", "admin"].includes(user.role);
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={knownRole ? <Navigate to={user.role === "admin" ? "/admin" : "/books"} replace /> : <LoginPage />} />
        <Route path="signup" element={knownRole ? <Navigate to={user.role === "admin" ? "/admin" : "/books"} replace /> : <SignupPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route element={<RoleRoute roles={["customer"]} />}>
          <Route path="books" element={<BooksPage />} />
          <Route path="books/:bookId" element={<BookDetailsPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="account" element={<AccountPage />} />
        </Route>
        <Route element={<RoleRoute roles={["admin"]} />}>
          <Route path="admin" element={<AdminDashboardPage />} />
          <Route path="admin/books" element={<AdminBooksPage />} />
          <Route path="admin/categories" element={<AdminCategoriesPage />} />
          <Route path="admin/inventory" element={<InventoryPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return <StoreProvider><AppRoutes /></StoreProvider>;
}
