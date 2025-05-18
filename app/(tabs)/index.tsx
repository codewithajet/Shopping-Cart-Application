import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, View } from 'react-native';
import ProductList from '../../components/ProductList';
import Cart from '../../components/Cart';
import Header from './../../components/Header';

// Define interfaces for our data types
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

const Index: React.FC = () => {
  // Sample product data
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Wireless Headphones', price: 89.99, image: 'https://via.placeholder.com/100' },
    { id: 2, name: 'Smartphone', price: 699.99, image: 'https://via.placeholder.com/100' },
    { id: 3, name: 'Laptop', price: 1299.99, image: 'https://via.placeholder.com/100' },
    { id: 4, name: 'Smartwatch', price: 249.99, image: 'https://via.placeholder.com/100' },
    { id: 5, name: 'Bluetooth Speaker', price: 59.99, image: 'https://via.placeholder.com/100' },
  ]);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState<boolean>(false);

  // Add item to cart
  const addToCart = (product: Product): void => {
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      // Increase quantity if already in cart
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      // Add new item with quantity 1
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Remove item from cart
  const removeFromCart = (productId: number): void => {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem && existingItem.quantity === 1) {
      // Remove item if quantity is 1
      setCart(cart.filter(item => item.id !== productId));
    } else {
      // Decrease quantity
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      ));
    }
  };

  // Calculate total number of items in cart
  const cartItemsCount: number = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Calculate total price
  const cartTotal: number = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header 
        cartItemsCount={cartItemsCount}
        onCartPress={() => setShowCart(!showCart)}
      />
      
      {showCart ? (
        <Cart 
          items={cart} 
          onAddItem={addToCart}
          onRemoveItem={removeFromCart}
          total={cartTotal}
          onClose={() => setShowCart(false)}
        />
      ) : (
        <ProductList 
          products={products} 
          onAddToCart={addToCart} 
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
});

export default Index;