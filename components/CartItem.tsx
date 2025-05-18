import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartItem as CartItemType } from '../app/(tabs)/index'; // Adjust the import path as necessary

interface CartItemProps {
  item: CartItemType;
  onIncrease: () => void;
  onDecrease: () => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onIncrease, onDecrease }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.image} />
      
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>
      
      <View style={styles.quantityContainer}>
        <TouchableOpacity 
          style={styles.quantityButton} 
          onPress={onDecrease}
        >
          <Ionicons name="remove" size={18} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.quantity}>{item.quantity}</Text>
        
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={onIncrease}
        >
          <Ionicons name="add" size={18} color="#333" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.totalPrice}>
        ${(item.price * item.quantity).toFixed(2)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  price: {
    fontSize: 12,
    color: '#666',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 8,
    minWidth: 20,
    textAlign: 'center',
  },
  totalPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 50,
    textAlign: 'right',
  },
});

export default CartItem;