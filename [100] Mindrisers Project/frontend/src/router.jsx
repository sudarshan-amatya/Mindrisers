import { createBrowserRouter, Navigate, Outlet, useOutletContext } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Cart from "./pages/Cart.jsx";
import SignupPage from "./pages/Signup.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";




const isAuthed = () => !!localStorage.getItem("token");

function RequireAuth() {
    const ctx = useOutletContext();
    return isAuthed() ? <Outlet context={ctx} /> : <Navigate to="/login" replace />;
}

function RedirectIfAuth() {
    const ctx = useOutletContext();
    return isAuthed() ? <Navigate to="/" replace /> : <Outlet context={ctx} />;
}

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <NotFound />,
        children: [
            { index: true, element: <Home /> },
            { path: "about", element: <About /> },
            { path: "product/:id", element: <ProductDetails /> },
            { path: "category/:category", element: <CategoryPage /> },
            { path: "products", element: <ProductsPage /> },

            {
                element: <RedirectIfAuth />,
                children: [
                    { path: "login", element: <LoginPage /> },
                    { path: "signup", element: <SignupPage /> },
                ],
            },

            {
                element: <RequireAuth />,
                children: [
                    { path: "cart", element: <Cart /> },
                    { path: "profile", element: <ProfilePage /> },
                ],

            },
        ],
    },
]);
