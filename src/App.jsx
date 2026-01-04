import React, { useEffect, useMemo, useState } from "react";
import "./index.css"

const PRODUCTS = [
  { id: 1, title: "Laptop", price: 50000, category: "Electronics", stock: 5 },
  { id: 2, title: "Phone", price: 30000, category: "Electronics", stock: 0 },
  { id: 3, title: "Shoes", price: 2000, category: "Fashion", stock: 10 },
  { id: 4, title: "Watch", price: 4000, category: "Fashion", stock: 3 },
  { id: 5, title: "Chair", price: 1500, category: "Furniture", stock: 6 },
  { id: 6, title: "Table", price: 3500, category: "Furniture", stock: 2 },
];

export default function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");
  const [cart, setCart] = useState({});
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);


  //FILTER + SEARCH + SORT (together)
  const filteredProducts = useMemo(() => {
    let data = [...PRODUCTS];

    if (search) {
      data = data.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "All") {
      data = data.filter(p => p.category === category);
    }

    if (sort === "low") {
      data.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      data.sort((a, b) => b.price - a.price);
    }

    return data;
  }, [search, category, sort]);

  //CART HANDLERS
  const addToCart = (product) => {
    setCart(prev => {
      const qty = prev[product.id]?.qty || 0;
      if (qty >= product.stock) return prev;
      return {
        ...prev,
        [product.id]: { ...product, qty: qty + 1 }
      };
    });
  };

  const updateQty = (id, qty, stock) => {
    if (qty < 1 || qty > stock) return;
    setCart(prev => ({ ...prev, [id]: { ...prev[id], qty }
    }));
  };

  const removeItem = (id) => {
    setCart(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const totalItems = Object.values(cart).reduce((a, b) => a +
  b.qty, 0);
  const totalPrice = Object.values(cart).reduce(
    (a, b) => a + b.qty * b.price, 0
  );

  return (
    <div className="app">
      <div className="header">
        <h2>Mini E-Commerce</h2>
        <div className="auth-buttons">
          <button onClick={() =>
            setShowLogin(true)}>Login
          </button>
          <button onClick={() => setShowSignup(true)}>Sign 
            Up
          </button>
        </div>
      </div>

      {showLogin && (
        <div className="modal">
          <h3>Login</h3>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <div className="modal-actions">
            <button onClick={() =>
              setShowLogin(false)}>Login
            </button>
            <button onClick={() =>
              setShowLogin(false)}>Cancel
            </button>
          </div>
        </div>
      )}
      {showSignup && (
        <div className="modal">
          <h3>Sign Up</h3>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <div className="modal-actions">
            <button onClick={() =>
              setShowSignup(false)}>Create Account
            </button>
            <button onClick={() =>
              setShowSignup(false)}>Cancel
            </button>
          </div>
        </div>
      )}

      {/* SEARCH + FILTERS */}
      <div className="filters">
        <input
          placeholder="Search product"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select onChange={(e) =>
          setCategory(e.target.value)}>
          <option>All</option>
          <option>Electronics</option>
          <option>Fashion</option>
          <option>Furniture</option>
        </select>

        <select onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort</option>
          <option value="low">Low → High</option>
          <option value="high">High → Low</option>
        </select>

        <button onClick={() => {
          setSearch("");
          setCategory("All");
          setSort("");
          }}>
          Clear Filters
        </button>
      </div>

      {/* PRODUCT LIST */}
      <div className="grid">
        {filteredProducts.length === 0 && <p>No products
          found</p>}

        {filteredProducts.map(p => (
          <div key={p.id} className="card">
            <h4>{p.title}</h4>
            <p>₹{p.price}</p>
            <p>{p.category}</p>
            <p>{p.stock > 0 ? "In Stock" : "Out of Stock"}
            </p>
            <button
              disabled={p.stock === 0}
              onClick={() => addToCart(p)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* CART */}
      <div className="cart">
        <h3>Cart</h3>
        {Object.keys(cart).length === 0 && <p>Empty cart</p>}

        {Object.values(cart).map(item => (
          <div key={item.id} className="cart-item">
            <span>{item.title}</span>
            <input
              type="number"
              value={item.qty}
              onChange={(e) =>
                updateQty(item.id, Number(e.target.value),
                item.stock)
              }
            />
            <button onClick={() =>
              removeItem(item.id)}>Remove</button>
          </div>
        ))}

        <p>Total Items: {totalItems}</p>
        <p>Total Price: ₹{totalPrice}</p>
      </div>
    </div>
  );
}
