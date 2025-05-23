import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CartItem from './CartItem';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  rating: number;
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  onAddItem: (item: CartItem) => void;
  onRemoveItem: (itemId: number) => void;
  total: number;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

const Cart: React.FC<CartProps> = ({ items, onAddItem, onRemoveItem, total, onClose }) => {
  const slideAnim = React.useRef(new Animated.Value(width)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert(
        '🛒 Empty Cart', 
        'Please add some items to your cart before checkout.',
        [{ text: 'Continue Shopping', style: 'default' }]
      );
      return;
    }
    
    Alert.alert(
      '🎉 Checkout Confirmation',
      `Ready to complete your purchase?\n\n💰 Total: $${(total + total * 0.085).toFixed(2)}\n📦 ${totalItems} items`,
      [
        { text: 'Keep Shopping', style: 'cancel' },
        { 
          text: 'Complete Order', 
          style: 'default',
          onPress: () => {
            Alert.alert(
              '✅ Order Confirmed!', 
              'Thank you for your purchase! Your order will be delivered within 2-3 business days.',
              [{ text: 'Amazing!', onPress: onClose }]
            );
          }
        },
      ]
    );
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  const handleIncrease = (item: CartItem) => {
    onAddItem(item);
  };

  const handleDecrease = (itemId: number) => {
    onRemoveItem(itemId);
  };

  const renderCartItem = ({ item, index }: { item: CartItem; index: number }) => (
    <Animated.View
      style={[
        styles.cartItemWrapper,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        },
      ]}
    >
      <CartItem
        item={item}
        onIncrease={() => handleIncrease(item)}
        onDecrease={() => handleDecrease(item.id)}
      />
    </Animated.View>
  );

  const renderEmptyCart = () => (
    <Animated.View style={[styles.emptyCart, { opacity: fadeAnim }]}>
      <View style={styles.emptyIconContainer}>
        <LinearGradient
          colors={[colors.primaryLight, colors.primary]}
          style={styles.emptyIconGradient}
        >
          <Ionicons name="bag-outline" size={64} color={colors.backgroundCard} />
        </LinearGradient>
      </View>
      <Text style={styles.emptyCartTitle}>Your cart awaits</Text>
      <Text style={styles.emptyCartSubtitle}>
        Discover amazing products and start your shopping journey
      </Text>
      <TouchableOpacity style={styles.continueShoppingButton} onPress={handleClose}>
        <LinearGradient
          colors={[colors.secondary, colors.secondaryDark]}
          style={styles.buttonGradient}
        >
          <Ionicons name="storefront" size={20} color={colors.backgroundCard} style={styles.buttonIcon} />
          <Text style={styles.continueShoppingText}>Start Shopping</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const taxAmount = total * 0.085;
  const finalTotal = total + taxAmount;
  const savings = totalItems > 3 ? total * 0.1 : 0; // 10% discount for 4+ items

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          transform: [{ translateX: slideAnim }],
          opacity: fadeAnim,
        },
      ]}
    >
      {/* Elegant Header with Gradient */}
      <LinearGradient
        colors={[colors.backgroundCard, colors.backgroundHover]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleClose} style={styles.backButton}>
            <View style={styles.backButtonCircle}>
              <Ionicons name="arrow-back" size={20} color={colors.primary} />
            </View>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Shopping Cart</Text>
            <View style={styles.headerSubtitleContainer}>
              <Ionicons name="cube" size={14} color={colors.textLight} />
              <Text style={styles.headerSubtitle}>
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </Text>
              {totalItems > 0 && (
                <>
                  <Text style={styles.headerDivider}>•</Text>
                  <Text style={styles.headerValue}>${total.toFixed(2)}</Text>
                </>
              )}
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Cart Content */}
      {items.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <FlatList
            data={items}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.cartList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.cartListContent}
          />

          {/* Premium Footer with Glass Effect */}
          <View style={styles.footerContainer}>
            {/* Savings Banner */}
            {savings > 0 && (
              <Animated.View style={[styles.savingsBanner, { opacity: fadeAnim }]}>
                <LinearGradient
                  colors={[colors.secondaryLight + '20', colors.secondary + '20']}
                  style={styles.savingsGradient}
                >
                  <Ionicons name="gift" size={16} color={colors.secondary} />
                  <Text style={styles.savingsText}>
                    🎉 You saved ${savings.toFixed(2)} with bulk discount!
                  </Text>
                </LinearGradient>
              </Animated.View>
            )}

            {/* Order Summary */}
            <View style={styles.orderSummary}>
              <View style={styles.summaryHeader}>
                <Text style={styles.summaryTitle}>Order Summary</Text>
                <View style={styles.secureIndicator}>
                  <Ionicons name="shield-checkmark" size={12} color={colors.primary} />
                  <Text style={styles.secureText}>Secure</Text>
                </View>
              </View>

              <View style={styles.totalContainer}>
                <View style={styles.totalRow}>
                  <Text style={styles.subtotalLabel}>Subtotal ({totalItems} items)</Text>
                  <Text style={styles.subtotalAmount}>${total.toFixed(2)}</Text>
                </View>
                
                {savings > 0 && (
                  <View style={styles.totalRow}>
                    <Text style={styles.discountLabel}>Bulk Discount</Text>
                    <Text style={styles.discountAmount}>-${savings.toFixed(2)}</Text>
                  </View>
                )}
                
                <View style={styles.totalRow}>
                  <Text style={styles.taxLabel}>Tax & Fees</Text>
                  <Text style={styles.taxAmount}>${taxAmount.toFixed(2)}</Text>
                </View>
                
                <View style={styles.divider} />
                
                <View style={[styles.totalRow, styles.finalTotalRow]}>
                  <View>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalSubtext}>Including all taxes</Text>
                  </View>
                  <Text style={styles.totalAmount}>${(finalTotal - savings).toFixed(2)}</Text>
                </View>
              </View>

              {/* Premium Checkout Button */}
              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={handleCheckout}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={[colors.secondary, colors.secondaryDark]}
                  style={styles.checkoutGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.checkoutContent}>
                    <Ionicons name="card" size={20} color={colors.backgroundCard} />
                    <Text style={styles.checkoutButtonText}>Secure Checkout</Text>
                    <View style={styles.checkoutPriceContainer}>
                      <Text style={styles.checkoutPrice}>${(finalTotal - savings).toFixed(2)}</Text>
                    </View>
                  </View>
                  <View style={styles.checkoutShine} />
                </LinearGradient>
              </TouchableOpacity>

              {/* Trust Indicators */}
              <View style={styles.trustIndicators}>
                <View style={styles.trustItem}>
                  <Ionicons name="shield-checkmark" size={16} color={colors.primary} />
                  <Text style={styles.trustText}>Secure Payment</Text>
                </View>
                <View style={styles.trustItem}>
                  <Ionicons name="refresh" size={16} color={colors.primary} />
                  <Text style={styles.trustText}>Easy Returns</Text>
                </View>
                <View style={styles.trustItem}>
                  <Ionicons name="flash" size={16} color={colors.primary} />
                  <Text style={styles.trustText}>Fast Delivery</Text>
                </View>
              </View>
            </View>
          </View>
        </>
      )}
    </Animated.View>
  );
};

