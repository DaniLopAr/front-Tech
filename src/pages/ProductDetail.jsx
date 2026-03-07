import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { productService } from "../services/productService";
import { Loader } from '../Components/Loader'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'






export function ProductDetail() {
    const { id } = useParams()
    const [producto, setProducto] = useState(null)
    const [loading, setLoading] = useState(true)
    const [quantity, setQuantity] = useState(1)
    const [added, setAdded] = useState(false)
    const [activeTab, setActiveTab] = useState("desc")
    const { agregarAlCarrito } = useCart()
    const { usuario } = useAuth()
    const navigate = useNavigate()
    const { t } = useTranslation()


    const handleAgregar = () => {
        if (!usuario) {
            navigate('/login')
            return
        }
        // Agregar una vez por cada unidad seleccionada
        for (let i = 0; i < quantity; i++) {
            agregarAlCarrito(producto)
        }
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
        toast.success('¡Producto agregado al carrito!')
    }

    useEffect(() => {
        const cargarProducto = async () => {
            try {
                console.log('ID del producto:', id)  // ← agrega esto

                const data = await productService.getById(id)
                setProducto(data)
            } catch (error) {
                console.log('Error cargando producto:', error)
            } finally {
                setLoading(false)
            }
        }
        cargarProducto()
    }, [id])

    if (loading) return <Loader />

    if (!producto) return <div style={{ color: 'white', padding: '100px', textAlign: 'center' }}>Producto no encontrado</div>


    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} style={{ color: i < Math.round(rating) ? "#f59e0b" : "var(--border-subtle)" }}>★</span>
        ));
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700&family=Syne:wght@400;500;600&display=swap');

                .pd-root {
                    min-height: 100vh;
                    background: var(--bg-deep);
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;
                    color: var(--text-primary);
                    padding: 100px 5% 5rem;
                    box-sizing: border-box;
                }

                /* Breadcrumb */
                .pd-breadcrumb {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    margin-bottom: 2rem;
                }

                .pd-breadcrumb a {
                    color: var(--text-muted);
                    text-decoration: none;
                    transition: color 0.2s;
                }

                .pd-breadcrumb a:hover { color: var(--accent-violet); }
                .pd-breadcrumb-sep { opacity: 0.4; }
                .pd-breadcrumb-current { color: var(--text-secondary); }

                /* Layout principal */
                .pd-layout {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 3rem;
                    margin-bottom: 4rem;
                }

                /* ── LADO IZQUIERDO — Imagen ── */
                .pd-image-wrap {
                    position: relative;
                }

                .pd-image-main {
                    background: linear-gradient(135deg, rgba(124,58,237,0.1), rgba(247,37,133,0.06));
                    border: 1px solid var(--border-subtle);
                    border-radius: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 380px;
                    position: relative;
                    overflow: hidden;
                }

                .pd-image-main::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at 50% 50%, rgba(124,58,237,0.15), transparent 70%);
                }

                .pd-emoji {
                    font-size: 9rem;
                    filter: drop-shadow(0 0 40px rgba(168,85,247,0.4));
                    animation: pd-float 4s ease-in-out infinite;
                    position: relative;
                    z-index: 1;
                }

                @keyframes pd-float {
                    0%, 100% { transform: translateY(0); }
                    50%       { transform: translateY(-12px); }
                }

                .pd-badge {
                    position: absolute;
                    top: 16px; left: 16px;
                    background: var(--gradient-hero);
                    color: white;
                    font-size: 0.65rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    padding: 0.3rem 0.75rem;
                    border-radius: 100px;
                    z-index: 2;
                }

                /* ── LADO DERECHO — Info ── */
                .pd-info {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }

                .pd-category {
                    font-size: 0.65rem;
                    color: var(--accent-violet);
                    font-weight: 600;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                }

                .pd-name {
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;, monospace;
                    font-size: clamp(1.4rem, 2.5vw, 2rem);
                    font-weight: 700;
                    line-height: 1.2;
                }

                /* Rating */
                .pd-rating {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .pd-stars { font-size: 1.1rem; letter-spacing: 1px; }

                .pd-rating-value {
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;, monospace;
                    font-size: 0.9rem;
                    font-weight: 700;
                    color: var(--text-primary);
                }

                .pd-rating-count {
                    font-size: 0.78rem;
                    color: var(--text-muted);
                }

                /* Precio */
                .pd-price {
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;, monospace;
                    font-size: 2.2rem;
                    font-weight: 700;
                    background: var(--gradient-hero);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    line-height: 1;
                }

                .pd-divider {
                    height: 1px;
                    background: var(--border-subtle);
                }

                /* Tabs descripción / specs */
                .pd-tabs {
                    display: flex;
                    gap: 0;
                    border-bottom: 1px solid var(--border-subtle);
                }

                .pd-tab {
                    padding: 0.6rem 1.2rem;
                    background: transparent;
                    border: none;
                    border-bottom: 2px solid transparent;
                    color: var(--text-muted);
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;
                    font-size: 0.78rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    margin-bottom: -1px;
                }

                .pd-tab.active {
                    color: var(--accent-violet);
                    border-bottom-color: var(--accent-violet);
                }

                .pd-tab-content {
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    line-height: 1.7;
                    animation: pd-fade 0.25s ease;
                }

                @keyframes pd-fade {
                    from { opacity: 0; transform: translateY(4px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                /* Specs tabla */
                .pd-specs {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .pd-spec-row {
                    display: flex;
                    gap: 1rem;
                    font-size: 0.82rem;
                    padding: 0.5rem 0;
                    border-bottom: 1px solid var(--border-subtle);
                }

                .pd-spec-label {
                    color: var(--text-muted);
                    min-width: 130px;
                    flex-shrink: 0;
                }

                .pd-spec-value {
                    color: var(--text-primary);
                    font-weight: 600;
                }

                /* Cantidad + carrito */
                .pd-actions {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                    flex-wrap: wrap;
                }

                .pd-qty {
                    display: flex;
                    align-items: center;
                    background: var(--bg-elevated);
                    border: 1px solid var(--border-subtle);
                    border-radius: 12px;
                    overflow: hidden;
                }

                .pd-qty-btn {
                    width: 42px; height: 42px;
                    background: transparent;
                    border: none;
                    color: var(--text-secondary);
                    font-size: 1.2rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .pd-qty-btn:hover {
                    background: rgba(124,58,237,0.15);
                    color: var(--accent-violet);
                }

                .pd-qty-num {
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;, monospace;
                    font-size: 0.9rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    min-width: 40px;
                    text-align: center;
                }

                .pd-add-btn {
                    flex: 1;
                    padding: 0.75rem 1.5rem;
                    background: var(--gradient-button);
                    border: none;
                    border-radius: 12px;
                    color: white;
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;
                    font-size: 0.9rem;
                    font-weight: 700;
                    cursor: pointer;
                    letter-spacing: 0.04em;
                    box-shadow: var(--glow-purple);
                    transition: all 0.3s;
                    min-width: 180px;
                }

                .pd-add-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 0 20px #a855f7cc;
                }

                .pd-add-btn.added {
                    background: linear-gradient(90deg, #22c55e, #16a34a);
                    box-shadow: 0 0 12px rgba(34,197,94,0.5);
                }

                /* Stock */
                .pd-stock {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.75rem;
                    color: #22c55e;
                    font-weight: 600;
                }

                .pd-stock-dot {
                    width: 7px; height: 7px;
                    background: #22c55e;
                    border-radius: 50%;
                    box-shadow: 0 0 6px #22c55eaa;
                    animation: blink 2s infinite;
                }

                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0.3; }
                }

                /* ── REVIEWS ── */
                .pd-reviews-section {
                    border-top: 1px solid var(--border-subtle);
                    padding-top: 3rem;
                }

                .pd-reviews-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .pd-reviews-title {
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;, monospace;
                    font-size: 1.1rem;
                    font-weight: 700;
                }

                .pd-reviews-summary {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .pd-reviews-avg {
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;, monospace;
                    font-size: 2rem;
                    font-weight: 700;
                    background: var(--gradient-hero);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .pd-reviews-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 1rem;
                }

                .pd-review-card {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: 16px;
                    padding: 1.25rem;
                    transition: border-color 0.25s;
                }

                .pd-review-card:hover { border-color: var(--border-accent); }

                .pd-review-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 0.6rem;
                }

                .pd-review-user {
                    font-weight: 600;
                    font-size: 0.85rem;
                    color: var(--text-primary);
                }

                .pd-review-date {
                    font-size: 0.7rem;
                    color: var(--text-muted);
                }

                .pd-review-stars { font-size: 0.9rem; margin-bottom: 0.6rem; }

                .pd-review-comment {
                    font-size: 0.82rem;
                    color: var(--text-secondary);
                    line-height: 1.6;
                }

                @media (max-width: 768px) {
                    .pd-layout { grid-template-columns: 1fr; gap: 2rem; }
                    .pd-emoji { font-size: 6rem; }
                    .pd-image-main { min-height: 260px; }
                }
            `}</style>

            <div className="pd-root">

                {/* Breadcrumb */}
                <div className="pd-breadcrumb">
                    <a href="/">{t('inicio')}</a>
                    <span className="pd-breadcrumb-sep">›</span>
                    <a href="/catalogo">{t('catalogo')}</a>
                    <span className="pd-breadcrumb-sep">›</span>
                    <span className="pd-breadcrumb-current">{producto.nombre}</span>
                </div>

                {/* Layout */}
                <div className="pd-layout">

                    {/* Imagen */}
                    <div className="pd-image-wrap">
                        <div className="pd-image-main">
                            {producto.badge && <span className="pd-badge">{producto.badge}</span>}
                            {producto.imagen_url
                                ? <img src={producto.imagen_url} alt={producto.nombre}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1rem', boxSizing: 'border-box' }} />
                                : <span className="pd-emoji">{producto.emoji}</span>
                            }
                        </div>
                    </div>

                    {/* Info */}
                    <div className="pd-info">
                        <div className="pd-category">{producto.categoria}</div>
                        <h1 className="pd-name">{producto.nombre}</h1>

                        <div className="pd-rating">
                            <div className="pd-stars">{renderStars(producto.rating)}</div>
                            <span className="pd-rating-value">{producto.rating}</span>
                            <span className="pd-rating-count">({producto.reviews} {t('resenas')})</span>
                        </div>

                        <div className="pd-price">₡{producto.precio.toLocaleString()}</div>

                        <div className="pd-divider" />

                        {/* Tabs */}
                        <div className="pd-tabs">
                            <button
                                className={`pd-tab ${activeTab === "desc" ? "active" : ""}`}
                                onClick={() => setActiveTab("desc")}
                            >{t('descripcion')}</button>
                            <button
                                className={`pd-tab ${activeTab === "specs" ? "active" : ""}`}
                                onClick={() => setActiveTab("specs")}
                            >{t('especificaciones')}</button>
                        </div>

                        {activeTab === "desc" ? (
                            <p className="pd-tab-content">{producto.descripcion}</p>
                        ) : (
                            <div className="pd-specs pd-tab-content">
                                {producto.especificaciones?.map(s => (
                                    <div key={s.label} className="pd-spec-row">
                                        <span className="pd-spec-label">{s.label}</span>
                                        <span className="pd-spec-value">{s.value}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="pd-divider" />

                        {/* Stock */}
                        <div className="pd-stock">
                            <div className="pd-stock-dot" />
                            {t('enStock')}
                        </div>

                        {/* Cantidad + botón */}
                        <div className="pd-actions">
                            <div className="pd-qty">
                                <button className="pd-qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                                <span className="pd-qty-num">{quantity}</span>
                                <button className="pd-qty-btn" onClick={() => setQuantity(q => q + 1)}>+</button>
                            </div>
                            <button
                                className={`pd-add-btn ${added ? "added" : ""}`}
                                onClick={handleAgregar}
                            >
                                {added ? `✓ ${t('agregado')}` : `🛒 ${t('agregarAlCarrito')}`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}