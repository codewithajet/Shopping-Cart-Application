import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  cartItemsCount: number;
  onCartPress: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartItemsCount, onCartPress }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Shop App</Text>
      <TouchableOpacity onPress={onCartPress} style={styles.cartButton}>
        <Ionicons name="cart-outline" size={24} color="#333" />
        {cartItemsCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cartItemsCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cartButton: {
    position: 'relative',
    padding: 5,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ff4500',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Header;