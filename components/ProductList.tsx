import React from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import ProductItem from '../components/ProductItem';
import { Product } from '../app/(tabs)/index'; // Adjust the import path as necessary

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Products</Text>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <ProductItem 
            product={item} 
            onAddToCart={() => onAddToCart(item)} 
          />
        )}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
    color: '#333',
  },
  list: {
    paddingBottom: 16,
  },
});

export default ProductList;