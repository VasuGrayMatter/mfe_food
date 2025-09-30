import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, updateQuantity } from 'base_app/CartSlice';
import './FoodList.css';

// Simple local API function
const postToMockAPI = async (endpoint, data, token = '') => {
  try {
    const response = await fetch(`https://68db5a3c23ebc87faa32af49.mockapi.io/users/food_summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error posting to mock API:', error);
    throw error;
  }
};

export default function FoodList() {
  const items = useSelector(state => state.inventory.food);
  const cartItems = useSelector(state => state.cart.food);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const getItemQuantity = (itemId) => {
    const cartItem = cartItems.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  // Function to post food summary to mock API
  const sendFoodSummaryToAPI = async () => {
    if (cartItems.length === 0) {
      alert('No food items in cart to send!');
      return;
    }

    const summaryData = {
      username: user.username,
      foodItems: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: (item.price * item.quantity).toFixed(2)
      })),
      totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2),
      userToken: user.token
    };

    try {
      console.log('Sending food summary:', summaryData);
      const result = await postToMockAPI('food_summary', summaryData, user.token);
      console.log('Food summary posted successfully:', result);
      alert('Food summary sent to API successfully!');
    } catch (error) {
      console.error('Failed to post food summary:', error);
      alert('Failed to send food summary. Check console for details.');
    }
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
      <div className="food-header">
        <h2 className="section-title">🍕 Delicious Food Menu</h2>
        <button 
          className="send-summary-btn"
          onClick={sendFoodSummaryToAPI}
          disabled={cartItems.length === 0}
        >
          📤 Send Food Summary to API
        </button>
      </div>
      
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