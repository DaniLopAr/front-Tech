import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'


export function Carrito() {
    const { items, eliminarDelCarrito, actualizarCantidad, total } = useCart()


    const { usuario } = useAuth()
    const navigate = useNavigate()
    const [removingId, setRemovingId] = useState(null)

    const { t } = useTranslation()


    const shipping = total > 2000 ? 0 : 15
    const totalFinal = total + shipping

    const handleRemove = (id) => {
        setRemovingId(id)
        setTimeout(() => {
            eliminarDelCarrito(id)
            setRemovingId(null)
        }, 400)
    }

    return (
        <>
            <style>{`
                .cart {
                    min-height: 100vh;
                    background: var(--bg-deep);
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;
                    color: var(--text-primary);
                    padding: 110px 5% 6rem;
                    box-sizing: border-box;
                }

                /* HEADER */
                .cart-header {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    margin-bottom: 3rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 1px solid var(--border-subtle);
                    position: relative;
                }

                .cart-header::after {
                    content: '';
                    position: absolute;
                    bottom: -1px; left: 0;
                    width: 80px; height: 2px;
                    background: var(--gradient-hero);
                }

                .cart-eyebrow {
                    font-size: 0.62rem;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    color: var(--accent-violet);
                    font-weight: 600;
                    margin-bottom: 0.4rem;
                }

                .cart-title {
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;, monospace;
                    font-size: clamp(1.8rem, 3vw, 2.5rem);
                    font-weight: 700;
                    letter-spacing: -0.02em;
                    line-height: 1;
                }

                .cart-title-count {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;
                    font-weight: 400;
                    letter-spacing: 0;
                    margin-left: 0.75rem;
                }

                /* LAYOUT */
                .cart-layout {
                    display: grid;
                    grid-template-columns: 1fr 360px;
                    gap: 2.5rem;
                    align-items: start;
                }

                /* ITEMS */
                .cart-items { display: flex; flex-direction: column; gap: 0; }

                /* ITEM */
                .cart-item {
                    display: grid;
                    grid-template-columns: 90px 1fr auto;
                    gap: 1.5rem;
                    align-items: center;
                    padding: 1.5rem 0;
                    border-bottom: 1px solid var(--border-subtle);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow: hidden;
                }

                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(-20px); }
                    to   { opacity: 1; transform: translateX(0); }
                }

                .cart-item.removing {
                    opacity: 0;
                    transform: translateX(30px) scale(0.95);
                    max-height: 0;
                    padding: 0;
                    border: none;
                }

                .cart-item-img {
                    width: 90px; height: 90px;
                    border-radius: 14px;
                    overflow: hidden;
                    background: linear-gradient(135deg, rgba(124,58,237,0.12), rgba(247,37,133,0.06));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.2rem;
                    flex-shrink: 0;
                }

                .cart-item-img img {
                    width: 100%; height: 100%;
                    object-fit: contain;
                    padding: 0.4rem;
                    box-sizing: border-box;
                }

                .cart-item-info { min-width: 0; }

                .cart-item-cat {
                    font-size: 0.6rem;
                    color: var(--accent-violet);
                    font-weight: 700;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    margin-bottom: 0.3rem;
                }

                .cart-item-name {
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;, monospace;
                    font-size: 0.88rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: 0.6rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .cart-item-price {
                    font-size: 0.82rem;
                    color: var(--text-muted);
                }

                .cart-item-price strong {
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;, monospace;
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                }

                .cart-item-controls {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 0.75rem;
                }

                .cart-item-subtotal {
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;, monospace;
                    font-size: 1rem;
                    font-weight: 700;
                    background: var(--gradient-hero);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .cart-qty {
                    display: flex;
                    align-items: center;
                    border: 1px solid var(--border-subtle);
                    border-radius: 10px;
                    overflow: hidden;
                    background: var(--bg-elevated);
                }

                .cart-qty-btn {
                    width: 32px; height: 32px;
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .cart-qty-btn:hover {
                    background: rgba(124,58,237,0.2);
                    color: var(--accent-violet);
                }

                .cart-qty-num {
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;, monospace;
                    font-size: 0.78rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    min-width: 28px;
                    text-align: center;
                }

                .cart-remove {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    font-size: 0.7rem;
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;
                    cursor: pointer;
                    padding: 0;
                    transition: color 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                }

                .cart-remove:hover { color: #f72585; }

                /* RESUMEN */
                .cart-summary {
                    position: sticky;
                    top: 90px;
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: 20px;
                    overflow: hidden;
                }

                .cart-summary-top {
                    padding: 1.75rem;
                    border-bottom: 1px solid var(--border-subtle);
                }

                .cart-summary-title {
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;, monospace;
                    font-size: 0.82rem;
                    font-weight: 700;
                    letter-spacing: 0.08em;
                    color: var(--text-primary);
                    margin-bottom: 1.5rem;
                    text-transform: uppercase;
                }

                .cart-summary-row {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    margin-bottom: 0.6rem;
                }

                .cart-summary-row.highlight { color: #22c55e; font-weight: 600; }

                .cart-summary-total-wrap {
                    padding: 1.75rem;
                    border-bottom: 1px solid var(--border-subtle);
                }

                .cart-summary-total {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .cart-summary-total-label {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    font-weight: 600;
                }

                .cart-summary-total-value {
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;, monospace;
                    font-size: 1.6rem;
                    font-weight: 700;
                    background: var(--gradient-hero);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .cart-summary-actions {
                    padding: 1.75rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .cart-shipping-note {
                    background: rgba(34,197,94,0.08);
                    border: 1px solid rgba(34,197,94,0.2);
                    border-radius: 10px;
                    padding: 0.6rem 0.9rem;
                    font-size: 0.72rem;
                    color: #22c55e;
                    font-weight: 600;
                    text-align: center;
                    margin-top: 0.5rem;
                }

                .cart-checkout {
                    width: 100%;
                    padding: 0.9rem;
                    background: var(--gradient-button);
                    border: none;
                    border-radius: 12px;
                    color: white;
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;
                    font-size: 0.88rem;
                    font-weight: 700;
                    cursor: pointer;
                    letter-spacing: 0.05em;
                    box-shadow: var(--glow-purple);
                    transition: all 0.3s;
                    position: relative;
                    overflow: hidden;
                }

                .cart-checkout::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
                    transform: translateX(-100%);
                    transition: transform 0.5s;
                }

                .cart-checkout:hover::after { transform: translateX(100%); }
                .cart-checkout:hover { transform: translateY(-2px); box-shadow: 0 0 28px #a855f7cc; }

                .cart-continue {
                    width: 100%;
                    padding: 0.75rem;
                    background: transparent;
                    border: 1px solid var(--border-subtle);
                    border-radius: 12px;
                    color: var(--text-muted);
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;
                    font-size: 0.82rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.25s;
                    text-align: center;
                    text-decoration: none;
                    display: block;
                    box-sizing: border-box;
                }

                .cart-continue:hover { border-color: var(--accent-violet); color: var(--text-primary); }

                /* VACÍO */
                .cart-empty {
                    min-height: 60vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 1rem;
                    animation: fadeUp 0.5s ease;
                }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                .cart-empty-icon {
                    font-size: 4rem;
                    animation: float 3s ease-in-out infinite;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50%      { transform: translateY(-12px); }
                }

                .cart-empty-title {
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;, monospace;
                    font-size: 1.1rem;
                    color: var(--text-secondary);
                }

                .cart-empty-desc { font-size: 0.85rem; color: var(--text-muted); }

                .cart-empty-btn {
                    margin-top: 0.5rem;
                    padding: 0.8rem 2rem;
                    background: var(--gradient-button);
                    border: none;
                    border-radius: 12px;
                    color: white;
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;
                    font-size: 0.88rem;
                    font-weight: 700;
                    cursor: pointer;
                    box-shadow: var(--glow-purple);
                    transition: all 0.3s;
                    text-decoration: none;
                    display: inline-block;
                }

                .cart-empty-btn:hover { transform: translateY(-2px); box-shadow: 0 0 24px #a855f7cc; }

                @media (max-width: 900px) {
                    .cart-layout { grid-template-columns: 1fr; }
                    .cart-summary { position: static; }
                }

                @media (max-width: 500px) {
                    .cart-item { grid-template-columns: 70px 1fr; }
                    .cart-item-controls {
                        grid-column: 1 / -1;
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center;
                    }
                }
            `}</style>

            <div className="cart">
                <div className="cart-header">
                    <div>
                        <div className="cart-eyebrow">{t('miCompra')}</div>
                        <h1 className="cart-title">
                            {t('carrito')}
                            <span className="cart-title-count">
                                {items.length} {items.length === 1 ? t('producto') : t('productos')}
                            </span>
                        </h1>
                    </div>
                </div>

                {items.length === 0 ? (
                    <div className="cart-empty">
                        <div className="cart-empty-icon">🛒</div>
                        <div className="cart-empty-title">{t('carritoVacio')}</div>
                        <p className="cart-empty-desc">{t('agregaProductos')}</p>
                        <button onClick={() => navigate('/catalogo')} className="cart-empty-btn">{t('verCatalogo')}</button>
                    </div>
                ) : (
                    <div className="cart-layout">
                        <div className="cart-items">
                            {items.map(item => (
                                <div key={item.id} className={`cart-item ${removingId === item.id ? 'removing' : ''}`}>
                                    <div className="cart-item-img">
                                        {item.imagen_url
                                            ? <img src={item.imagen_url} alt={item.nombre} />
                                            : <span>{item.emoji}</span>
                                        }
                                    </div>
                                    <div className="cart-item-info">
                                        <div className="cart-item-cat">{item.categoria}</div>
                                        <div className="cart-item-name">{item.nombre}</div>
                                        <div className="cart-item-price">
                                            <strong>₡{Number(item.precio).toLocaleString()}</strong> {t('cU')}
                                        </div>
                                    </div>
                                    <div className="cart-item-controls">
                                        <div className="cart-item-subtotal">
                                            ₡{(Number(item.precio) * item.cantidad).toLocaleString()}
                                        </div>
                                        <div className="cart-qty">
                                            <button className="cart-qty-btn" onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}>−</button>
                                            <span className="cart-qty-num">{item.cantidad}</span>
                                            <button className="cart-qty-btn" onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}>+</button>
                                        </div>
                                        <button className="cart-remove" onClick={() => handleRemove(item.id)}>
                                            🗑️ {t('eliminar')}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <div className="cart-summary-top">
                                <div className="cart-summary-title">{t('resumen')}</div>
                                {items.map(item => (
                                    <div className="cart-summary-row" key={item.id}>
                                        <span>{item.nombre} ×{item.cantidad}</span>
                                        <span>₡{(Number(item.precio) * item.cantidad).toLocaleString()}</span>
                                    </div>
                                ))}
                                <div className="cart-summary-row" style={{ marginTop: '0.75rem' }}>
                                    <span>{t('subtotal')}</span>
                                    <span>₡{Number(total).toLocaleString()}</span>
                                </div>
                                <div className={`cart-summary-row ${shipping === 0 ? 'highlight' : ''}`}>
                                    <span>{t('envio')}</span>
                                    <span>{shipping === 0 ? t('gratis') : `₡${shipping}`}</span>
                                </div>
                                {shipping === 0 && (
                                    <div className="cart-shipping-note">✅ {t('envioGratisNota')}</div>
                                )}
                            </div>

                            <div className="cart-summary-total-wrap">
                                <div className="cart-summary-total">
                                    <span className="cart-summary-total-label">{t('total')}</span>
                                    <span className="cart-summary-total-value">₡{Number(totalFinal).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="cart-summary-actions">
                                <button className="cart-checkout" onClick={() => navigate('/checkout')}>
                                    {t('procederPago')} →
                                </button>
                                <button onClick={() => navigate('/catalogo')} className="cart-continue">
                                    ← {t('seguirComprando')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </>
    )
}