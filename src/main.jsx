import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { Navbar, Footer, Home } from './layout'
import { Catalog } from './pages/Catalogo'
import { Login } from './pages/Login'
import { Carrito } from './pages/Carrito'
import { ProductDetail } from './pages/ProductDetail'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { Toaster } from 'react-hot-toast'
import { ProtectedRoute } from './Components/ProtectedRoute'
import { Checkout } from './pages/Checkout'
import { OrderSuccess } from './pages/OrderSuccess'
import './i18n'




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster position="bottom-right" reverseOrder={false} />


    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Syne:wght@400;500;600&display=swap" rel="stylesheet"></link>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/carrito" element={
              <ProtectedRoute>
                <Carrito />
              </ProtectedRoute>
            } />
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalog />} />
          </Routes>
          <Footer />
        </CartProvider>

      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)