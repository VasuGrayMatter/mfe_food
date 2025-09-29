import React from 'react';
import FoodList from './components/FoodList';
import FoodSummary from './components/FoodSummary';


// Export both components
export { FoodSummary };
export default function FoodApp() { 
  return (
    <div className="food-app">
      <FoodList/>
    </div>
  ); 
}