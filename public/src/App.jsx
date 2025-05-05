"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import ShopPage from "./pages/ShopPage"
import ProductDetailPage from "./pages/ProductDetailPage"
import CartPage from "./pages/CartPage"
import CheckoutPage from "./pages/CheckoutPage"
import OrderConfirmationPage from "./pages/OrderConfirmationPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import OrdersPage from "./pages/OrdersPage"
import OrderDetailPage from "./pages/OrderDetailPage"
import AboutPage from "./pages/AboutPage"
import ContactPage from "./pages/ContactPage"
import ProfilePage from "./pages/ProfilePage"
import Header from "./components/Header"
import Footer from "./components/Footer"
import ProtectedRoute from "./components/ProtectedRoute"
import { CartProvider } from "./contexts/CartContext"
import { AuthProvider } from "./contexts/AuthContext"

// Admin imports
import AdminLayout from "./components/admin/AdminLayout"
import AdminDashboard from "./pages/admin/AdminDashboard"
import ProductsPage from "./pages/admin/ProductsPage"
import ProductForm from "./pages/admin/ProductForm"
import CategoriesPage from "./pages/admin/CategoriesPage"
import AdminOrdersPage from "./pages/admin/OrdersPage"
import AdminOrderDetailPage from "./pages/admin/OrderDetailPage"
import CustomersPage from "./pages/admin/CustomersPage"
import AnalyticsPage from "./pages/admin/AnalyticsPage"
import SettingsPage from "./pages/admin/SettingsPage"
import AdminList from "./pages/admin/AdminList"

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    if (isDarkMode) {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    } else {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    }
  }

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Customer-facing routes */}
            <Route
              path="/"
              element={
                <>
                  <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
                  <HomePage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/shop"
              element={
                <>
                  <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
                  <ShopPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/product/:id"
              element={
                <>
                  <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
                  <ProductDetailPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/cart"
              element={
                <>
                  <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
                  <CartPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
                  <CheckoutPage />
                  <Footer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-confirmation"
              element={
                <ProtectedRoute>
                  <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
                  <OrderConfirmationPage />
                  <Footer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <>
                  <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
                  <LoginPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/register"
              element={
                <>
                  <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
                  <RegisterPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
                  <OrdersPage />
                  <Footer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order/:id"
              element={
                <ProtectedRoute>
                  <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
                  <OrderDetailPage />
                  <Footer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
                  <ProfilePage />
                  <Footer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/about"
              element={
                <>
                  <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
                  <AboutPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/contact"
              element={
                <>
                  <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
                  <ContactPage />
                  <Footer />
                </>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminLayout>
                  <ProductsPage />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/products/:id"
              element={
                <AdminLayout>
                  <ProductForm />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <AdminLayout>
                  <CategoriesPage />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <AdminLayout>
                  <AdminOrdersPage />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/orders/:id"
              element={
                <AdminLayout>
                  <AdminOrderDetailPage />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/customers"
              element={
                <AdminLayout>
                  <CustomersPage />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <AdminLayout>
                  <AnalyticsPage />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <AdminLayout>
                  <SettingsPage />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/admins"
              element={
                <AdminLayout>
                  <AdminList />
                </AdminLayout>
              }
            />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App