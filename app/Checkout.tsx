import React, { useState } from 'react';
import { getApiBaseUrl } from "../config/apiConfig";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../components/CartContext';

import type { CartItemType } from '../data/types';

const colors = {
  primary: '#3f51b5',
  secondary: '#ff4081',
  backgroundCard: '#fff',
  backgroundMain: '#f5f7fa',
  textColor: '#333',
  textLight: '#666',
  borderRadiusLg: 16,
  fontSizeXxl: 24,
  fontSizeLg: 18,
  fontSizeMd: 16,
  spacingLg: 24,
  spacingMd: 16,
  spacingSm: 8,
};


const deliveryMethods = ['Standard', 'Express', 'Pickup'];
const paymentMethods = ['card', 'paypal', 'cod'];

const Checkout: React.FC = () => {
  const { items, clearCart } = useCart();
  const subtotal = items.reduce((sum: number, item: CartItemType) => sum + item.price * item.quantity, 0);
  const [shippingCost, setShippingCost] = useState(5.0);
  const [taxAmount, setTaxAmount] = useState(2.0);
  const total = subtotal + shippingCost + taxAmount;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [shippingCountry, setShippingCountry] = useState('');
  const [shippingZipCode, setShippingZipCode] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState(deliveryMethods[0]);
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);
  const [couponCode, setCouponCode] = useState('');

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      Alert.alert('Cart empty', 'Add items before placing an order.');
      return;
    }
    if (
      !customerName ||
      !customerEmail ||
      !shippingAddress ||
      !shippingCity ||
      !shippingState ||
      !shippingCountry ||
      !shippingZipCode
    ) {
      Alert.alert('Missing Info', 'Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          shipping_address: shippingAddress,
          shipping_city: shippingCity,
          shipping_state: shippingState,
          shipping_country: shippingCountry,
          shipping_zip_code: shippingZipCode,
          delivery_method: deliveryMethod,
          delivery_instructions: deliveryInstructions,
          is_gift: isGift,
          gift_message: giftMessage,
          subtotal,
          shipping_cost: shippingCost,
          tax_amount: taxAmount,
          coupon_code: couponCode || undefined,
          payment_method: paymentMethod,
          items: items.map((i: CartItemType) => ({
            product_id: i.id,
            quantity: i.quantity,
            unit_price: i.price,
            product_name: i.name,
            attributes: i.attributes || null,
          })),
        }),
      });
      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        throw new Error(data.message || 'Order failed');
      }

      // Notification: success
      // If using Toast:
      // Toast.show({ type: 'success', text1: 'Order submitted successfully!', position: 'bottom' });
      // Or use Alert:
      Alert.alert('Success', `Order #${data.order_number} submitted successfully!`);

      clearCart();
      router.replace('/'); // Go back to home after order
    } catch (err: any) {
      setLoading(false);
      // Notification: error
      // Toast.show({ type: 'error', text1: String(err.message || 'Could not place order.') });
      Alert.alert('Order Error', err.message || 'Could not place order.');
    }
  };

  return (
    <LinearGradient colors={[colors.backgroundMain, '#fff']} style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
        </View>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {items.length === 0 ? (
            <Text style={styles.emptyText}>Your cart is empty.</Text>
          ) : (
            <>
              {/* Order Summary */}
              {items.map((item: CartItemType) => (
                <View key={item.id} style={styles.itemRow}>
                  <Text style={styles.itemName}>
                    {item.name} x {item.quantity}
                  </Text>
                  <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                </View>
              ))}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal:</Text>
                <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping:</Text>
                <Text style={styles.summaryValue}>${shippingCost.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax:</Text>
                <Text style={styles.summaryValue}>${taxAmount.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.primary }]}>Total:</Text>
                <Text style={[styles.summaryValue, { color: colors.primary }]}>${total.toFixed(2)}</Text>
              </View>

              {/* Form */}
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Name*</Text>
                <TextInput
                  value={customerName}
                  onChangeText={setCustomerName}
                  style={styles.input}
                  placeholder="Full Name"
                  autoCapitalize="words"
                />
                <Text style={styles.formLabel}>Email*</Text>
                <TextInput
                  value={customerEmail}
                  onChangeText={setCustomerEmail}
                  style={styles.input}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <Text style={styles.formLabel}>Phone</Text>
                <TextInput
                  value={customerPhone}
                  onChangeText={setCustomerPhone}
                  style={styles.input}
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                />
                <Text style={styles.formLabel}>Shipping Address*</Text>
                <TextInput
                  value={shippingAddress}
                  onChangeText={setShippingAddress}
                  style={styles.input}
                  placeholder="Address"
                  autoCapitalize="words"
                />
                <Text style={styles.formLabel}>City*</Text>
                <TextInput
                  value={shippingCity}
                  onChangeText={setShippingCity}
                  style={styles.input}
                  placeholder="City"
                  autoCapitalize="words"
                />
                <Text style={styles.formLabel}>State*</Text>
                <TextInput
                  value={shippingState}
                  onChangeText={setShippingState}
                  style={styles.input}
                  placeholder="State"
                  autoCapitalize="words"
                />
                <Text style={styles.formLabel}>Country*</Text>
                <TextInput
                  value={shippingCountry}
                  onChangeText={setShippingCountry}
                  style={styles.input}
                  placeholder="Country"
                  autoCapitalize="words"
                />
                <Text style={styles.formLabel}>Zip Code*</Text>
                <TextInput
                  value={shippingZipCode}
                  onChangeText={setShippingZipCode}
                  style={styles.input}
                  placeholder="Zip Code"
                  keyboardType="numeric"
                />
                <Text style={styles.formLabel}>Delivery Method*</Text>
                <View style={{ flexDirection: 'row', marginBottom: colors.spacingSm }}>
                  {deliveryMethods.map(method => (
                    <TouchableOpacity
                      key={method}
                      style={[
                        styles.radio,
                        deliveryMethod === method && styles.radioSelected,
                      ]}
                      onPress={() => setDeliveryMethod(method)}
                    >
                      <Text style={{
                        color: deliveryMethod === method ? '#fff' : colors.primary,
                        fontWeight: 'bold'
                      }}>{method}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.formLabel}>Delivery Instructions</Text>
                <TextInput
                  value={deliveryInstructions}
                  onChangeText={setDeliveryInstructions}
                  style={styles.input}
                  placeholder="Any instructions?"
                  autoCapitalize="sentences"
                />
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: colors.spacingSm }}>
                  <Switch value={isGift} onValueChange={setIsGift} />
                  <Text style={{ marginLeft: colors.spacingSm }}>Is this a gift?</Text>
                </View>
                {isGift && (
                  <>
                    <Text style={styles.formLabel}>Gift Message</Text>
                    <TextInput
                      value={giftMessage}
                      onChangeText={setGiftMessage}
                      style={styles.input}
                      placeholder="Gift message"
                      autoCapitalize="sentences"
                    />
                  </>
                )}
                <Text style={styles.formLabel}>Coupon Code</Text>
                <TextInput
                  value={couponCode}
                  onChangeText={setCouponCode}
                  style={styles.input}
                  placeholder="Coupon code (optional)"
                  autoCapitalize="characters"
                />
                <Text style={styles.formLabel}>Payment Method*</Text>
                <View style={{ flexDirection: 'row', marginBottom: colors.spacingSm }}>
                  {paymentMethods.map(method => (
                    <TouchableOpacity
                      key={method}
                      style={[
                        styles.radio,
                        paymentMethod === method && styles.radioSelected,
                      ]}
                      onPress={() => setPaymentMethod(method)}
                    >
                      <Text style={{
                        color: paymentMethod === method ? '#fff' : colors.primary,
                        fontWeight: 'bold'
                      }}>{method.toUpperCase()}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={styles.placeOrderButton}
                onPress={handlePlaceOrder}
                disabled={loading}
              >
                <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.placeOrderGradient}>
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.placeOrderText}>Place Order</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', padding: colors.spacingLg,
    borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: colors.fontSizeXxl,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: colors.spacingMd,
  },
  content: {
    padding: colors.spacingLg,
    paddingBottom: 40,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: colors.spacingLg,
    fontSize: colors.fontSizeLg,
    color: colors.textLight,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: colors.spacingMd,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: colors.spacingSm,
  },
  itemName: {
    fontSize: colors.fontSizeMd,
    color: colors.textColor,
  },
  itemPrice: {
    fontSize: colors.fontSizeMd,
    color: colors.textColor,
    fontWeight: 'bold',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
    marginBottom: 2,
    borderTopWidth: 0,
    borderTopColor: '#eee',
    paddingTop: 0,
  },
  summaryLabel: {
    fontSize: colors.fontSizeMd,
    fontWeight: '600',
    color: colors.textLight,
  },
  summaryValue: {
    fontSize: colors.fontSizeMd,
    fontWeight: '700',
    color: colors.textColor,
  },
  formSection: {
    backgroundColor: colors.backgroundCard,
    borderRadius: colors.borderRadiusLg,
    padding: colors.spacingMd,
    marginBottom: colors.spacingLg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  formLabel: {
    fontSize: colors.fontSizeMd,
    color: colors.textColor,
    marginTop: colors.spacingSm,
    marginBottom: 2,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    padding: 10,
    marginBottom: colors.spacingSm,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  radio: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  radioSelected: {
    backgroundColor: colors.primary,
    borderColor: '#fff',
  },
  placeOrderButton: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 4,
  },
  placeOrderGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 20,
  },
  placeOrderText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: colors.fontSizeLg,
  },
});

export default Checkout;