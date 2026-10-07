import { useState } from "react";
import "../src/css/App.css";
import "../src/css/Menu.css";
import { ChevronRight, ShoppingCart, Minus, Plus, Trash2, X, CheckCircle } from "lucide-react";

const BASE = import.meta.env.BASE_URL;

const MENU = [
  { id: 1, name: "Margherita Pizza", price: 5.99, img: `${BASE}img/images (2).jpeg` },
  { id: 2, name: "Spaghetti Carbonara", price: 8.99, img: `${BASE}img/images.jpeg` },
  { id: 3, name: "Spaghetti Bolognese", price: 4.99, img: `${BASE}img/images (1).jpeg` },
  { id: 4, name: "Fettuccine Alfredo", price: 4.99, img: `${BASE}img/download.jpeg` },
  { id: 5, name: "Pepperoni Pizza", price: 4.99, img: `${BASE}img/images (3).jpeg` },
  { id: 7, name: "Penne Arrabbiata", price: 4.99, img: `${BASE}img/images (4).jpeg` },
  { id: 8, name: "Caprese Salad", price: 4.99, img: `${BASE}img/images (5).jpeg` },
  { id: 9, name: "Mushroom Risotto", price: 4.99, img: `${BASE}img/images (6).jpeg` },
  { id: 10, name: "Tiramisu", price: 4.99, img: `${BASE}img/images (7).jpeg` },
  { id: 11, name: "Ravioli Ricotta", price: 4.99, img: `${BASE}img/images (8).jpeg` },
];

function App() {
  const [q, setQ] = useState("");
  const [cart, setCart] = useState([]); // [{ id, name, price, img, qty }]
  const [view, setView] = useState("menu"); // "menu" | "cart"
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null); // เก็บ snapshot ตอนกด checkout

  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  function addToCart(menuItem) {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === menuItem.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === menuItem.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevCart, { ...menuItem, qty: 1 }];
    });
  }

  function increaseQty(id) {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item))
    );
  }

  function decreaseQty(id) {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty - 1 } : item))
        .filter((item) => item.qty > 0)
    );
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  function handleCheckout() {
    // เก็บ snapshot ของ cart + total ไว้แสดงในใบบิล ก่อนที่จะล้าง cart
    setReceiptData({ items: cart, total });
    setShowReceipt(true);
  }

  function closeReceipt() {
    setShowReceipt(false);
    setCart([]); // ล้างตะกร้าหลังปิดใบบิล (สั่งซื้อเสร็จแล้ว)
    setView("menu");
  }

  return (
    <>
      <header className="top">
        <div className="menubar">
          <div className="logo">Kupa</div>
          <nav className="nav-buttons">
            <button onClick={() => setView("menu")}>Home</button>
            <button onClick={() => setView("menu")}>Menu</button>
            <button onClick={() => setView("cart")}>Cart</button>
            <button>Profile</button>
          </nav>
          <input
            className="search"
            placeholder="search..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <a
            className="cartlink"
            href="#cart"
            onClick={(e) => {
              e.preventDefault();
              setView("cart");
            }}
          >
            <ShoppingCart size={30} />
            {count > 0 && <b>{count}</b>}
          </a>
        </div>
      </header>

      {view === "menu" && (
        <>
          <div className="seller-info">
            <h1>Delivery to home.</h1>
            <a href="#" className="see-more">
              <ChevronRight size={30} />
            </a>
          </div>

          <main className="content">
            <div className="menu-1">
              <h2 className="menu-title">Our Menu</h2>

              <div className="menu-grid">
                {MENU.filter((item) =>
                  item.name.toLowerCase().includes(q.toLowerCase())
                ).map((item) => (
                  <div key={item.id} className="menu-card">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="menu-card-img"
                    />
                    <h3 className="menu-card-name">{item.name}</h3>
                    <p className="menu-card-price">${item.price.toFixed(2)}</p>
                    <button
                      className="menu-card-btn"
                      onClick={() => addToCart(item)}
                    >
                      Add to cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </>
      )}

      {view === "cart" && (
        <main className="content">
          <div className="cart-page">
            <h2 className="menu-title">Your Cart</h2>

            {cart.length === 0 ? (
              <p className="cart-empty">ຫຍັງບໍ່ມີເມນູ</p>
            ) : (
              <>
                <div className="cart-list">
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="cart-item-img"
                      />
                      <div className="cart-item-info">
                        <h4>{item.name}</h4>
                        <p className="cart-item-price">
                          ${item.price.toFixed(2)} / ชิ้น
                        </p>
                      </div>

                      <div className="cart-item-qty">
                        <button onClick={() => decreaseQty(item.id)}>
                          <Minus size={16} />
                        </button>
                        <span>{item.qty}</span>
                        <button onClick={() => increaseQty(item.id)}>
                          <Plus size={16} />
                        </button>
                      </div>

                      <p className="cart-item-subtotal">
                        ${(item.price * item.qty).toFixed(2)}
                      </p>

                      <button
                        className="cart-item-remove"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div className="cart-total-row">
                    <span>Total</span>
                    <span className="cart-total-amount">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                  <button className="checkout-btn" onClick={handleCheckout}>
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </main>
      )}

      {/* ===== Receipt Modal (ใบบิล) ===== */}
      {showReceipt && receiptData && (
        <div className="receipt-overlay" onClick={closeReceipt}>
          <div className="receipt-modal" onClick={(e) => e.stopPropagation()}>
            <button className="receipt-close" onClick={closeReceipt}>
              <X size={20} />
            </button>

            <div className="receipt-header">
              <CheckCircle size={48} color="#117f00" />
              <h2>ສັ່ງຊື້ສຳເລັດແລ້ວ!</h2>
              <p className="receipt-sub">Order Receipt</p>
            </div>

            <div className="receipt-divider" />

            <div className="receipt-items">
              {receiptData.items.map((item) => (
                <div key={item.id} className="receipt-row">
                  <span className="receipt-item-name">
                    {item.name} <span className="receipt-qty">x{item.qty}</span>
                  </span>
                  <span className="receipt-item-price">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="receipt-divider" />

            <div className="receipt-row receipt-total">
              <span>Total</span>
              <span>${receiptData.total.toFixed(2)}</span>
            </div>

            <button className="receipt-done-btn" onClick={closeReceipt}>
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;