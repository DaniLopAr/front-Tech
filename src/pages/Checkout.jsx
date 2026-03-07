import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from 'react-i18next'


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);



export function Checkout() {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    )
}


function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const { items, total, vaciarCarrito } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { usuario } = useAuth();
    const { t } = useTranslation()


    const shipping = total > 2000 ? 0 : 15;
    const totalFinal = total + shipping;


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        setError(null);

        try {
            //aqui se conecta con la funcion de django
            const { data } = await api.post('ordenes/create-payment-intent/', {
                amount: totalFinal * 100, // Stripe trabaja con centavos

            })
            console.log('Respuesta Django:', data)  // ← agrega esto


            //aqui se confirma el pago con stripe
            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                }
            })

            if (result.error) {
                setError(result.error.message);
                toast.error("Error en el pago: " + result.error.message);
            } else {
                // ← reemplaza el navigate('/') por esto:
                try {
                    await api.post('/ordenes/confirmar/', {
                        nombre: usuario.username,
                        items: items.map(item => ({
                            nombre: item.nombre,
                            cantidad: item.cantidad,
                            precio: Number(item.precio) * item.cantidad,
                        })),
                        total: totalFinal,
                    })
                } catch (e) {
                    console.log('Error enviando factura:', e)
                }

                vaciarCarrito()
                navigate('/')
                toast.success('¡Pago exitoso! Revisa tu correo 📧')
            }

        } catch (err) {
            setError("Error al procesar el pago");
            toast.error("Error al procesar el pago: " + err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <style>{`
                .checkout {
                    min-height: 100vh;
                    background: var(--bg-deep);
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;
                    color: var(--text-primary);
                    padding: 110px 5% 6rem;
                    box-sizing: border-box;
                }

                .checkout-header {
                    margin-bottom: 3rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 1px solid var(--border-subtle);
                    position: relative;
                }

                .checkout-header::after {
                    content: '';
                    position: absolute;
                    bottom: -1px; left: 0;
                    width: 80px; height: 2px;
                    background: var(--gradient-hero);
                }

                .checkout-eyebrow {
                    font-size: 0.62rem;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    color: var(--accent-violet);
                    font-weight: 600;
                    margin-bottom: 0.4rem;
                }

                .checkout-title {
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;, monospace;
                    font-size: clamp(1.8rem, 3vw, 2.5rem);
                    font-weight: 700;
                }

                .checkout-layout {
                    display: grid;
                    grid-template-columns: 1fr 380px;
                    gap: 2.5rem;
                    align-items: start;
                }

                .checkout-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .checkout-section-title {
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;, monospace;
                    font-size: 0.82rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: var(--text-primary);
                    margin-bottom: 1rem;
                    padding-bottom: 0.75rem;
                    border-bottom: 1px solid var(--border-subtle);
                }

                .checkout-fields {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                .checkout-field {
                    display: flex;
                    flex-direction: column;
                    gap: 0.4rem;
                }

                .checkout-field.full { grid-column: 1 / -1; }

                .checkout-label {
                    font-size: 0.72rem;
                    font-weight: 600;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                }

                .checkout-input {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: 10px;
                    padding: 0.7rem 1rem;
                    color: var(--text-primary);
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;
                    font-size: 0.85rem;
                    outline: none;
                    transition: border-color 0.25s;
                    box-sizing: border-box;
                    width: 100%;
                }

                .checkout-input:focus {
                    border-color: var(--accent-violet);
                    box-shadow: var(--glow-soft);
                }

                .checkout-card-wrap {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: 10px;
                    padding: 0.85rem 1rem;
                    transition: border-color 0.25s;
                }

                .checkout-card-wrap:focus-within {
                    border-color: var(--accent-violet);
                    box-shadow: var(--glow-soft);
                }

                .checkout-error {
                    background: rgba(247,37,133,0.1);
                    border: 1px solid rgba(247,37,133,0.3);
                    border-radius: 10px;
                    padding: 0.75rem 1rem;
                    font-size: 0.82rem;
                    color: #f72585;
                }

                .checkout-test-card {
                    background: rgba(124,58,237,0.08);
                    border: 1px solid var(--border-accent);
                    border-radius: 10px;
                    padding: 0.75rem 1rem;
                    font-size: 0.78rem;
                    color: var(--text-muted);
                }

                .checkout-test-card strong {
                    color: var(--accent-violet);
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;, monospace;
                }

                .checkout-submit {
                    width: 100%;
                    padding: 1rem;
                    background: var(--gradient-button);
                    border: none;
                    border-radius: 12px;
                    color: white;
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;
                    font-size: 0.9rem;
                    font-weight: 700;
                    cursor: pointer;
                    box-shadow: var(--glow-purple);
                    transition: all 0.3s;
                    position: relative;
                    overflow: hidden;
                }

                .checkout-submit:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 0 28px #a855f7cc;
                }

                .checkout-submit:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                /* Resumen */
                .checkout-summary {
                    position: sticky;
                    top: 90px;
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: 20px;
                    overflow: hidden;
                }

                .checkout-summary-top {
                    padding: 1.75rem;
                    border-bottom: 1px solid var(--border-subtle);
                }

                .checkout-summary-title {
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;, monospace;
                    font-size: 0.82rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    margin-bottom: 1.25rem;
                }

                .checkout-summary-item {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    margin-bottom: 0.5rem;
                }

                .checkout-summary-total-wrap {
                    padding: 1.75rem;
                }

                .checkout-summary-total {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .checkout-summary-total-label {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    font-weight: 600;
                }

                .checkout-summary-total-value {
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;, monospace;
                    font-size: 1.6rem;
                    font-weight: 700;
                    background: var(--gradient-hero);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                @media (max-width: 900px) {
                    .checkout-layout { grid-template-columns: 1fr; }
                    .checkout-summary { position: static; }
                }

                @media (max-width: 500px) {
                    .checkout-fields { grid-template-columns: 1fr; }
                }
            `}</style>

            <div className="checkout">
                <div className="checkout-header">
                    <div className="checkout-eyebrow">{t('ultimoPaso')}</div>
                    <h1 className="checkout-title">{t('checkout')}</h1>
                </div>

                <div className="checkout-layout">
                    <form className="checkout-form" onSubmit={handleSubmit}>

                        {/* Datos de envío */}
                        <div>
                            <div className="checkout-section-title">{t('datosEnvio')}</div>
                            <div className="checkout-fields">
                                <div className="checkout-field">
                                    <label className="checkout-label">{t('nombre')}</label>
                                    <input className="checkout-input" type="text" placeholder="Juan" required />
                                </div>
                                <div className="checkout-field">
                                    <label className="checkout-label">{t('apellido')}</label>
                                    <input className="checkout-input" type="text" placeholder="Pérez" required />
                                </div>
                                <div className="checkout-field full">
                                    <label className="checkout-label">{t('direccion')}</label>
                                    <input className="checkout-input" type="text" placeholder="Calle 123, San José" required />
                                </div>
                                <div className="checkout-field">
                                    <label className="checkout-label">{t('ciudad')}</label>
                                    <input className="checkout-input" type="text" placeholder="San José" required />
                                </div>
                                <div className="checkout-field">
                                    <label className="checkout-label">{t('telefono')}</label>
                                    <input className="checkout-input" type="tel" placeholder="+506 0000-0000" required />
                                </div>
                            </div>
                        </div>

                        {/* Pago */}
                        <div>
                            <div className="checkout-section-title">{t('infoPago')}</div>
                            <div className="checkout-field full" style={{ marginBottom: '1rem' }}>
                                <label className="checkout-label">{t('tarjeta')}</label>
                                <div className="checkout-card-wrap">
                                    <CardElement options={{
                                        style: {
                                            base: {
                                                fontSize: '15px',
                                                color: '#e2e8f0',
                                                fontFamily: 'Inter, sans-serif',
                                                '::placeholder': { color: '#64748b' },
                                            }
                                        }
                                    }} />
                                </div>
                            </div>
                            <div className="checkout-test-card">
                                {t('tarjetaPrueba')}: <strong>4242 4242 4242 4242</strong> — {t('fechaCVC')}
                            </div>
                        </div>

                        {error && <div className="checkout-error">{error}</div>}

                        <button className="checkout-submit" type="submit" disabled={!stripe || loading}>
                            {loading ? t('procesando') : `${t('pagar')} ₡${Number(totalFinal).toLocaleString()}`}
                        </button>
                    </form>

                    {/* Resumen */}
                    <div className="checkout-summary">
                        <div className="checkout-summary-top">
                            <div className="checkout-summary-title">{t('tuPedido')}</div>
                            {items.map(item => (
                                <div className="checkout-summary-item" key={item.id}>
                                    <span>{item.nombre} ×{item.cantidad}</span>
                                    <span>₡{(Number(item.precio) * item.cantidad).toLocaleString()}</span>
                                </div>
                            ))}
                            <div className="checkout-summary-item" style={{ marginTop: '0.75rem' }}>
                                <span>{t('envio')}</span>
                                <span>{shipping === 0 ? t('gratis') : `₡${shipping}`}</span>
                            </div>
                        </div>
                        <div className="checkout-summary-total-wrap">
                            <div className="checkout-summary-total">
                                <span className="checkout-summary-total-label">{t('total')}</span>
                                <span className="checkout-summary-total-value">₡{Number(totalFinal).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}



