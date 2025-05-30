import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { CartItemType } from './CartContext';

const colors = {
  primary: '#3f51b5',
  secondary: '#ff4081',
  backgroundCard: '#fff',
  backgroundMain: '#f5f7fa',
  textColor: '#333',
  textLight: '#666',
  borderColor: '#e1e4e8',
  success: '#34C759',
  borderRadius: 12,
  borderRadiusLg: 16,
  spacingMd: 16,
  spacingSm: 8,
  fontSizeMd: 16,
  fontSizeLg: 18,
};

interface CartItemProps {
  item: CartItemType;
  onIncrease: () => void;
  onDecrease: () => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onIncrease, onDecrease }) => {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(1));

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.98, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleRemove = () => {
    if (item.quantity === 1) {
      Alert.alert(
        'Remove Item',
        `Remove "${item.name}" from your cart?`,
        [
          { text: 'Keep It', style: 'cancel' },
          { text: 'Remove', style: 'destructive', onPress: () => {
            Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true })
              .start(() => onDecrease());
          } }
        ]
      );
    } else {
      onDecrease();
    }
  };

  const handleIncrease = () => {
    animatePress();
    onIncrease();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          {item.quantity > 1 && (
            <View style={styles.quantityBadge}>
              <Text style={styles.quantityBadgeText}>{item.quantity}x</Text>
            </View>
          )}
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.productDescription} numberOfLines={2}>{item.description}</Text>
          <Text style={styles.price}>${item.price.toFixed(2)} {item.quantity > 1 && <Text style={styles.totalPrice}>Total: ${(item.price * item.quantity).toFixed(2)}</Text>}</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity style={styles.quantityButton} onPress={handleRemove}>
              <Ionicons name={item.quantity === 1 ? "trash-outline" : "remove"} size={16} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity style={styles.quantityButton} onPress={handleIncrease}>
              <LinearGradient colors={[colors.primary, '#002984']} style={styles.increaseGradient}>
                <Ionicons name="add" size={16} color={colors.backgroundCard} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderRadius: colors.borderRadiusLg,
    backgroundColor: colors.backgroundCard,
    elevation: 2,
  },
  card: {
    flexDirection: 'row',
    padding: colors.spacingMd,
    backgroundColor: colors.backgroundCard,
    borderRadius: colors.borderRadiusLg,
    overflow: 'hidden',
  },
  imageContainer: {
    marginRight: colors.spacingMd,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: colors.borderRadius,
    backgroundColor: colors.backgroundMain,
  },
  categoryBadge: {
    position: 'absolute',
    top: 2,
    left: 2,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryText: {
    color: colors.backgroundCard,
    fontSize: 10,
    fontWeight: '600',
  },
  quantityBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: colors.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  quantityBadgeText: {
    color: colors.backgroundCard,
    fontSize: 10,
    fontWeight: 'bold',
  },
  detailsContainer: { flex: 1, justifyContent: 'space-between' },
  productName: { fontSize: colors.fontSizeMd, fontWeight: '600', color: colors.textColor },
  productDescription: { fontSize: 13, color: colors.textLight, marginVertical: 2 },
  price: { fontSize: colors.fontSizeLg, fontWeight: 'bold', color: colors.textColor },
  totalPrice: { fontSize: 13, color: colors.textLight },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  quantityButton: {
    width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center',
    backgroundColor: colors.backgroundCard, marginHorizontal: 2,
  },
  quantityText: { fontSize: 16, fontWeight: '600', color: colors.textColor, marginHorizontal: 8 },
  increaseGradient: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
});

export default CartItem;