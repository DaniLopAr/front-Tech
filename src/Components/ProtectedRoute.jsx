import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'


export function ProtectedRoute({ children }) {
    const { usuario, cargando } = useAuth()

    if (cargando) return null

    if (!usuario) return <Navigate to="/login" />

    return children
}