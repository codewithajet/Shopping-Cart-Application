import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CartItem from './CartItem';
import { useCart, CartItemType } from './CartContext';

const colors = {
  primary: '#3f51b5',
  secondary: '#ff4081',
  backgroundCard: '#fff',
  backgroundMain: '#f5f7fa',
  textColor: '#333',
  textLight: '#666',
  borderRadiusLg: 16,
  fontSizeXxl: 24,
  spacingLg: 24,
  spacingMd: 16,
};

const Cart: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
  const { items, changeQuantity, removeFromCart, clearCart } = useCart();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('🛒 Empty Cart', 'Please add some items to your cart before checkout.');
      return;
    }
    Alert.alert(
      '🎉 Checkout Confirmation',
      `Ready to complete your purchase?\n\n💰 Total: $${total.toFixed(2)}\n📦 ${items.length} items`,
      [
        { text: 'Keep Shopping', style: 'cancel' },
        {
          text: 'Complete Order',
          style: 'default',
          onPress: () => {
            Alert.alert('✅ Order Confirmed!', 'Thank you for your purchase!');
            clearCart();
            onClose();
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={28} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={items}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <CartItem
              item={item}
              onIncrease={() => changeQuantity(item.id, 1)}
              onDecrease={() => item.quantity === 1 ? removeFromCart(item.id) : changeQuantity(item.id, -1)}
            />
          )}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 32 }}>Your cart is empty.</Text>}
        />
        <View style={styles.footer}>
          <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
          <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.checkoutButton}>
            <TouchableOpacity onPress={handleCheckout}>
              <Text style={styles.checkoutText}>Checkout</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundMain, paddingTop: 40 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, marginBottom: 8,
  },
  headerTitle: {
    fontSize: colors.fontSizeXxl, fontWeight: 'bold', color: colors.primary,
  },
  footer: {
    padding: colors.spacingLg, backgroundColor: colors.backgroundCard, borderTopLeftRadius: colors.borderRadiusLg,
    borderTopRightRadius: colors.borderRadiusLg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
  },
  totalText: { fontSize: 20, fontWeight: 'bold', color: colors.textColor },
  checkoutButton: {
    borderRadius: 20, paddingVertical: 10, paddingHorizontal: 20,
  },
  checkoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default Cart;