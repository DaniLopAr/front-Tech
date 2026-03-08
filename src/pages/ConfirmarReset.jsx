import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'
import { toast } from 'react-hot-toast'

export function ConfirmarReset() {
    const { uid, token } = useParams()
    const [password, setPassword] = useState('')
    const [confirmar, setConfirmar] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (password !== confirmar) {
            toast.error('Las contraseñas no coinciden')
            return
        }
        setLoading(true)
        try {
            await api.post('confirmar-reset/', { uid, token, password })
            toast.success('Contraseña actualizada')
            navigate('/login')
        } catch (err) {
            toast.error('El enlace es inválido o ya expiró')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <style>{`
                .reset-page {
                    min-height: 100vh;
                    background: var(--bg-deep);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
                    padding: 2rem;
                }

                .reset-card {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: 20px;
                    padding: 2.5rem;
                    width: 100%;
                    max-width: 420px;
                }

                .reset-eyebrow {
                    font-size: 0.62rem;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    color: var(--accent-violet);
                    font-weight: 600;
                    margin-bottom: 0.4rem;
                }

                .reset-title {
                    font-size: 1.6rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: 0.5rem;
                }

                .reset-desc {
                    font-size: 0.85rem;
                    color: var(--text-muted);
                    margin-bottom: 2rem;
                    line-height: 1.6;
                }

                .reset-label {
                    display: block;
                    font-size: 0.72rem;
                    font-weight: 600;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    margin-bottom: 0.4rem;
                }

                .reset-input {
                    width: 100%;
                    background: var(--bg-elevated);
                    border: 1px solid var(--border-subtle);
                    border-radius: 10px;
                    padding: 0.75rem 1rem;
                    color: var(--text-primary);
                    font-size: 0.88rem;
                    outline: none;
                    box-sizing: border-box;
                    transition: border-color 0.25s;
                    margin-bottom: 1.25rem;
                }

                .reset-input:focus {
                    border-color: var(--accent-violet);
                    box-shadow: var(--glow-soft);
                }

                .reset-btn {
                    width: 100%;
                    padding: 0.9rem;
                    background: var(--gradient-button);
                    border: none;
                    border-radius: 12px;
                    color: white;
                    font-size: 0.88rem;
                    font-weight: 700;
                    cursor: pointer;
                    box-shadow: var(--glow-purple);
                    transition: all 0.3s;
                }

                .reset-btn:hover { transform: translateY(-2px); }
                .reset-btn:disabled { opacity: 0.6; cursor: not-allowed; }
            `}</style>

            <div className="reset-page">
                <div className="reset-card">
                    <div className="reset-eyebrow">Cuenta</div>
                    <h1 className="reset-title">Nueva contraseña</h1>
                    <p className="reset-desc">Ingresa tu nueva contraseña.</p>

                    <form onSubmit={handleSubmit}>
                        <label className="reset-label">Nueva contraseña</label>
                        <input
                            className="reset-input"
                            type="password"
                            placeholder="Mínimo 8 caracteres"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        <label className="reset-label">Confirmar contraseña</label>
                        <input
                            className="reset-input"
                            type="password"
                            placeholder="Repite la contraseña"
                            value={confirmar}
                            onChange={e => setConfirmar(e.target.value)}
                            required
                        />
                        <button className="reset-btn" type="submit" disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar contraseña'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}