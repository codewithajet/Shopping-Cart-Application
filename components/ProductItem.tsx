import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Product } from '../app/(tabs)/index'; // Adjust the import path as necessary

interface ProductItemProps {
  product: Product;
  onAddToCart: () => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, onAddToCart }) => {
  return (
    <View style={styles.card}>
      <Image 
        source={{ uri: product.image }} 
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity 
        style={styles.button} 
        onPress={onAddToCart}
      >
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: '#333',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007bff',
  },
  button: {
    backgroundColor: '#007bff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 12,
  },
});

export default ProductItem;