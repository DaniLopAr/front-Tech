import { useState } from "react";
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { authService } from "../services/authService";

export function Login() {
    const [tab, setTab] = useState("login"); // "login" | "register"
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const { login } = useAuth()
    const navigate = useNavigate()

    // Estados login
    const [loginData, setLoginData] = useState({ username: "", password: "" });

    // Estados register
    const [registerData, setRegisterData] = useState({
        username: "", email: "", password: "", confirm: ""
    });

    const handleLoginChange = e =>
        setLoginData({ ...loginData, [e.target.name]: e.target.value });

    const handleRegisterChange = e =>
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            await login(loginData.username, loginData.password)
            navigate('/')
        } catch (error) {
            console.log(error)
            alert('Usuario o contraseña incorrectos')
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        if (registerData.password !== registerData.confirm) {
            alert('Las contraseñas no coinciden')
            return
        }
        try {
            await authService.registro(
                registerData.username,
                registerData.email,
                registerData.password,
                registerData.confirm
            )
            alert('¡Cuenta creada exitosamente!')
            setTab('login')  // cambia al tab de login después de registrarse
        } catch (error) {
            alert('Error al crear la cuenta, intenta de nuevo')
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700&family=Syne:wght@400;500;600&display=swap');

                .auth-root {
                    min-height: 100vh;
                    background: var(--bg-deep);
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;
                    color: var(--text-primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    box-sizing: border-box;
                    position: relative;
                    overflow: hidden;
                }

                /* Orbes decorativos */
                .auth-orb-1 {
                    position: absolute;
                    top: -100px; left: -100px;
                    width: 400px; height: 400px;
                    background: radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%);
                    border-radius: 50%;
                    pointer-events: none;
                }

                .auth-orb-2 {
                    position: absolute;
                    bottom: -100px; right: -100px;
                    width: 350px; height: 350px;
                    background: radial-gradient(circle, rgba(247,37,133,0.1) 0%, transparent 70%);
                    border-radius: 50%;
                    pointer-events: none;
                }

                /* Card */
                .auth-card {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: 24px;
                    padding: 2.5rem;
                    width: 100%;
                    max-width: 420px;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 24px 80px rgba(0,0,0,0.4);
                }

                /* Línea superior con gradiente */
                .auth-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 2px;
                    background: var(--gradient-hero);
                }

                /* Logo */
                .auth-logo {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.6rem;
                    margin-bottom: 2rem;
                    text-decoration: none;
                }

                .auth-logo-icon {
                    width: 32px; height: 32px;
                }

                .auth-logo-name {
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;, monospace;
                    font-weight: 700;
                    font-size: 1rem;
                    color: var(--text-primary);
                    letter-spacing: 0.1em;
                }

                /* Tabs */
                .auth-tabs {
                    display: flex;
                    background: var(--bg-elevated);
                    border-radius: 12px;
                    padding: 4px;
                    margin-bottom: 2rem;
                    gap: 4px;
                }

                .auth-tab {
                    flex: 1;
                    padding: 0.6rem;
                    border: none;
                    border-radius: 9px;
                    background: transparent;
                    color: var(--text-muted);
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;
                    font-size: 0.82rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.25s;
                    letter-spacing: 0.04em;
                }

                .auth-tab.active {
                    background: var(--gradient-button);
                    color: white;
                    box-shadow: var(--glow-purple);
                }

                /* Formulario */
                .auth-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .auth-field {
                    display: flex;
                    flex-direction: column;
                    gap: 0.4rem;
                }

                .auth-label {
                    font-size: 0.72rem;
                    font-weight: 600;
                    color: var(--text-secondary);
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                }

                .auth-input-wrap {
                    position: relative;
                }

                .auth-input-icon {
                    position: absolute;
                    left: 14px; top: 50%;
                    transform: translateY(-50%);
                    font-size: 0.9rem;
                    opacity: 0.4;
                    pointer-events: none;
                }

                .auth-input {
                    width: 100%;
                    background: var(--bg-elevated);
                    border: 1px solid var(--border-subtle);
                    border-radius: 12px;
                    padding: 0.75rem 1rem 0.75rem 2.6rem;
                    color: var(--text-primary);
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;
                    font-size: 0.88rem;
                    outline: none;
                    transition: border-color 0.25s, box-shadow 0.25s;
                    box-sizing: border-box;
                }

                .auth-input::placeholder { color: var(--text-muted); }

                .auth-input:focus {
                    border-color: var(--accent-violet);
                    box-shadow: var(--glow-soft);
                }

                /* Botón ojo contraseña */
                .auth-eye {
                    position: absolute;
                    right: 12px; top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    font-size: 0.9rem;
                    padding: 4px;
                    transition: color 0.2s;
                }

                .auth-eye:hover { color: var(--text-primary); }

                /* Input con padding derecho para el ojo */
                .auth-input.has-eye {
                    padding-right: 2.6rem;
                }

                /* Link olvidé contraseña */
                .auth-forgot {
                    text-align: right;
                    margin-top: -0.5rem;
                }

                .auth-forgot a {
                    font-size: 0.72rem;
                    color: var(--accent-violet);
                    text-decoration: none;
                    transition: color 0.2s;
                }

                .auth-forgot a:hover { color: var(--accent-glow); }

                /* Botón submit */
                .auth-submit {
                    width: 100%;
                    padding: 0.85rem;
                    background: var(--gradient-button);
                    border: none;
                    border-radius: 12px;
                    color: white;
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;
                    font-size: 0.9rem;
                    font-weight: 700;
                    cursor: pointer;
                    letter-spacing: 0.04em;
                    transition: all 0.3s;
                    margin-top: 0.5rem;
                    box-shadow: var(--glow-purple);
                }

                .auth-submit:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 0 20px #a855f7cc, 0 0 40px #7c3aed44;
                }

                .auth-submit:active { transform: translateY(0); }

                /* Divider */
                .auth-divider {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin: 0.5rem 0;
                }

                .auth-divider-line {
                    flex: 1;
                    height: 1px;
                    background: var(--border-subtle);
                }

                .auth-divider-text {
                    font-size: 0.7rem;
                    color: var(--text-muted);
                    letter-spacing: 0.08em;
                }

                /* Footer texto */
                .auth-footer-text {
                    text-align: center;
                    font-size: 0.78rem;
                    color: var(--text-muted);
                    margin-top: 1rem;
                }

                .auth-footer-text button {
                    background: none;
                    border: none;
                    color: var(--accent-violet);
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;
                    font-size: 0.78rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: color 0.2s;
                }

                .auth-footer-text button:hover { color: var(--accent-glow); }

                /* Animación de entrada del form */
                .auth-form {
                    animation: auth-fade 0.3s ease;
                }

                @keyframes auth-fade {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="auth-root">
                <div className="auth-orb-1" />
                <div className="auth-orb-2" />

                <div className="auth-card">

                    {/* Logo */}
                    <a href="/" className="auth-logo">
                        <svg className="auth-logo-icon" viewBox="0 0 36 36" fill="none">
                            <rect x="1" y="1" width="34" height="34" rx="9" stroke="url(#authgrad)" strokeWidth="1.5" />
                            <path d="M9 20 L14 11 L19 17 L23 13 L27 20" stroke="url(#authgrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="26" cy="24" r="2.5" fill="url(#authgrad)" />
                            <defs>
                                <linearGradient id="authgrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                                    <stop offset="0%" stopColor="#7c3aed" />
                                    <stop offset="100%" stopColor="#f72585" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <span className="auth-logo-name">TECHSTORE</span>
                    </a>

                    {/* Tabs */}
                    <div className="auth-tabs">
                        <button
                            className={`auth-tab ${tab === "login" ? "active" : ""}`}
                            onClick={() => setTab("login")}
                        >
                            Iniciar sesión
                        </button>
                        <button
                            className={`auth-tab ${tab === "register" ? "active" : ""}`}
                            onClick={() => setTab("register")}
                        >
                            Registrarse
                        </button>
                    </div>

                    {/* LOGIN */}
                    {tab === "login" && (
                        <form className="auth-form" onSubmit={handleLogin} key="login">
                            <div className="auth-field">
                                <label className="auth-label">Usuario</label>
                                <div className="auth-input-wrap">
                                    <span className="auth-input-icon">👤</span>
                                    <input
                                        className="auth-input"
                                        type="text"
                                        name="username"
                                        placeholder="daniel123"
                                        value={loginData.username}
                                        onChange={handleLoginChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label className="auth-label">Contraseña</label>
                                <div className="auth-input-wrap">
                                    <span className="auth-input-icon">🔒</span>
                                    <input
                                        className="auth-input has-eye"
                                        type={showPass ? "text" : "password"}
                                        name="password"
                                        placeholder="••••••••"
                                        value={loginData.password}
                                        onChange={handleLoginChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="auth-eye"
                                        onClick={() => setShowPass(!showPass)}
                                    >
                                        {showPass ? "🙈" : "👁️"}
                                    </button>
                                </div>
                            </div>

                            <button onClick={() => navigate('/forgot-password')} style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--accent-violet)',
                                fontSize: '0.78rem',
                                cursor: 'pointer',
                                padding: 0,
                            }}>
                                ¿Olvidaste tu contraseña?
                            </button>

                            <button type="submit" className="auth-submit">
                                Iniciar sesión →
                            </button>

                            <p className="auth-footer-text">
                                ¿No tienes cuenta?{" "}
                                <button type="button" onClick={() => setTab("register")}>
                                    Regístrate gratis
                                </button>
                            </p>
                        </form>
                    )}

                    {/* REGISTER */}
                    {tab === "register" && (
                        <form className="auth-form" onSubmit={handleRegister} key="register">
                            <div className="auth-field">
                                <label className="auth-label">Nombre de usuario</label>
                                <div className="auth-input-wrap">
                                    <span className="auth-input-icon">👤</span>
                                    <input
                                        className="auth-input"
                                        type="text"
                                        name="username"
                                        placeholder="daniel123"
                                        value={registerData.username}
                                        onChange={handleRegisterChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label className="auth-label">Email</label>
                                <div className="auth-input-wrap">
                                    <span className="auth-input-icon">✉️</span>
                                    <input
                                        className="auth-input"
                                        type="email"
                                        name="email"
                                        placeholder="tu@email.com"
                                        value={registerData.email}
                                        onChange={handleRegisterChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label className="auth-label">Contraseña</label>
                                <div className="auth-input-wrap">
                                    <span className="auth-input-icon">🔒</span>
                                    <input
                                        className="auth-input has-eye"
                                        type={showPass ? "text" : "password"}
                                        name="password"
                                        placeholder="••••••••"
                                        value={registerData.password}
                                        onChange={handleRegisterChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="auth-eye"
                                        onClick={() => setShowPass(!showPass)}
                                    >
                                        {showPass ? "🙈" : "👁️"}
                                    </button>
                                </div>
                            </div>

                            <div className="auth-field">
                                <label className="auth-label">Confirmar contraseña</label>
                                <div className="auth-input-wrap">
                                    <span className="auth-input-icon">🔒</span>
                                    <input
                                        className="auth-input has-eye"
                                        type={showConfirm ? "text" : "password"}
                                        name="confirm"
                                        placeholder="••••••••"
                                        value={registerData.confirm}
                                        onChange={handleRegisterChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="auth-eye"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                    >
                                        {showConfirm ? "🙈" : "👁️"}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="auth-submit">
                                Crear cuenta →
                            </button>

                            <p className="auth-footer-text">
                                ¿Ya tienes cuenta?{" "}
                                <button type="button" onClick={() => setTab("login")}>
                                    Inicia sesión
                                </button>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
}