// Enhanced Color Palette
const colors = {
  primary: '#3f51b5',
  primaryLight: '#757de8',
  primaryDark: '#002984',
  secondary: '#ff4081',
  secondaryLight: '#ff79b0',
  secondaryDark: '#c60055',
  textColor: '#333',
  textLight: '#666',
  textLighter: '#888',
  backgroundMain: '#f5f7fa',
  backgroundCard: '#fff',
  backgroundHover: '#f0f2f5',
  borderColor: '#e1e4e8',
  borderRadius: 12,
  borderRadiusLg: 16,
  spacingXs: 4,
  spacingSm: 8,
  spacingMd: 16,
  spacingLg: 24,
  spacingXl: 32,
  fontSizeXs: 12,
  fontSizeSm: 14,
  fontSizeMd: 16,
  fontSizeLg: 18,
  fontSizeXl: 20,
  fontSizeXxl: 24,
  fontWeightMedium: '500' as const,
  fontWeightBold: '700' as const,
  fontWeightExtraBold: '800' as const,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  header: {
    paddingTop: 10,
    paddingBottom: colors.spacingLg,
    borderBottomLeftRadius: colors.borderRadiusLg,
    borderBottomRightRadius: colors.borderRadiusLg,
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: colors.spacingLg,
  },
  backButton: {
    marginRight: colors.spacingMd,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: colors.fontSizeXxl,
    fontWeight: colors.fontWeightExtraBold,
    color: colors.textColor,
    marginBottom: 2,
  },
  headerSubtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: colors.fontSizeSm,
    color: colors.textLight,
    marginLeft: colors.spacingXs,
  },
  headerDivider: {
    fontSize: colors.fontSizeSm,
    color: colors.textLighter,
    marginHorizontal: colors.spacingSm,
  },
  headerValue: {
    fontSize: colors.fontSizeSm,
    fontWeight: colors.fontWeightBold,
    color: colors.primary,
  },
  cartList: {
    flex: 1,
  },
  cartListContent: {
    paddingHorizontal: colors.spacingMd,
    paddingTop: colors.spacingLg,
  },
  cartItemWrapper: {
    marginBottom: colors.spacingMd,
  },
  footerContainer: {
    backgroundColor: colors.backgroundCard,
    borderTopLeftRadius: colors.borderRadiusLg,
    borderTopRightRadius: colors.borderRadiusLg,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  savingsBanner: {
    margin: colors.spacingLg,
    marginBottom: 0,
    borderRadius: colors.borderRadius,
    overflow: 'hidden',
  },
  savingsGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: colors.spacingMd,
  },
  savingsText: {
    fontSize: colors.fontSizeSm,
    fontWeight: colors.fontWeightMedium,
    color: colors.secondary,
    marginLeft: colors.spacingSm,
  },
  orderSummary: {
    padding: colors.spacingLg,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: colors.spacingLg,
  },
  summaryTitle: {
    fontSize: colors.fontSizeLg,
    fontWeight: colors.fontWeightBold,
    color: colors.textColor,
  },
  secureIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '10',
    paddingHorizontal: colors.spacingSm,
    paddingVertical: colors.spacingXs,
    borderRadius: 12,
  },
  secureText: {
    fontSize: colors.fontSizeXs,
    fontWeight: colors.fontWeightMedium,
    color: colors.primary,
    marginLeft: colors.spacingXs,
  },
  totalContainer: {
    marginBottom: colors.spacingLg,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: colors.spacingSm,
  },
  finalTotalRow: {
    paddingTop: colors.spacingMd,
  },
  subtotalLabel: {
    fontSize: colors.fontSizeMd,
    color: colors.textLight,
  },
  subtotalAmount: {
    fontSize: colors.fontSizeMd,
    fontWeight: colors.fontWeightMedium,
    color: colors.textColor,
  },
  discountLabel: {
    fontSize: colors.fontSizeMd,
    color: colors.secondary,
  },
  discountAmount: {
    fontSize: colors.fontSizeMd,
    fontWeight: colors.fontWeightMedium,
    color: colors.secondary,
  },
  taxLabel: {
    fontSize: colors.fontSizeMd,
    color: colors.textLight,
  },
  taxAmount: {
    fontSize: colors.fontSizeMd,
    fontWeight: colors.fontWeightMedium,
    color: colors.textColor,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderColor,
    marginVertical: colors.spacingSm,
  },
  totalLabel: {
    fontSize: colors.fontSizeLg,
    fontWeight: colors.fontWeightExtraBold,
    color: colors.textColor,
  },
  totalSubtext: {
    fontSize: colors.fontSizeXs,
    color: colors.textLight,
    marginTop: 2,
  },
  totalAmount: {
    fontSize: colors.fontSizeXxl,
    fontWeight: colors.fontWeightExtraBold,
    color: colors.primary,
  },
  checkoutButton: {
    marginBottom: colors.spacingMd,
    borderRadius: colors.borderRadiusLg,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  checkoutGradient: {
    position: 'relative',
    overflow: 'hidden',
  },
  checkoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: colors.spacingLg,
    paddingHorizontal: colors.spacingXl,
  },
  checkoutButtonText: {
    color: colors.backgroundCard,
    fontSize: colors.fontSizeLg,
    fontWeight: colors.fontWeightBold,
    marginLeft: colors.spacingSm,
    flex: 1,
    textAlign: 'center',
  },
  checkoutPriceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: colors.spacingMd,
    paddingVertical: colors.spacingSm,
    borderRadius: colors.borderRadius,
  },
  checkoutPrice: {
    color: colors.backgroundCard,
    fontSize: colors.fontSizeMd,
    fontWeight: colors.fontWeightBold,
  },
  checkoutShine: {
    position: 'absolute',
    top: 0,
    left: -100,
    width: 50,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ skewX: '-20deg' }],
  },
  trustIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: colors.spacingMd,
    borderTopWidth: 1,
    borderTopColor: colors.borderColor,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trustText: {
    fontSize: colors.fontSizeXs,
    color: colors.textLight,
    marginLeft: colors.spacingXs,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: colors.spacingXl,
  },
  emptyIconContainer: {
    marginBottom: colors.spacingLg,
  },
  emptyIconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  emptyCartTitle: {
    fontSize: colors.fontSizeXxl + 4,
    fontWeight: colors.fontWeightExtraBold,
    color: colors.textColor,
    marginBottom: colors.spacingSm,
    textAlign: 'center',
  },
  emptyCartSubtitle: {
    fontSize: colors.fontSizeMd,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: colors.spacingXl,
  },
  continueShoppingButton: {
    borderRadius: colors.borderRadiusLg,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: colors.spacingXl,
    paddingVertical: colors.spacingLg,
  },
  buttonIcon: {
    marginRight: colors.spacingSm,
  },
  continueShoppingText: {
    color: colors.backgroundCard,
    fontSize: colors.fontSizeLg,
    fontWeight: colors.fontWeightBold,
  },
});

export default Cart;