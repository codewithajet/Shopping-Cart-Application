import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { CartItemType } from './CartContext';
import { useAppTheme } from '../constants/ThemeContext';
import { Colors } from '../constants/Colors';

const S = {
  borderRadius: 13,
  borderRadiusLg: 20,
  spacingMd: 16,
  spacingSm: 8,
  fontSizeMd: 16,
  fontSizeLg: 18,
  iconSize: 18,
};

interface CartItemProps {
  item: CartItemType;
  onIncrease: () => void;
  onDecrease: () => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onIncrease, onDecrease }) => {
  // Use global theme context
  const { theme } = useAppTheme();
  const colors = Colors[theme];

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
          {
            text: 'Remove', style: 'destructive', onPress: () => {
              Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true })
                .start(() => onDecrease());
            }
          }
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
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          backgroundColor: colors.card,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={[styles.productImage, { backgroundColor: colors.background }]} />
          <View style={[styles.categoryBadge, { backgroundColor: colors.accent }]}>
            <Text style={[styles.categoryText, { color: '#fff' }]}>{item.category}</Text>
          </View>
          {item.quantity > 1 && (
            <View style={[styles.quantityBadge, { backgroundColor: colors.secondary }]}>
              <Text style={[styles.quantityBadgeText, { color: '#fff' }]}>{item.quantity}x</Text>
            </View>
          )}
        </View>
        <View style={styles.detailsContainer}>
          <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>{item.name}</Text>
          <Text style={[styles.productDescription, { color: colors.textLight }]} numberOfLines={2}>{item.description}</Text>
          <Text style={[styles.price, { color: colors.primary }]}>
            ${item.price.toFixed(2)}
            {item.quantity > 1 &&
              <Text style={[styles.totalPrice, { color: colors.textLight }]}>
                {' '}· Total: ${(item.price * item.quantity).toFixed(2)}
              </Text>
            }
          </Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity style={[styles.quantityButton, { backgroundColor: colors.background }]} onPress={handleRemove}>
              <Ionicons name={item.quantity === 1 ? "trash-outline" : "remove"} size={S.iconSize} color={item.quantity === 1 ? colors.danger : colors.primary} />
            </TouchableOpacity>
            <Text style={[styles.quantityText, { color: colors.text }]}>{item.quantity}</Text>
            <TouchableOpacity style={[styles.quantityButton, { overflow: 'hidden' }]} onPress={handleIncrease}>
              <LinearGradient
                colors={[colors.primary, colors.accent]}
                style={styles.increaseGradient}
              >
                <Ionicons name="add" size={S.iconSize} color={'#fff'} />
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
    marginVertical: 10,
    borderRadius: S.borderRadiusLg,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 3,
  },
  card: {
    flexDirection: 'row',
    padding: S.spacingMd,
    borderRadius: S.borderRadiusLg,
    borderWidth: 1.2,
    overflow: 'hidden',
  },
  imageContainer: {
    marginRight: S.spacingMd,
    position: 'relative',
  },
  productImage: {
    width: 76,
    height: 76,
    borderRadius: S.borderRadius,
  },
  categoryBadge: {
    position: 'absolute',
    top: 2,
    left: 2,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
    zIndex: 2,
    elevation: 2,
    shadowColor: 'rgba(0,0,0,0.15)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 2,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
    textTransform: 'capitalize',
  },
  quantityBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  quantityBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  detailsContainer: { flex: 1, justifyContent: 'space-between', marginLeft: 2 },
  productName: { fontSize: S.fontSizeMd, fontWeight: '700' },
  productDescription: { fontSize: 13, marginVertical: 2 },
  price: { fontSize: S.fontSizeLg, fontWeight: 'bold', marginTop: 2, marginBottom: 3 },
  totalPrice: { fontSize: 13, fontWeight: '600' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 7, marginBottom: 2 },
  quantityButton: {
    width: 36, height: 36, borderRadius: 11, justifyContent: 'center', alignItems: 'center',
    marginHorizontal: 2,
    backgroundColor: '#f1f5f9',
    shadowColor: 'rgba(0,0,0,0.08)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.09,
    shadowRadius: 2,
    elevation: 1,
  },
  quantityText: { fontSize: 17, fontWeight: '700', marginHorizontal: 8 },
  increaseGradient: {
    width: 36, height: 36, borderRadius: 11, justifyContent: 'center', alignItems: 'center'
  },
});

export default CartItem;