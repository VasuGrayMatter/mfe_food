import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, updateQuantity } from 'base_app/CartSlice';
import './FoodList.css';

export default function FoodList() {
  const items = useSelector(state => state.inventory.food);
  const cartItems = useSelector(state => state.cart.food);
  const dispatch = useDispatch();

  const getItemQuantity = (itemId) => {
    const cartItem = cartItems.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCart = (item) => {
    dispatch(addToCart({
      category: 'food',
      item: { ...item, quantity: 1 }
    }));
  };

  const handleQuantityChange = (item, change) => {
    const currentQuantity = getItemQuantity(item.id);
    const newQuantity = currentQuantity + change;
    
    if (newQuantity <= 0) {
      dispatch(updateQuantity({
        category: 'food',
        id: item.id,
        quantity: 0
      }));
    } else {
      dispatch(updateQuantity({
        category: 'food',
        id: item.id,
        quantity: newQuantity
      }));
    }
  };

  return (
    <div className="food-list">
      <h2 className="section-title">🍕 Delicious Food Menu</h2>
      <div className="food-grid">
        {items.map(food => {
          const quantity = getItemQuantity(food.id);
          
          return (
            <div key={food.id} className="food-card">
              <div className="food-image">{food.image}</div>
              
              <div className="food-info">
                <h3 className="food-name">{food.name}</h3>
                <p className="food-description">{food.description}</p>
                <div className="food-price">${food.price}</div>
              </div>

              <div className="food-actions">
                {quantity > 0 ? (
                  <div className="quantity-controls">
                    <button 
                      className="qty-btn minus"
                      onClick={() => handleQuantityChange(food, -1)}
                    >-</button>
                    <span className="quantity">{quantity}</span>
                    <button 
                      className="qty-btn plus"
                      onClick={() => handleQuantityChange(food, 1)}
                    >+</button>
                  </div>
                ) : (
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(food)}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}