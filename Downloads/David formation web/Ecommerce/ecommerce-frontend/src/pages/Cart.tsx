import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/stores/CartContextType";

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState<string>("");
  const [appliedPromo, setAppliedPromo] = useState<string>("");

  // Berechnungen
  const subtotal = cartItems.reduce((sum, item) => sum + (item.article.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 9.99;
  const promoDiscount = appliedPromo ? subtotal * 0.1 : 0; // 10% Rabatt
  const total = subtotal + shipping - promoDiscount;

  // Handler Funktionen
  const handleUpdateQuantity = (articleId: number, newQuantity: number) => {
    updateQuantity(articleId, newQuantity);
  };

  const handleRemoveItem = (articleId: number) => {
    removeFromCart(articleId);
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "save10") {
      setAppliedPromo(promoCode);
      setPromoCode("");
    } else {
      alert("Ungültiger Promo-Code");
    }
  };

  const handleClearCart = () => {
    clearCart();
    setAppliedPromo("");
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Warenkorb</h1>
          <p className="text-gray-600">
            {cartItems.length === 0 
              ? "Ihr Warenkorb ist leer" 
              : `${cartItems.length} ${cartItems.length === 1 ? 'Artikel' : 'Artikel'} in Ihrem Warenkorb`
            }
          </p>
        </div>

        {cartItems.length === 0 ? (
          /* Leerer Warenkorb */
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Ihr Warenkorb ist leer</h3>
            <p className="text-gray-600 mb-8">Entdecken Sie unsere Produkte und fügen Sie Artikel zu Ihrem Warenkorb hinzu.</p>
            <Link 
              to="/" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Weiter einkaufen
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Warenkorb Artikel */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.article.id} className="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4">
                  <img
                    src={item.article.image}
                    alt={item.article.name}
                    className="w-24 h-24 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/96x96/e2e8f0/64748b?text=?';
                    }}
                  />
                  
                  <div className="flex-1">
                    <Link 
                      to={`/articles/${item.article.id}`} 
                      className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition"
                    >
                      {item.article.name}
                    </Link>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.article.description}</p>
                    <p className="text-blue-600 font-bold text-lg mt-2">{item.article.price.toFixed(2)} €</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleUpdateQuantity(item.article.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100 transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="px-4 py-2 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.article.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100 transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>

                    {/* Gesamtpreis für diesen Artikel */}
                    <div className="text-right min-w-[80px]">
                      <p className="text-lg font-bold text-gray-800">{(item.article.price * item.quantity).toFixed(2)} €</p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.article.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              {/* Actions */}
              <div className="flex justify-between items-center pt-4">
                <Link 
                  to="/" 
                  className="flex items-center text-blue-600 hover:text-blue-700 transition"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                  Weiter einkaufen
                </Link>
                <button
                  onClick={handleClearCart}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  Warenkorb leeren
                </button>
              </div>
            </div>

            {/* Zusammenfassung - bleibt gleich */}
            <div className="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Bestellübersicht</h2>
              
              {/* Promo Code */}
              <div className="mb-6">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Promo-Code eingeben"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    onClick={applyPromoCode}
                    disabled={!promoCode.trim()}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Anwenden
                  </button>
                </div>
                {appliedPromo && (
                  <div className="mt-2 flex items-center text-green-600 text-sm">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Promo-Code "{appliedPromo}" angewendet
                  </div>
                )}
              </div>

              {/* Kostenaufstellung */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Zwischensumme</span>
                  <span className="font-medium">{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Versand</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Kostenlos</span>
                    ) : (
                      `${shipping.toFixed(2)} €`
                    )}
                  </span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Rabatt (10%)</span>
                    <span>-{promoDiscount.toFixed(2)} €</span>
                  </div>
                )}
                {subtotal <= 500 && (
                  <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Versandkostenfrei ab 500 € (noch {(500 - subtotal).toFixed(2)} €)
                  </div>
                )}
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Gesamt</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-4">
                Zur Kasse ({total.toFixed(2)} €)
              </button>

              {/* Sicherheitshinweise */}
              <div className="text-center text-sm text-gray-500 space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Sichere SSL-Verschlüsselung</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  <span>30 Tage Rückgaberecht</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}