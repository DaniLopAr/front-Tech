import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null)
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        // Al cargar la app verifica si hay un token guardado
        const token = localStorage.getItem('access')
        const username = localStorage.getItem('username')
        if (token && username) {
            setUsuario({ username })
        }
        setCargando(false)
    }, [])

    const login = async (username, password) => {
        const data = await authService.login(username, password)
        localStorage.setItem('username', username)
        setUsuario({ username })
        return data
    }

    const logout = () => {
        authService.logout()
        localStorage.removeItem('username')
        setUsuario(null)
    }

    return (
        <AuthContext.Provider value={{ usuario, login, logout, cargando }}>
            {children}
        </AuthContext.Provider>
    )
}

// Hook personalizado para usar el context fácilmente
export function useAuth() {
    return useContext(AuthContext)
}