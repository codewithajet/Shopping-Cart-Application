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
import { useAppTheme } from '../constants/ThemeContext';
import { Colors } from '../constants/Colors';
import type { CartItemType } from '../data/types';

// Sizing and spacing constants
const S = {
  borderRadiusLg: 18,
  fontSizeXxl: 26,
  fontSizeLg: 18,
  fontSizeMd: 16,
  spacingLg: 28,
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

  // THEME CONTEXT!
  const { theme } = useAppTheme();
  const palette = Colors[theme];

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

      Alert.alert('Success', `Order #${data.order_number} submitted successfully!`);

      clearCart();
      router.replace('/'); // Go back to home after order
    } catch (err: any) {
      setLoading(false);
      Alert.alert('Order Error', err.message || 'Could not place order.');
    }
  };

  return (
    <LinearGradient colors={palette.cardGradient as [string, string]} style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.header, { borderBottomColor: palette.border }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color={palette.tint} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: palette.tint }]}>Checkout</Text>
        </View>
        <ScrollView contentContainerStyle={[styles.content, { backgroundColor: 'transparent' }]} keyboardShouldPersistTaps="handled">
          {items.length === 0 ? (
            <Text style={[styles.emptyText, { color: palette.icon }]}>Your cart is empty.</Text>
          ) : (
            <>
              {/* Order Summary */}
              <View style={styles.summarySection}>
                <Text style={[styles.sectionTitle, { color: palette.text }]}>Order Summary</Text>
                {items.map((item: CartItemType) => (
                  <View key={item.id} style={[styles.itemRow, { borderBottomColor: palette.border }]}>
                    <Text style={[styles.itemName, { color: palette.text }]}>{item.name} x {item.quantity}</Text>
                    <Text style={[styles.itemPrice, { color: palette.text }]}>{(item.price * item.quantity).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</Text>
                  </View>
                ))}
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: palette.icon }]}>Subtotal:</Text>
                  <Text style={[styles.summaryValue, { color: palette.text }]}>{subtotal.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: palette.icon }]}>Shipping:</Text>
                  <Text style={[styles.summaryValue, { color: palette.text }]}>{shippingCost.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: palette.icon }]}>Tax:</Text>
                  <Text style={[styles.summaryValue, { color: palette.text }]}>{taxAmount.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: palette.tint, fontWeight: 'bold' }]}>Total:</Text>
                  <Text style={[styles.summaryValue, { color: palette.tint, fontWeight: 'bold' }]}>{total.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</Text>
                </View>
              </View>

              {/* Form */}
              <View style={[styles.formSection, { backgroundColor: palette.card, shadowColor: palette.shadow }]}>
                <Text style={[styles.sectionTitle, { color: palette.text }]}>Shipping Details</Text>
                <Text style={styles.formLabel}>Name*</Text>
                <TextInput
                  value={customerName}
                  onChangeText={setCustomerName}
                  style={[styles.input, { backgroundColor: palette.background, borderColor: palette.border, color: palette.text }]}
                  placeholder="Full Name"
                  placeholderTextColor={palette.icon}
                  autoCapitalize="words"
                />
                <Text style={styles.formLabel}>Email*</Text>
                <TextInput
                  value={customerEmail}
                  onChangeText={setCustomerEmail}
                  style={[styles.input, { backgroundColor: palette.background, borderColor: palette.border, color: palette.text }]}
                  placeholder="Email"
                  placeholderTextColor={palette.icon}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <Text style={styles.formLabel}>Phone</Text>
                <TextInput
                  value={customerPhone}
                  onChangeText={setCustomerPhone}
                  style={[styles.input, { backgroundColor: palette.background, borderColor: palette.border, color: palette.text }]}
                  placeholder="Phone Number"
                  placeholderTextColor={palette.icon}
                  keyboardType="phone-pad"
                />
                <Text style={styles.formLabel}>Shipping Address*</Text>
                <TextInput
                  value={shippingAddress}
                  onChangeText={setShippingAddress}
                  style={[styles.input, { backgroundColor: palette.background, borderColor: palette.border, color: palette.text }]}
                  placeholder="Address"
                  placeholderTextColor={palette.icon}
                  autoCapitalize="words"
                />
                <Text style={styles.formLabel}>City*</Text>
                <TextInput
                  value={shippingCity}
                  onChangeText={setShippingCity}
                  style={[styles.input, { backgroundColor: palette.background, borderColor: palette.border, color: palette.text }]}
                  placeholder="City"
                  placeholderTextColor={palette.icon}
                  autoCapitalize="words"
                />
                <Text style={styles.formLabel}>State*</Text>
                <TextInput
                  value={shippingState}
                  onChangeText={setShippingState}
                  style={[styles.input, { backgroundColor: palette.background, borderColor: palette.border, color: palette.text }]}
                  placeholder="State"
                  placeholderTextColor={palette.icon}
                  autoCapitalize="words"
                />
                <Text style={styles.formLabel}>Country*</Text>
                <TextInput
                  value={shippingCountry}
                  onChangeText={setShippingCountry}
                  style={[styles.input, { backgroundColor: palette.background, borderColor: palette.border, color: palette.text }]}
                  placeholder="Country"
                  placeholderTextColor={palette.icon}
                  autoCapitalize="words"
                />
                <Text style={styles.formLabel}>Zip Code*</Text>
                <TextInput
                  value={shippingZipCode}
                  onChangeText={setShippingZipCode}
                  style={[styles.input, { backgroundColor: palette.background, borderColor: palette.border, color: palette.text }]}
                  placeholder="Zip Code"
                  placeholderTextColor={palette.icon}
                  keyboardType="numeric"
                />
                <Text style={styles.formLabel}>Delivery Method*</Text>
                <View style={{ flexDirection: 'row', marginBottom: S.spacingSm }}>
                  {deliveryMethods.map(method => (
                    <TouchableOpacity
                      key={method}
                      style={[
                        styles.radio,
                        { borderColor: palette.tint, backgroundColor: deliveryMethod === method ? palette.tint : palette.card },
                        deliveryMethod === method && styles.radioSelected,
                      ]}
                      onPress={() => setDeliveryMethod(method)}
                    >
                      <Text style={{
                        color: deliveryMethod === method ? '#fff' : palette.tint,
                        fontWeight: 'bold'
                      }}>{method}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.formLabel}>Delivery Instructions</Text>
                <TextInput
                  value={deliveryInstructions}
                  onChangeText={setDeliveryInstructions}
                  style={[styles.input, { backgroundColor: palette.background, borderColor: palette.border, color: palette.text }]}
                  placeholder="Any instructions?"
                  placeholderTextColor={palette.icon}
                  autoCapitalize="sentences"
                />
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: S.spacingSm }}>
                  <Switch value={isGift} onValueChange={setIsGift} />
                  <Text style={{ marginLeft: S.spacingSm, color: palette.text }}>Is this a gift?</Text>
                </View>
                {isGift && (
                  <>
                    <Text style={styles.formLabel}>Gift Message</Text>
                    <TextInput
                      value={giftMessage}
                      onChangeText={setGiftMessage}
                      style={[styles.input, { backgroundColor: palette.background, borderColor: palette.border, color: palette.text }]}
                      placeholder="Gift message"
                      placeholderTextColor={palette.icon}
                      autoCapitalize="sentences"
                    />
                  </>
                )}
                <Text style={styles.formLabel}>Coupon Code</Text>
                <TextInput
                  value={couponCode}
                  onChangeText={setCouponCode}
                  style={[styles.input, { backgroundColor: palette.background, borderColor: palette.border, color: palette.text }]}
                  placeholder="Coupon code (optional)"
                  placeholderTextColor={palette.icon}
                  autoCapitalize="characters"
                />
                <Text style={styles.formLabel}>Payment Method*</Text>
                <View style={{ flexDirection: 'row', marginBottom: S.spacingSm }}>
                  {paymentMethods.map(method => (
                    <TouchableOpacity
                      key={method}
                      style={[
                        styles.radio,
                        { borderColor: palette.tint, backgroundColor: paymentMethod === method ? palette.tint : palette.card },
                        paymentMethod === method && styles.radioSelected,
                      ]}
                      onPress={() => setPaymentMethod(method)}
                    >
                      <Text style={{
                        color: paymentMethod === method ? '#fff' : palette.tint,
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
                activeOpacity={0.92}
              >
                <LinearGradient colors={[palette.tint, palette.accent]} style={styles.placeOrderGradient}>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: S.spacingLg,
    borderBottomWidth: 1.5,
  },
  headerTitle: {
    fontSize: S.fontSizeXxl,
    fontWeight: 'bold',
    marginLeft: S.spacingMd,
  },
  content: {
    padding: S.spacingLg,
    paddingBottom: 40,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: S.spacingLg,
    fontSize: S.fontSizeLg,
    fontWeight: '600',
  },
  summarySection: {
    marginBottom: S.spacingLg,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: S.spacingSm,
    borderBottomWidth: 1,
    paddingBottom: S.spacingSm - 2,
  },
  itemName: {
    fontSize: S.fontSizeMd,
  },
  itemPrice: {
    fontSize: S.fontSizeMd,
    fontWeight: 'bold',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
    paddingTop: 0,
  },
  summaryLabel: {
    fontSize: S.fontSizeMd,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: S.fontSizeMd,
    fontWeight: '700',
  },
  formSection: {
    borderRadius: S.borderRadiusLg,
    padding: S.spacingMd,
    marginBottom: S.spacingLg,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    fontWeight: 'bold',
    fontSize: S.fontSizeLg,
    marginBottom: 8,
  },
  formLabel: {
    fontSize: S.fontSizeMd,
    marginTop: S.spacingSm,
    marginBottom: 2,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: S.spacingSm,
    fontSize: 16,
  },
  radio: {
    borderWidth: 1.3,
    borderRadius: 16,
    paddingVertical: 7,
    paddingHorizontal: 17,
    marginRight: 10,
    backgroundColor: '#fff',
    marginBottom: 2,
    marginTop: 2,
    minWidth: 78,
    alignItems: 'center',
  },
  radioSelected: {
    elevation: 2,
    shadowColor: '#6366f1',
  },
  placeOrderButton: {
    borderRadius: 22,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 16,
    elevation: 2,
  },
  placeOrderGradient: {
    paddingVertical: 17,
    alignItems: 'center',
    borderRadius: 22,
  },
  placeOrderText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: S.fontSizeLg,
    letterSpacing: 0.18,
  },
});

export default Checkout;