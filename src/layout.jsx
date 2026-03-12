import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { productService } from './services/productService'
import { useCart } from './context/CartContext'
import { useAuth } from './context/AuthContext'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'



const CATEGORIES = [
    { icon: '💻', name: 'Laptops', desc: 'Potencia para trabajar y crear' },
    { icon: '📱', name: 'Smartphones', desc: 'Conectividad de próxima gen' },
    { icon: '🎧', name: 'Audio', desc: 'Sonido inmersivo sin límites' },
    { icon: '⌚', name: 'Wearables', desc: 'Tech que llevas contigo' },
    { icon: '🖥️', name: 'Monitores', desc: 'Visión ultra nítida' },
    { icon: '🎮', name: 'Gaming', desc: 'Equipos para ganar' },
]

function useInView(threshold = 0.15) {
    const ref = useRef(null)
    const [inView, setInView] = useState(false)
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setInView(true) },
            { threshold }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [threshold])
    return [ref, inView]
}



export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeLink, setActiveLink] = useState("/");
    const { usuario, logout } = useAuth()
    const navigate = useNavigate()
    const { totalItems } = useCart()
    const [heroProducto, setHeroProducto] = useState(null)
    const { t, i18n } = useTranslation()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const links = [
        { href: "/", label: t('inicio') },
        { href: "/catalogo", label: t('catalogo') },

    ]

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700&family=Syne:wght@400;500;600&display=swap');

                .nb2-root {
                    position: fixed;
                    top: 0; left: 0;
                    width: 100%;
                    z-index: 100;
                    font-family: 'Syne', sans-serif;
                    transition: all 0.5s ease;
                    padding: 0 5%;
                    box-sizing: border-box;
                }

                /* Barra superior decorativa */
                .nb2-root::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 2px;
                    background: linear-gradient(90deg,
                        transparent 0%,
                        var(--accent-purple) 30%,
                        var(--accent-pink) 70%,
                        transparent 100%
                    );
                    opacity: 0;
                    transition: opacity 0.5s ease;
                }

                .nb2-root.scrolled::before {
                    opacity: 1;
                }

                .nb2-root.scrolled {
                    background: rgba(8, 7, 15, 0.88);
                    backdrop-filter: blur(24px) saturate(2);
                    -webkit-backdrop-filter: blur(24px) saturate(2);
                }

                .nb2-inner {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: 75px;
                }

                /* ── LOGO ── */
                .nb2-logo {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    text-decoration: none;
                }

                .nb2-logo-mark svg {
                    width: 36px;
                    height: 36px;
                }

                .nb2-logo-text {
                    display: flex;
                    flex-direction: column;
                    line-height: 1;
                    gap: 3px;
                }

                .nb2-logo-name {
                    font-family: 'Orbitron', monospace;
                    font-weight: 700;
                    font-size: 1rem;
                    color: var(--text-primary);
                    letter-spacing: 0.12em;
                }

                .nb2-logo-tagline {
                    font-size: 0.55rem;
                    color: var(--text-muted);
                    letter-spacing: 0.25em;
                    text-transform: uppercase;
                }

                /* ── LINKS ── */
                .nb2-links {
                    display: flex;
                    list-style: none;
                    margin: 0; padding: 0;
                    gap: 0;
                    align-items: center;
                }

                .nb2-links li a {
                    position: relative;
                    display: flex;
                    align-items: center;
                    color: var(--text-muted);
                    text-decoration: none;
                    font-size: 0.75rem;
                    font-weight: 600;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    padding: 0.6rem 1.2rem;
                    transition: color 0.3s;
                    overflow: hidden;
                    border-radius: 8px;
                }

                /* Fondo hover que se desliza */
                .nb2-links li a::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg,
                        rgba(124, 58, 237, 0.1),
                        rgba(247, 37, 133, 0.05)
                    );
                    border-radius: 8px;
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 0.3s cubic-bezier(0.34, 1.2, 0.64, 1);
                }

                .nb2-links li a.active {
                    color: var(--text-primary);
                }

                /* Punto indicador link activo */
                .nb2-links li a.active::after {
                    content: '';
                    position: absolute;
                    bottom: 5px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 4px; height: 4px;
                    background: var(--accent-violet);
                    border-radius: 50%;
                    box-shadow: var(--glow-purple);
                }

                .nb2-links li a:hover {
                    color: var(--text-primary);
                }

                .nb2-links li a:hover::before {
                    transform: scaleX(1);
                }

                /* Separador vertical */
                .nb2-sep {
                    width: 1px;
                    height: 16px;
                    background: var(--border-subtle);
                    margin: 0 0.1rem;
                }

                /* ── ACCIONES ── */
                .nb2-actions {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .nb2-login {
                    font-family: 'Syne', sans-serif;
                    font-size: 0.75rem;
                    font-weight: 600;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: var(--text-secondary);
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0.5rem 0.8rem;
                    transition: color 0.25s;
                    text-decoration: none;
                }

                .nb2-login:hover {
                    color: var(--accent-glow);
                }

                .nb2-cart {
                    position: relative;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: var(--bg-elevated);
                    border: 1px solid var(--border-subtle);
                    border-radius: 12px;
                    padding: 0.55rem 1rem;
                    color: var(--text-primary);
                    font-family: 'Syne', sans-serif;
                    font-size: 0.8rem;
                    font-weight: 600;
                    letter-spacing: 0.05em;
                    cursor: pointer;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    overflow: visible;
                }

                .nb2-cart::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: var(--gradient-button);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .nb2-cart:hover::before { opacity: 1; }

                .nb2-cart:hover {
                    border-color: var(--accent-purple);
                    box-shadow: var(--glow-purple);
                    color: white;
                }

                .nb2-cart-label, .nb2-cart-icon {
                    position: relative;
                    z-index: 1;
                }

                .nb2-badge {
    position: absolute;
    top: -8px; right: -8px;
    z-index: 2;
    min-width: 20px; height: 20px;
    background: linear-gradient(135deg, #f72585, #b5179e);
    border-radius: 50%;
    border: 2px solid var(--bg-deep);
    font-family: 'Orbitron', monospace;
    font-size: 0.58rem;
    font-weight: 700;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 3px;
    box-shadow: 0 0 10px rgba(247,37,133,0.6);
    animation: nb2-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

                @keyframes nb2-pop {
                    from { transform: scale(0); }
                    to   { transform: scale(1); }
                }

                /* ── HAMBURGER ── */
                .nb2-hamburger {
                    display: none;
                    flex-direction: column;
                    justify-content: center;
                    gap: 5px;
                    cursor: pointer;
                    background: none;
                    border: 1px solid var(--border-subtle);
                    border-radius: 8px;
                    padding: 8px;
                    transition: border-color 0.3s;
                }

                .nb2-hamburger:hover { border-color: var(--accent-purple); }

                .nb2-hamburger span {
                    display: block;
                    height: 1.5px;
                    background: var(--text-secondary);
                    border-radius: 2px;
                    transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .nb2-hamburger span:nth-child(1) { width: 20px; }
                .nb2-hamburger span:nth-child(2) { width: 14px; }
                .nb2-hamburger span:nth-child(3) { width: 20px; }

                .nb2-hamburger.open span:nth-child(1) {
                    width: 20px;
                    transform: translateY(6.5px) rotate(45deg);
                    background: var(--accent-violet);
                }
                .nb2-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
                .nb2-hamburger.open span:nth-child(3) {
                    width: 20px;
                    transform: translateY(-6.5px) rotate(-45deg);
                    background: var(--accent-violet);
                }

                /* ── MOBILE MENU ── */
                .nb2-mobile {
                    position: fixed;
                    top: 75px; left: 0;
                    width: 100%;
                    background: rgba(8, 7, 15, 0.97);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid var(--border-accent);
                    padding: 1.5rem 5%;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                    transform: translateY(-10px);
                    opacity: 0;
                    pointer-events: none;
                    transition: all 0.3s ease;
                }

                .nb2-mobile.open {
                    transform: translateY(0);
                    opacity: 1;
                    pointer-events: all;
                }

                .nb2-mobile a {
                    color: var(--text-secondary);
                    text-decoration: none;
                    padding: 0.9rem 1rem;
                    border-radius: 10px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    border: 1px solid transparent;
                    transition: all 0.2s;
                }

                .nb2-mobile a:hover {
                    color: var(--text-primary);
                    background: rgba(124, 58, 237, 0.08);
                    border-color: var(--border-accent);
                }

                .nb2-mobile-divider {
                    height: 1px;
                    background: var(--border-subtle);
                    margin: 0.75rem 0;
                }

                @media (max-width: 768px) {
                    .nb2-links, .nb2-login { display: none; }
                    .nb2-hamburger { display: flex; }
                }
            `}</style>

            <nav className={`nb2-root ₡{scrolled ? "scrolled" : ""}`}>
                <div className="nb2-inner">

                    {/* Logo */}
                    <a href="/" className="nb2-logo">
                        <div className="nb2-logo-mark">
                            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="1" y="1" width="34" height="34" rx="9" stroke="url(#nb2grad)" strokeWidth="1.5" />
                                <path d="M9 20 L14 11 L19 17 L23 13 L27 20" stroke="url(#nb2grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="26" cy="24" r="2.5" fill="url(#nb2grad)" />
                                <defs>
                                    <linearGradient id="nb2grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                                        <stop offset="0%" stopColor="#7c3aed" />
                                        <stop offset="100%" stopColor="#f72585" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div className="nb2-logo-text">
                            <span className="nb2-logo-name">Techno</span>
                            <span className="nb2-logo-tagline">Next Gen Gear</span>
                        </div>
                    </a>

                    {/* Links */}
                    <ul className="nb2-links">
                        {links.map((link, i) => (
                            <li key={link.href} style={{ display: "contents" }}>
                                {i > 0 && <div className="nb2-sep" />}
                                <a
                                    href={link.href}
                                    className={activeLink === link.href ? "active" : ""}
                                    onClick={() => setActiveLink(link.href)}
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                        {['es', 'en', 'pt'].map(lang => (
                            <button
                                key={lang}
                                onClick={() => i18n.changeLanguage(lang)}
                                style={{
                                    background: i18n.language === lang ? 'rgba(124,58,237,0.2)' : 'transparent',
                                    border: `1px solid ${i18n.language === lang ? 'var(--accent-violet)' : 'var(--border-subtle)'}`,
                                    borderRadius: '6px',
                                    padding: '0.3rem 0.5rem',
                                    color: i18n.language === lang ? 'var(--accent-violet)' : 'var(--text-muted)',
                                    fontSize: '0.65rem',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>

                    {/* Acciones */}
                    <div className="nb2-actions">
                        <Link to="/carrito" className="nb2-cart">
                            <span className="nb2-cart-icon">🛒</span>
                            <span className="nb2-cart-label">{t('carrito')}</span>
                            {totalItems > 0 && (
                                <span className="nb2-badge">{totalItems}</span>
                            )}
                        </Link>
                        {usuario ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    background: 'rgba(124,58,237,0.15)',
                                    border: '1px solid var(--border-accent)',
                                    borderRadius: '100px',
                                    padding: '0.35rem 0.75rem 0.35rem 0.35rem',
                                }}>
                                    <div style={{
                                        width: '28px', height: '28px',
                                        borderRadius: '50%',
                                        background: 'var(--gradient-button)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        color: 'white',
                                        textTransform: 'uppercase',
                                    }}>
                                        {usuario.username[0]}
                                    </div>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                                        {usuario.username}
                                    </span>
                                </div>
                                <button onClick={() => { logout(); navigate('/') }} style={{
                                    background: 'transparent',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: '8px',
                                    padding: '0.35rem 0.75rem',
                                    color: 'var(--text-muted)',
                                    fontSize: '0.75rem',
                                    cursor: 'pointer',
                                    fontFamily: 'Syne, sans-serif',
                                    transition: 'all 0.2s',
                                }}>
                                    {t('salir')}
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" style={{
                                background: 'var(--gradient-button)',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '0.5rem 1.2rem',
                                color: 'white',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                textDecoration: 'none',
                                fontFamily: 'Syne, sans-serif',
                            }}>
                                Iniciar sesión
                            </Link>
                        )}
                        <button
                            className={`nb2-hamburger ₡{menuOpen ? "open" : ""}`}
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Menú"
                        >
                            <span /><span /><span />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile menu */}
            <div className={`nb2-mobile ₡{menuOpen ? "open" : ""}`}>
                {links.map(link => (
                    <a key={link.href} href={link.href}>{link.label}</a>
                ))}
                <div className="nb2-mobile-divider" />
                <a href="/cart">Carrito {totalItems > 0 && `(₡{cartItems})`}</a>
            </div>
        </>
    );
}










export function Footer() {
    const socials = [
        {
            name: "Instagram",
            href: "#",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
                </svg>
            ),
        },
        {
            name: "Twitter / X",
            href: "#",
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            ),
        },
        {
            name: "Facebook",
            href: "#",
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
            ),
        },
        {
            name: "YouTube",
            href: "#",
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
            ),
        },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Syne:wght@400;500;600&display=swap');

                .ft-root {
                    background: var(--bg-surface);
                    border-top: 1px solid var(--border-subtle);
                    font-family: 'Syne', sans-serif;
                    padding: 3rem 5% 1.5rem;
                    box-sizing: border-box;
                    position: relative;
                    overflow: hidden;
                }

                /* Glow decorativo en la esquina */
                .ft-root::before {
                    content: '';
                    position: absolute;
                    bottom: -60px; left: -60px;
                    width: 260px; height: 260px;
                    background: radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%);
                    pointer-events: none;
                }
                .ft-root::after {
                    content: '';
                    position: absolute;
                    top: -40px; right: -40px;
                    width: 200px; height: 200px;
                    background: radial-gradient(circle, rgba(247,37,133,0.08) 0%, transparent 70%);
                    pointer-events: none;
                }

                .ft-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 3rem;
                    flex-wrap: wrap;
                    margin-bottom: 2.5rem;
                }

                /* ── BRAND ── */
                .ft-brand {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    max-width: 260px;
                }

                .ft-logo {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    text-decoration: none;
                }

                .ft-logo-icon {
                    width: 32px; height: 32px;
                }

                .ft-logo-name {
                    font-family: 'Orbitron', monospace;
                    font-weight: 700;
                    font-size: 1rem;
                    color: var(--text-primary);
                    letter-spacing: 0.1em;
                }

                .ft-desc {
                    font-size: 0.82rem;
                    color: var(--text-muted);
                    line-height: 1.6;
                }

                /* ── CONTACTO ── */
                .ft-contact {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .ft-section-title {
                    font-size: 0.65rem;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    color: var(--accent-violet);
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                }

                .ft-contact-item {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    color: var(--text-secondary);
                    font-size: 0.83rem;
                    text-decoration: none;
                    transition: color 0.2s;
                }

                .ft-contact-item:hover { color: var(--text-primary); }

                .ft-contact-icon {
                    width: 16px; height: 16px;
                    opacity: 0.6;
                    flex-shrink: 0;
                }

                /* ── SOCIALS ── */
                .ft-socials {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .ft-social-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.5rem;
                }

                .ft-social-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 0.8rem;
                    border-radius: 8px;
                    background: var(--bg-elevated);
                    border: 1px solid var(--border-subtle);
                    color: var(--text-secondary);
                    text-decoration: none;
                    font-size: 0.75rem;
                    font-weight: 500;
                    transition: all 0.25s;
                }

                .ft-social-btn svg {
                    width: 14px; height: 14px;
                    flex-shrink: 0;
                }

                .ft-social-btn:hover {
                    color: var(--text-primary);
                    border-color: var(--border-accent);
                    background: rgba(124, 58, 237, 0.08);
                    box-shadow: var(--glow-soft);
                }

                /* ── DIVIDER ── */
                .ft-divider {
                    height: 1px;
                    background: linear-gradient(90deg,
                        transparent,
                        var(--border-subtle) 20%,
                        var(--border-subtle) 80%,
                        transparent
                    );
                    margin-bottom: 1.25rem;
                }

                /* ── BOTTOM ── */
                .ft-bottom {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }

                .ft-copy {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }

                .ft-copy span {
                    color: var(--accent-violet);
                }

                .ft-legal {
                    display: flex;
                    gap: 1.5rem;
                }

                .ft-legal a {
                    font-size: 0.72rem;
                    color: var(--text-muted);
                    text-decoration: none;
                    transition: color 0.2s;
                    letter-spacing: 0.03em;
                }

                .ft-legal a:hover { color: var(--text-secondary); }

                @media (max-width: 600px) {
                    .ft-top { flex-direction: column; gap: 2rem; }
                    .ft-bottom { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
                }
            `}</style>

            <footer className="ft-root">
                <div className="ft-top">

                    {/* Brand */}
                    <div className="ft-brand">
                        <a href="/" className="ft-logo">
                            <svg className="ft-logo-icon" viewBox="0 0 36 36" fill="none">
                                <rect x="1" y="1" width="34" height="34" rx="9" stroke="url(#ftgrad)" strokeWidth="1.5" />
                                <path d="M9 20 L14 11 L19 17 L23 13 L27 20" stroke="url(#ftgrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="26" cy="24" r="2.5" fill="url(#ftgrad)" />
                                <defs>
                                    <linearGradient id="ftgrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                                        <stop offset="0%" stopColor="#7c3aed" />
                                        <stop offset="100%" stopColor="#f72585" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <span className="ft-logo-name">TECHSTORE</span>
                        </a>
                        <p className="ft-desc">
                            Tu destino para la tecnología del futuro. Gadgets, componentes y accesorios de última generación.
                        </p>
                    </div>

                    {/* Contacto */}
                    <div className="ft-contact">
                        <div className="ft-section-title">Contacto</div>
                        <a href="mailto:hola@techstore.com" className="ft-contact-item">
                            <svg className="ft-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="2" y="4" width="20" height="16" rx="3" />
                                <path d="M2 7 L12 13 L22 7" />
                            </svg>
                            hola@techstore.com
                        </a>
                        <a href="tel:+50600000000" className="ft-contact-item">
                            <svg className="ft-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.6 1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1A16 16 0 0 1 3 4.5a1 1 0 0 1 1-1H7.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .6 3.6 1 1 0 0 1-.25 1z" />
                            </svg>
                            +506 0000-0000
                        </a>
                        <a href="#" className="ft-contact-item">
                            <svg className="ft-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                <circle cx="12" cy="9" r="2.5" />
                            </svg>
                            San José, Costa Rica
                        </a>
                    </div>

                    {/* Redes sociales */}
                    <div className="ft-socials">
                        <div className="ft-section-title">Síguenos</div>
                        <div className="ft-social-grid">
                            {socials.map(s => (
                                <a key={s.name} href={s.href} className="ft-social-btn">
                                    {s.icon}
                                    {s.name}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="ft-divider" />

                <div className="ft-bottom">
                    <p className="ft-copy">
                        © 2025 <span>TECHSTORE</span>. Todos los derechos reservados.
                    </p>
                    <div className="ft-legal">
                        <a href="#">Privacidad</a>
                        <a href="#">Términos</a>
                        <a href="#">Cookies</a>
                    </div>
                </div>
            </footer>
        </>
    );
}

export function Layout({ children }) {
    return (
        <div>
            {Navbar()}
            <main>{children}</main>
            {Footer()}
        </div>
    )
}

export function Home() {
    const [productos, setProductos] = useState([])
    const [loadingProductos, setLoadingProductos] = useState(true)
    const [heroRef, heroInView] = useInView(0.1)
    const [catsRef, catsInView] = useInView(0.1)
    const [prodsRef, prodsInView] = useInView(0.1)
    const [ctaRef, ctaInView] = useInView(0.1)
    const { agregarAlCarrito } = useCart()
    const { usuario } = useAuth()
    const navigate = useNavigate()
    const [heroProducto, setHeroProducto] = useState(null)
    const { t } = useTranslation()


    useEffect(() => {
        const cargar = async () => {
            try {
                const data = await productService.getAll()
                setProductos(data.slice(0, 4))
                setHeroProducto(data[0])

            } catch (e) {
                console.log('Error cargando productos:', e)
            } finally {
                setLoadingProductos(false)
            }
        }
        cargar()
    }, [])

    const handleAgregar = (e, producto) => {
        e.stopPropagation()
        if (!usuario) { navigate('/login'); return }
        agregarAlCarrito(producto)
        toast.success('¡Agregado al carrito!')
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Syne:wght@400;500;600;700&display=swap');

                .home {
                    min-height: 100vh;
                    background: var(--bg-deep);
                    font-family: 'Syne', sans-serif;
                    color: var(--text-primary);
                    overflow-x: hidden;
                }

                .fade-up {
                    opacity: 0;
                    transform: translateY(32px);
                    transition: opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1);
                }
                .fade-up.visible { opacity: 1; transform: translateY(0); }
                .fade-up.d1 { transition-delay: 0.05s; }
                .fade-up.d2 { transition-delay: 0.15s; }
                .fade-up.d3 { transition-delay: 0.25s; }
                .fade-up.d4 { transition-delay: 0.35s; }
                .fade-up.d5 { transition-delay: 0.45s; }
                .fade-up.d6 { transition-delay: 0.55s; }

                /* ══ HERO ══ */
                .hero {
                    position: relative;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    padding: 0 5%;
                    box-sizing: border-box;
                    overflow: hidden;
                }

                .hero-bg {
                    position: absolute; inset: 0;
                    background:
                        radial-gradient(ellipse 80% 60% at 20% 50%, rgba(124,58,237,0.18) 0%, transparent 60%),
                        radial-gradient(ellipse 50% 40% at 80% 80%, rgba(247,37,133,0.1) 0%, transparent 60%);
                }

                .hero-grid {
                    position: absolute; inset: 0;
                    background-image:
                        linear-gradient(rgba(124,58,237,0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(124,58,237,0.05) 1px, transparent 1px);
                    background-size: 50px 50px;
                    mask-image: radial-gradient(ellipse at 40% 50%, black 20%, transparent 70%);
                }

                .hero-orb-1 {
                    position: absolute; top: 10%; left: 5%;
                    width: 500px; height: 500px;
                    background: radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%);
                    border-radius: 50%;
                    animation: hfloat 9s ease-in-out infinite;
                    pointer-events: none;
                }

                .hero-orb-2 {
                    position: absolute; bottom: 5%; right: 2%;
                    width: 380px; height: 380px;
                    background: radial-gradient(circle, rgba(247,37,133,0.1) 0%, transparent 70%);
                    border-radius: 50%;
                    animation: hfloat 12s ease-in-out infinite reverse;
                    pointer-events: none;
                }

                @keyframes hfloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-28px); }
                }

                .hero-content {
                    position: relative; z-index: 1;
                    max-width: 640px;
                    padding-top: 80px;
                }

                .hero-eyebrow {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.6rem;
                    background: rgba(124,58,237,0.1);
                    border: 1px solid rgba(124,58,237,0.3);
                    border-radius: 100px;
                    padding: 0.35rem 1rem;
                    font-size: 0.68rem;
                    font-weight: 700;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #a78bfa;
                    margin-bottom: 1.75rem;
                }

                .hero-dot {
                    width: 6px; height: 6px;
                    background: #f72585;
                    border-radius: 50%;
                    box-shadow: 0 0 8px #f72585;
                    animation: blink 2s ease-in-out infinite;
                }

                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.2; }
                }

                .hero-title {
                    font-family: 'Orbitron', monospace;
                    font-weight: 900;
                    font-size: clamp(2.2rem, 5vw, 3.8rem);
                    line-height: 1.08;
                    letter-spacing: -0.02em;
                    margin: 0 0 1.5rem;
                }

                .hero-title-accent {
                    display: block;
                    background: linear-gradient(90deg, #a855f7, #f72585, #a855f7);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: shimmer 4s linear infinite;
                }

                @keyframes shimmer {
                    0% { background-position: 0% center; }
                    100% { background-position: 200% center; }
                }

                .hero-desc {
                    font-size: 1rem;
                    color: var(--text-secondary);
                    line-height: 1.75;
                    max-width: 480px;
                    margin-bottom: 2.5rem;
                }

                .hero-actions {
                    display: flex; gap: 1rem;
                    flex-wrap: wrap; margin-bottom: 3.5rem;
                }

                .btn-primary {
                    display: inline-flex; align-items: center; gap: 0.5rem;
                    padding: 0.9rem 2rem;
                    background: var(--gradient-button);
                    color: white; border: none; border-radius: 14px;
                    font-family: 'Syne', sans-serif;
                    font-size: 0.88rem; font-weight: 700; letter-spacing: 0.04em;
                    cursor: pointer; text-decoration: none;
                    box-shadow: 0 0 20px rgba(168,85,247,0.4);
                    transition: all 0.3s ease;
                    position: relative; overflow: hidden;
                }

                .btn-primary::after {
                    content: '';
                    position: absolute; inset: 0;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                    transform: translateX(-100%);
                    transition: transform 0.5s;
                }

                .btn-primary:hover::after { transform: translateX(100%); }
                .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 0 30px rgba(168,85,247,0.6); }

                .btn-secondary {
                    display: inline-flex; align-items: center; gap: 0.5rem;
                    padding: 0.9rem 2rem;
                    background: transparent; color: var(--text-primary);
                    border: 1px solid var(--border-subtle); border-radius: 14px;
                    font-family: 'Syne', sans-serif;
                    font-size: 0.88rem; font-weight: 600;
                    cursor: pointer; text-decoration: none;
                    transition: all 0.3s ease;
                }

                .btn-secondary:hover { border-color: var(--accent-violet); background: rgba(124,58,237,0.08); }

                .hero-stats {
                    display: flex; gap: 2.5rem;
                    padding-top: 2rem;
                    border-top: 1px solid var(--border-subtle);
                }

                .hero-stat-value {
                    font-family: 'Orbitron', monospace;
                    font-size: 1.5rem; font-weight: 700;
                    background: var(--gradient-hero);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
                    line-height: 1; margin-bottom: 0.3rem;
                }

                .hero-stat-label {
                    font-size: 0.68rem; color: var(--text-muted);
                    letter-spacing: 0.12em; text-transform: uppercase;
                }

                .hero-visual {
                    position: absolute; right: 4%; top: 50%;
                    transform: translateY(-50%);
                    z-index: 1; width: 400px;
                }

                .hero-card {
                    background: rgba(15,12,28,0.85);
                    border: 1px solid rgba(124,58,237,0.25);
                    border-radius: 24px; padding: 2rem;
                    backdrop-filter: blur(20px);
                    box-shadow: 0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.1);
                    position: relative; overflow: hidden;
                }

                .hero-card::before {
                    content: '';
                    position: absolute; top: 0; left: 0; right: 0; height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(168,85,247,0.8), transparent);
                }

                .hero-card-tag {
                    position: absolute;
                    background: rgba(15,12,28,0.9);
                    border: 1px solid rgba(124,58,237,0.3);
                    border-radius: 10px; padding: 0.45rem 0.8rem;
                    font-size: 0.7rem; font-weight: 600; color: var(--text-secondary);
                    backdrop-filter: blur(8px); white-space: nowrap;
                    display: flex; align-items: center; gap: 0.35rem;
                }

                .hero-card-tag-1 { top: -14px; left: -14px; animation: hfloat 5s 1s ease-in-out infinite; }
                .hero-card-tag-2 { bottom: 24px; right: -14px; animation: hfloat 6s 0.5s ease-in-out infinite reverse; }

                .hero-card-emoji {
                    font-size: 5rem; display: block; text-align: center;
                    margin-bottom: 1.25rem; animation: hfloat 4s ease-in-out infinite;
                    filter: drop-shadow(0 0 24px rgba(168,85,247,0.5));
                }

                .hero-card-name {
                    font-family: 'Orbitron', monospace; font-size: 0.85rem;
                    color: var(--text-primary); text-align: center;
                    margin-bottom: 0.3rem; font-weight: 600;
                }

                .hero-card-price {
                    font-family: 'Orbitron', monospace; font-size: 1.5rem; font-weight: 700;
                    background: var(--gradient-hero);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
                    text-align: center; margin-bottom: 1.25rem;
                }

                .hero-card-btn {
                    width: 100%; padding: 0.75rem;
                    background: var(--gradient-button); border: none; border-radius: 12px;
                    color: white; font-family: 'Syne', sans-serif;
                    font-weight: 700; font-size: 0.85rem; cursor: pointer;
                    transition: all 0.25s;
                    box-shadow: 0 0 16px rgba(168,85,247,0.3);
                }

                .hero-card-btn:hover { box-shadow: 0 0 24px rgba(168,85,247,0.6); transform: translateY(-2px); }

                /* ══ SECCIONES ══ */
                .section { padding: 6rem 5%; box-sizing: border-box; }

                .section-head {
                    display: flex; align-items: flex-end;
                    justify-content: space-between;
                    margin-bottom: 2.5rem; flex-wrap: wrap; gap: 1rem;
                }

                .section-label {
                    font-size: 0.62rem; letter-spacing: 0.22em;
                    text-transform: uppercase; color: var(--accent-violet);
                    font-weight: 700; margin-bottom: 0.4rem;
                }

                .section-title {
                    font-family: 'Orbitron', monospace;
                    font-size: clamp(1.3rem, 2.5vw, 1.9rem);
                    font-weight: 700; line-height: 1.2;
                }

                .section-link {
                    font-size: 0.78rem; color: var(--accent-violet);
                    text-decoration: none; font-weight: 700; letter-spacing: 0.04em;
                    display: flex; align-items: center; gap: 0.35rem;
                    transition: gap 0.2s; white-space: nowrap;
                }

                .section-link:hover { gap: 0.65rem; }

                /* ══ CATEGORÍAS ══ */
                .cats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 1rem;
                }

                .cat-card {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: 18px; padding: 1.5rem;
                    cursor: pointer; text-decoration: none;
                    display: flex; flex-direction: column; gap: 0.5rem;
                    transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
                    position: relative; overflow: hidden;
                }

                .cat-card::after {
                    content: '';
                    position: absolute; inset: 0;
                    background: linear-gradient(135deg, rgba(124,58,237,0.08), rgba(247,37,133,0.04));
                    opacity: 0; transition: opacity 0.3s;
                }

                .cat-card:hover {
                    border-color: var(--border-accent);
                    transform: translateY(-6px);
                    box-shadow: 0 16px 40px rgba(0,0,0,0.3), var(--glow-soft);
                }

                .cat-card:hover::after { opacity: 1; }

                .cat-icon {
                    font-size: 2.2rem; margin-bottom: 0.25rem;
                    position: relative; z-index: 1;
                    transition: transform 0.3s;
                }

                .cat-card:hover .cat-icon { transform: scale(1.15); }

                .cat-name {
                    font-family: 'Orbitron', monospace; font-size: 0.82rem;
                    font-weight: 600; color: var(--text-primary);
                    position: relative; z-index: 1;
                }

                .cat-desc {
                    font-size: 0.73rem; color: var(--text-muted);
                    line-height: 1.4; position: relative; z-index: 1;
                }

                /* ══ PRODUCTOS ══ */
                .products-section {
                    padding: 6rem 5%;
                    background: linear-gradient(180deg, var(--bg-deep) 0%, rgba(124,58,237,0.04) 50%, var(--bg-deep) 100%);
                    box-sizing: border-box; position: relative;
                }

                .products-section::before {
                    content: '';
                    position: absolute; top: 0; left: 0; right: 0; height: 1px;
                    background: linear-gradient(90deg, transparent, var(--border-subtle), transparent);
                }

                .products-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
                    gap: 1.25rem;
                }

                .product-card {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: 20px; overflow: hidden;
                    cursor: pointer; display: flex; flex-direction: column;
                    transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
                }

                .product-card:hover {
                    border-color: var(--border-accent);
                    transform: translateY(-8px);
                    box-shadow: 0 24px 60px rgba(0,0,0,0.4), var(--glow-soft);
                }

                .product-img {
                    width: 100%; height: 200px;
                    background: linear-gradient(135deg, rgba(124,58,237,0.1), rgba(247,37,133,0.06));
                    display: flex; align-items: center; justify-content: center;
                    font-size: 4.5rem; position: relative; overflow: hidden; flex-shrink: 0;
                }

                .product-img img {
                    width: 100%; height: 100%;
                    object-fit: contain; padding: 0.75rem;
                    box-sizing: border-box; transition: transform 0.4s ease;
                }

                .product-card:hover .product-img img { transform: scale(1.05); }

                .product-badge {
                    position: absolute; top: 12px; left: 12px;
                    background: var(--gradient-hero); color: white;
                    font-size: 0.58rem; font-weight: 700;
                    text-transform: uppercase; letter-spacing: 0.08em;
                    padding: 0.25rem 0.6rem; border-radius: 100px; z-index: 1;
                }

                .product-info {
                    padding: 1.25rem; display: flex;
                    flex-direction: column; gap: 0.4rem; flex: 1;
                }

                .product-cat {
                    font-size: 0.6rem; color: var(--accent-violet);
                    font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
                }

                .product-name {
                    font-family: 'Orbitron', monospace; font-size: 0.85rem;
                    font-weight: 600; color: var(--text-primary); line-height: 1.3;
                }

                .product-rating {
                    display: flex; align-items: center; gap: 0.4rem;
                    font-size: 0.72rem; color: var(--text-muted);
                }

                .product-stars { color: #f59e0b; }

                .product-footer {
                    display: flex; align-items: center;
                    justify-content: space-between; margin-top: 0.5rem;
                }

                .product-price {
                    font-family: 'Orbitron', monospace; font-size: 1.05rem; font-weight: 700;
                    background: var(--gradient-hero);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
                }

                .product-add {
                    background: rgba(124,58,237,0.14);
                    border: 1px solid var(--border-accent);
                    border-radius: 9px; padding: 0.38rem 0.8rem;
                    color: var(--accent-violet); font-family: 'Syne', sans-serif;
                    font-size: 0.72rem; font-weight: 700; cursor: pointer;
                    transition: all 0.25s;
                }

                .product-add:hover {
                    background: var(--gradient-button); color: white;
                    border-color: transparent; box-shadow: var(--glow-purple);
                }

                /* Skeleton */
                .skeleton {
                    background: linear-gradient(90deg, var(--bg-surface) 25%, var(--bg-elevated) 50%, var(--bg-surface) 75%);
                    background-size: 200% 100%;
                    animation: skel 1.5s infinite;
                    border-radius: 12px;
                }

                @keyframes skel {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }

                /* ══ CTA ══ */
                .cta-section { padding: 6rem 5%; box-sizing: border-box; }

                .cta-card {
                    background: linear-gradient(135deg, rgba(124,58,237,0.15), rgba(247,37,133,0.08));
                    border: 1px solid rgba(124,58,237,0.25);
                    border-radius: 28px; padding: 4rem;
                    text-align: center; position: relative; overflow: hidden;
                }

                .cta-card::before {
                    content: '';
                    position: absolute; top: 0; left: 0; right: 0; height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(168,85,247,0.6), transparent);
                }

                .cta-orb {
                    position: absolute; border-radius: 50%; pointer-events: none;
                }

                .cta-orb-1 {
                    width: 300px; height: 300px;
                    background: radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%);
                    top: -100px; left: -100px;
                }

                .cta-orb-2 {
                    width: 250px; height: 250px;
                    background: radial-gradient(circle, rgba(247,37,133,0.1), transparent 70%);
                    bottom: -80px; right: -80px;
                }

                .cta-title {
                    font-family: 'Orbitron', monospace;
                    font-size: clamp(1.5rem, 3vw, 2.2rem); font-weight: 700;
                    margin-bottom: 1rem; position: relative; z-index: 1;
                }

                .cta-desc {
                    font-size: 0.92rem; color: var(--text-secondary);
                    margin-bottom: 2rem; max-width: 480px;
                    margin-left: auto; margin-right: auto;
                    line-height: 1.7; position: relative; z-index: 1;
                }

                @media (max-width: 960px) {
                    .hero-visual { display: none; }
                    .hero-content { max-width: 100%; }
                }

                @media (max-width: 600px) {
                    .hero-stats { gap: 1.5rem; }
                    .hero-actions { flex-direction: column; }
                    .cta-card { padding: 2.5rem 1.5rem; }
                }
            `}</style>

            <div className="home">

                {/* HERO */}
                <section className="hero" ref={heroRef}>
                    <div className="hero-bg" />
                    <div className="hero-grid" />
                    <div className="hero-orb-1" />
                    <div className="hero-orb-2" />

                    <div className="hero-content">
                        <div className={`fade-up d1 ${heroInView ? 'visible' : ''}`}>
                            <div className="hero-eyebrow">
                                <span className="hero-dot" />
                                {t('heroEyebrow')}
                            </div>
                        </div>
                        <div className={`fade-up d2 ${heroInView ? 'visible' : ''}`}>
                            <h1 className="hero-title">
                                {t('heroTitulo1')}
                                <span className="hero-title-accent">{t('heroTitulo2')}</span>
                            </h1>
                        </div>
                        <div className={`fade-up d3 ${heroInView ? 'visible' : ''}`}>
                            <p className="hero-desc">{t('heroDesc')}</p>
                        </div>
                        <div className={`fade-up d4 ${heroInView ? 'visible' : ''}`}>
                            <div className="hero-actions">
                                <a href="/catalogo" className="btn-primary">{t('explorarCatalogo')}</a>
                                <a href="/catalogo" className="btn-secondary">{t('verOfertas')}</a>
                            </div>
                        </div>
                        <div className={`fade-up d5 ${heroInView ? 'visible' : ''}`}>
                            <div className="hero-stats">
                                <div>
                                    <div className="hero-stat-value">+250</div>
                                    <div className="hero-stat-label">{t('productos')}</div>
                                </div>
                                <div>
                                    <div className="hero-stat-value">48h</div>
                                    <div className="hero-stat-label">{t('envioExpress')}</div>
                                </div>
                                <div>
                                    <div className="hero-stat-value">4.9★</div>
                                    <div className="hero-stat-label">{t('valoracion')}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`hero-visual fade-up d3 ${heroInView ? 'visible' : ''}`}>
                        <div className="hero-card">
                            <div className="hero-card-tag hero-card-tag-1">⚡ {t('envioExpress')}</div>
                            <div className="hero-card-tag hero-card-tag-2">🔒 {t('pagoSeguro')}</div>
                            {heroProducto ? (
                                <>
                                    {heroProducto.imagen_url
                                        ? <img src={heroProducto.imagen_url} alt={heroProducto.nombre}
                                            style={{ width: '100%', height: '160px', objectFit: 'contain', marginBottom: '1rem' }} />
                                        : <span className="hero-card-emoji">💻</span>
                                    }
                                    <div className="hero-card-name">{heroProducto.nombre}</div>
                                    <div className="hero-card-price">₡{Number(heroProducto.precio).toLocaleString()}</div>
                                </>
                            ) : (
                                <>
                                    <span className="hero-card-emoji">💻</span>
                                    <div className="hero-card-name">{t('cargando')}</div>
                                    <div className="hero-card-price">—</div>
                                </>
                            )}
                            <button className="hero-card-btn" onClick={() => heroProducto && navigate(`/producto/${heroProducto.id}`)}>
                                {t('verProducto')}
                            </button>
                        </div>
                    </div>
                </section>

                {/* CATEGORÍAS */}
                <section className="section" ref={catsRef}>
                    <div className="section-head">
                        <div>
                            <div className={`fade-up d1 ${catsInView ? 'visible' : ''}`}>
                                <div className="section-label">{t('explorar')}</div>
                            </div>
                            <div className={`fade-up d2 ${catsInView ? 'visible' : ''}`}>
                                <h2 className="section-title">{t('categorias')}</h2>
                            </div>
                        </div>
                        <div className={`fade-up d2 ${catsInView ? 'visible' : ''}`}>
                            <a href="/catalogo" className="section-link">{t('verTodas')}</a>
                        </div>
                    </div>
                    <div className="cats-grid">
                        {CATEGORIES.map((cat, i) => (
                            <a key={cat.name} href="/catalogo"
                                className={`cat-card fade-up d${Math.min(i + 1, 6)} ${catsInView ? 'visible' : ''}`}
                            >
                                <div className="cat-icon">{cat.icon}</div>
                                <div className="cat-name">{cat.name}</div>
                                <div className="cat-desc">{cat.desc}</div>
                            </a>
                        ))}
                    </div>
                </section>

                {/* PRODUCTOS */}
                <section className="products-section" ref={prodsRef}>
                    <div className="section-head">
                        <div>
                            <div className={`fade-up d1 ${prodsInView ? 'visible' : ''}`}>
                                <div className="section-label">{t('loMasVendido')}</div>
                            </div>
                            <div className={`fade-up d2 ${prodsInView ? 'visible' : ''}`}>
                                <h2 className="section-title">{t('productosDestacados')}</h2>
                            </div>
                        </div>
                        <div className={`fade-up d2 ${prodsInView ? 'visible' : ''}`}>
                            <a href="/catalogo" className="section-link">{t('verCatalogo')}</a>
                        </div>
                    </div>
                    <div className="products-grid">
                        {loadingProductos ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                                    <div className="skeleton" style={{ height: '200px' }} />
                                    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                        <div className="skeleton" style={{ height: '12px', width: '40%' }} />
                                        <div className="skeleton" style={{ height: '16px', width: '80%' }} />
                                        <div className="skeleton" style={{ height: '12px', width: '60%' }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                                            <div className="skeleton" style={{ height: '20px', width: '35%' }} />
                                            <div className="skeleton" style={{ height: '30px', width: '30%', borderRadius: '8px' }} />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : productos.map((p, i) => (
                            <div key={p.id}
                                className={`product-card fade-up d${Math.min(i + 1, 6)} ${prodsInView ? 'visible' : ''}`}
                                onClick={() => navigate(`/producto/${p.id}`)}
                            >
                                <div className="product-img">
                                    {p.imagen_url ? <img src={p.imagen_url} alt={p.nombre} /> : <span>{p.emoji}</span>}
                                    {p.badge && <span className="product-badge">{p.badge}</span>}
                                </div>
                                <div className="product-info">
                                    <div className="product-cat">{p.categoria}</div>
                                    <div className="product-name">{p.nombre}</div>
                                    <div className="product-footer">
                                        <div className="product-price">₡{Number(p.precio).toLocaleString()}</div>
                                        <button className="product-add" onClick={(e) => handleAgregar(e, p)}>
                                            + {t('carrito')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="cta-section" ref={ctaRef}>
                    <div className={`cta-card fade-up d1 ${ctaInView ? 'visible' : ''}`}>
                        <div className="cta-orb cta-orb-1" />
                        <div className="cta-orb cta-orb-2" />
                        <h2 className="cta-title">{t('ctaTitulo')}</h2>
                        <p className="cta-desc">{t('ctaDesc')}</p>
                        <a href="/catalogo" className="btn-primary" style={{ display: 'inline-flex', position: 'relative', zIndex: 1 }}>
                            {t('explorarCatalogo')}
                        </a>
                    </div>
                </section>

            </div>
        </>
    )
}
