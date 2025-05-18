import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import CartItem from '../components/CartItem';
import { CartItem as CartItemType, Product } from '../app/(tabs)/index'; // Adjust the import path as necessary

interface CartProps {
  items: CartItemType[];
  onAddItem: (product: Product) => void;
  onRemoveItem: (productId: number) => void;
  total: number;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ items, onAddItem, onRemoveItem, total, onClose }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Your Cart</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>Back to Shop</Text>
        </TouchableOpacity>
      </View>
      
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <TouchableOpacity style={styles.shopButton} onPress={onClose}>
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            renderItem={({ item }) => (
              <CartItem
                item={item}
                onIncrease={() => onAddItem(item)}
                onDecrease={() => onRemoveItem(item.id)}
              />
            )}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.list}
          />
          
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutButton}>
              <Text style={styles.checkoutText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  shopButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  shopButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  footer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    color: '#333',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  checkoutButton: {
    backgroundColor: '#28a745',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
  },
  checkoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Cart;