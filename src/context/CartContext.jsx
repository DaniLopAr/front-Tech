import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [items, setItems] = useState([]);

    const agregarAlCarrito = (producto) => {
        setItems(prev => {
            const existe = prev.find(item => item.id === producto.id);
            if (existe) {
                return prev.map(item =>
                    item.id === producto.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                )
            }

            return [...prev, { ...producto, cantidad: 1 }]
        })
    }

    const eliminarDelCarrito = (id) => {
        setItems(prev => prev.filter(item => item.id !== id))
    }

    const vaciarCarrito = () => {
        setItems([])
    }

    const actualizarCantidad = (id, cantidad) => {
        if (cantidad < 1) return
        setItems(prev => {
            return prev.map(item =>   // ← falta el return
                item.id === id ? { ...item, cantidad } : item
            )
        })
    }

    const total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0)

    const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0)

    return (
        <CartContext.Provider value={{
            items,
            agregarAlCarrito,
            eliminarDelCarrito,
            vaciarCarrito,
            actualizarCantidad,
            total,
            totalItems

        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    return useContext(CartContext)
}













