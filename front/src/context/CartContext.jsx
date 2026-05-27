import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('toy_store_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [showAbandonedToast, setShowAbandonedToast] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    let timer;
    if (cart.length > 0) {
      // 60 segundos para demostración
      timer = setTimeout(() => {
        setShowAbandonedToast(true);
      }, 60000);
    } else {
      setShowAbandonedToast(false);
    }
    return () => clearTimeout(timer);
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('toy_store_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      showAbandonedToast,
      setShowAbandonedToast,
      isCartOpen,
      setIsCartOpen,
      checkout: async (direccion = '') => {
        if (cart.length === 0) throw new Error('El carrito está vacío');
        
        const res = await fetch('/pedidos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: cart.map(i => ({ id: i.id, cantidad: i.quantity, precio: i.precio })),
            total: totalPrice,
            direccion
          })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error al procesar el pedido');
        
        clearCart();
        return data; // Contiene id_pedido y pago_url
      }
    }}>
      {children}
    </CartContext.Provider>
  );
};
