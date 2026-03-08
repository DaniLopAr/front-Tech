import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export function SolicitarReset() {
    const [email, setEmail] = useState('')
    const [enviado, setEnviado] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await api.post('solicitar-reset/', { email })
            setEnviado(true)
        } catch (err) {
            setEnviado(true) // igual mostramos éxito por seguridad
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
                    margin-bottom: 1rem;
                }

                .reset-btn:hover { transform: translateY(-2px); }
                .reset-btn:disabled { opacity: 0.6; cursor: not-allowed; }

                .reset-back {
                    width: 100%;
                    padding: 0.75rem;
                    background: transparent;
                    border: 1px solid var(--border-subtle);
                    border-radius: 12px;
                    color: var(--text-muted);
                    font-size: 0.82rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.25s;
                }

                .reset-back:hover { border-color: var(--accent-violet); color: var(--text-primary); }

                .reset-success {
                    text-align: center;
                    padding: 1rem 0;
                }

                .reset-success-icon { font-size: 3rem; margin-bottom: 1rem; }
                .reset-success-title { font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem; }
                .reset-success-desc { font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; }
            `}</style>

            <div className="reset-page">
                <div className="reset-card">
                    {enviado ? (
                        <div className="reset-success">
                            <div className="reset-success-icon">📬</div>
                            <div className="reset-success-title">Correo enviado</div>
                            <p className="reset-success-desc">
                                Si el correo está registrado, recibirás un enlace para restablecer tu contraseña en los próximos minutos.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="reset-eyebrow">Cuenta</div>
                            <h1 className="reset-title">¿Olvidaste tu contraseña?</h1>
                            <p className="reset-desc">Ingresa tu correo y te enviaremos un enlace para restablecerla.</p>

                            <form onSubmit={handleSubmit}>
                                <label className="reset-label">Correo electrónico</label>
                                <input
                                    className="reset-input"
                                    type="email"
                                    placeholder="tu@correo.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                                <button className="reset-btn" type="submit" disabled={loading}>
                                    {loading ? 'Enviando...' : 'Enviar enlace'}
                                </button>
                            </form>
                            <button className="reset-back" onClick={() => navigate('/login')}>
                                ← Volver al login
                            </button>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}