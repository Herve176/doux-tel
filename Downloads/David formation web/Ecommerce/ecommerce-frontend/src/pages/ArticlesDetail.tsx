import { useState } from "react";
import { useParams, Link } from "react-router-dom";

type Article = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
};

// Dieselben Artikel wie in Home.tsx
const demoArticles: Article[] = [
  {
    id: 1,
    name: "Smartphone Galaxy S24",
    price: 799,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
    description: "Leistungsstarkes Smartphone mit brillanter Kamera und großem Display."
  },
  {
    id: 2,
    name: "Laptop ProBook 15",
    price: 1199,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
    description: "Schneller Laptop für Arbeit und Freizeit mit langer Akkulaufzeit."
  },
  {
    id: 3,
    name: "Bluetooth Kopfhörer",
    price: 149,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    description: "Kabelloser Musikgenuss mit aktiver Geräuschunterdrückung."
  },
  {
    id: 4,
    name: "Smartwatch FitX",
    price: 199,
    image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=400&q=80",
    description: "Fitness-Tracker mit Pulsmessung und GPS."
  },
  {
    id: 5,
    name: "Tablet VisionPad 10",
    price: 499,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80",
    description: "Großes Tablet für Entertainment und Produktivität."
  },
  {
    id: 6,
    name: "Gaming Maus Ultra",
    price: 79,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
    description: "Präzise Gaming-Maus mit RGB-Beleuchtung."
  },
  {
    id: 7,
    name: "Wireless Lautsprecher",
    price: 89,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    description: "Mobiler Lautsprecher mit sattem Sound und langer Akkulaufzeit."
  },
  {
    id: 8,
    name: "HD Fernseher 55\"",
    price: 899,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    description: "Großer HD-Fernseher für Heimkino-Erlebnisse."
  },
  {
    id: 9,
    name: "USB-C Powerbank 20000mAh",
    price: 59,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
    description: "Leistungsstarke Powerbank für unterwegs."
  },
  {
    id: 10,
    name: "Kabellose Tastatur",
    price: 49,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80",
    description: "Ergonomische Tastatur für komfortables Arbeiten."
  },
  {
    id: 11,
    name: "4K Action Kamera",
    price: 299,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    description: "Robuste Action-Kamera für Outdoor-Abenteuer und Sportaufnahmen."
  },
  {
    id: 12,
    name: "Smart Home Steckdose",
    price: 39,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    description: "Steuern Sie Ihre Geräte bequem per App und Sprachassistent."
  },
  {
    id: 13,
    name: "Laser-Drucker OfficeJet",
    price: 179,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80",
    description: "Schneller und sparsamer Laserdrucker für Büro und Homeoffice."
  },
  {
    id: 14,
    name: "VR Headset VisionX",
    price: 399,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
    description: "Tauchen Sie ein in virtuelle Welten mit gestochen scharfer Grafik."
  },
  {
    id: 15,
    name: "USB-C Dockingstation",
    price: 89,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
    description: "Erweitern Sie Ihr Notebook um viele Anschlüsse und Ladefunktion."
  }
];

export default function ArticlesDetail() {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<{id: number, quantity: number}[]>([]);

  const article = demoArticles.find(a => a.id === parseInt(id || "0"));

  // Early return - wenn kein Artikel gefunden wird
  if (!article) {
    return (
      <div className="bg-gray-50 min-h-[70vh] py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Artikel nicht gefunden</h1>
          <p className="text-gray-600 mb-6">Der gesuchte Artikel existiert nicht oder wurde entfernt.</p>
          <Link 
            to="/" 
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    );
  }

  // Ab hier ist article definitiv definiert - TypeScript weiß das jetzt
  const addToCart = () => {
    const existingItem = cart.find(item => item.id === article.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === article.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { id: article.id, quantity }]);
    }
    alert(`${quantity}x ${article.name} zum Warenkorb hinzugefügt!`);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handlePayNow = () => {
    alert(`Weiterleitung zur Zahlung:\n${quantity}x ${article.name}\nGesamtpreis: ${article.price * quantity}€`);
  };

  const totalPrice = article.price * quantity;

  return (
    <div className="bg-gray-50 min-h-[70vh] py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8">
          <Link to="/" className="text-blue-600 hover:text-blue-700 hover:underline">
            ← Zurück zu allen Produkten
          </Link>
        </nav>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Produktbild */}
            <div className="flex justify-center">
              <img
                src={article.image}
                alt={article.name}
                className="w-full max-w-md h-96 object-cover rounded-lg shadow-md hover:scale-105 transition"
              />
            </div>

            {/* Produktinfos */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{article.name}</h1>
                <p className="text-2xl font-bold text-blue-600 mb-4">{article.price} €</p>
                <p className="text-gray-600 leading-relaxed text-lg">{article.description}</p>
              </div>

              {/* Menge auswählen */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-800 mb-2 font-semibold">Menge auswählen:</label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold text-gray-700 transition"
                    >
                      -
                    </button>
                    <span className="w-16 text-center font-semibold text-lg bg-gray-50 py-2 rounded border">{quantity}</span>
                    <button
                      onClick={increaseQuantity}
                      className="w-10 h-10 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold text-gray-700 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Gesamtpreis */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-xl font-bold text-gray-800">
                    Gesamtpreis: <span className="text-blue-600">{totalPrice} €</span>
                  </div>
                  {quantity > 1 && (
                    <div className="text-sm text-gray-600 mt-1">
                      ({quantity} × {article.price}€)
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={addToCart}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded hover:bg-blue-700 transition font-semibold text-lg shadow-md"
                  >
                    In den Warenkorb ({quantity})
                  </button>
                  <button
                    onClick={handlePayNow}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded hover:bg-green-700 transition font-semibold text-lg shadow-md"
                  >
                    Jetzt kaufen - {totalPrice}€
                  </button>
                </div>

                {/* Zusätzliche Infos */}
                <div className="text-sm text-gray-600 mt-6 space-y-1 bg-gray-50 p-4 rounded">
                  <div>✓ Kostenloser Versand ab 50€</div>
                  <div>✓ 30 Tage Rückgaberecht</div>
                  <div>✓ 2 Jahre Garantie</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}