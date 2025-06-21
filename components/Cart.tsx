import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Modal, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CartItem from './CartItem';
import { useCart } from './CartContext';
import { useRouter } from 'expo-router'; 
import { useAppTheme } from '../constants/ThemeContext';
import { Colors } from '../constants/Colors';

const S = {
  borderRadiusLg: 22,
  borderRadiusBtn: 16,
  fontSizeXxl: 25,
  fontSizeMd: 16,
  fontSizeLg: 20,
  spacingLg: 28,
  spacingMd: 16,
  spacingSm: 10,
  shadow: 10,
};

const Cart: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
  // Use theme context for global dark/light mode
  const { theme } = useAppTheme();
  const colors = Colors[theme];

  const { items, changeQuantity, removeFromCart, clearCart } = useCart();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Use expo-router for navigation
  const router = useRouter();

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('🛒 Empty Cart', 'Please add some items to your cart before checkout.');
      return;
    }
    onClose();
    router.push('/Checkout'); // <-- Go to the Checkout screen
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="formSheet">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.tint } ]}>Shopping Cart</Text>
          <TouchableOpacity onPress={onClose} style={styles.headerCloseBtn}>
            <Ionicons name="close" size={28} color={colors.tint} />
          </TouchableOpacity>
        </View>

        {/* Cart Items */}
        <FlatList
          data={items}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <CartItem
              item={item}
              onIncrease={() => changeQuantity(item.id, 1)}
              onDecrease={() =>
                item.quantity === 1
                  ? removeFromCart(item.id)
                  : changeQuantity(item.id, -1)
              }
            />
          )}
          ListEmptyComponent={
            <Text style={{
              textAlign: 'center',
              marginTop: 48,
              color: colors.icon,
              fontSize: 17,
              fontWeight: '600'
            }}>
              Your cart is empty.
            </Text>
          }
          contentContainerStyle={{ paddingBottom: S.spacingLg + 32 }}
        />

        {/* Footer */}
        <View style={[
          styles.footer,
          {
            backgroundColor: colors.card,
            shadowColor: colors.shadow,
            borderTopLeftRadius: S.borderRadiusLg,
            borderTopRightRadius: S.borderRadiusLg,
          }
        ]}>
          <Text style={[styles.totalText, { color: colors.tint }]}>
            Total: <Text style={{ color: colors.text }}>{`$${total.toFixed(2)}`}</Text>
          </Text>
          <LinearGradient
            colors={[colors.tint, colors.accent]}
            start={{ x: 0.1, y: 0.2 }}
            end={{ x: 1, y: 1 }}
            style={styles.checkoutButton}
          >
            <TouchableOpacity onPress={handleCheckout} activeOpacity={0.93}>
              <Text style={styles.checkoutText}>Checkout</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === 'ios' ? 50 : 38 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: S.spacingLg,
    marginBottom: 6,
    minHeight: 60,
  },
  headerTitle: {
    fontSize: S.fontSizeXxl,
    fontWeight: 'bold',
    flex: 1,
  },
  headerCloseBtn: {
    marginLeft: 8,
    padding: 2,
    borderRadius: 100,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: S.spacingLg,
    marginHorizontal: 0,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.13,
    shadowRadius: 16,
    elevation: 8,
    borderTopWidth: 0,
    minHeight: 72,
  },
  totalText: {
    fontSize: S.fontSizeLg,
    fontWeight: 'bold',
    letterSpacing: 0.15,
  },
  checkoutButton: {
    borderRadius: S.borderRadiusBtn,
    paddingVertical: 11,
    paddingHorizontal: 32,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.20,
    shadowRadius: 9,
    elevation: 5,
  },
  checkoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: S.fontSizeMd,
    letterSpacing: 0.22,
    textShadowColor: 'rgba(0,0,0,0.13)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    textAlign: 'center',
  },
});

export default Cart;