import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  Animated,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useCart } from "../components/CartContext";
import Cart from "../components/Cart";
import { Product, fetchProducts } from "../data/products";
import { useAppTheme } from "../constants/ThemeContext";
import { Colors } from "../constants/Colors";

const { width, height } = Dimensions.get("window");

const S = {
  borderRadius: 16,
  borderRadiusLarge: 28,
  spacingXs: 4,
  spacingSm: 8,
  spacingMd: 16,
  spacingLg: 24,
  spacingXl: 32,
  spacingXxl: 48,
  fontSizeXs: 12,
  fontSizeSm: 14,
  fontSizeMd: 16,
  fontSizeLg: 18,
  fontSizeXl: 20,
  fontSizeXxl: 24,
  fontSizeXxxl: 32,
  fontWeightNormal: "400" as const,
  fontWeightMedium: "500" as const,
  fontWeightSemiBold: "600" as const,
  fontWeightBold: "700" as const,
};

const ProductDetail: React.FC = () => {
  const { theme: appTheme } = useAppTheme();
  const systemColorScheme = useColorScheme();
  const themeName: 'light' | 'dark' = appTheme || (systemColorScheme === "dark" ? "dark" : "light");
  const colors = Colors[themeName];

  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "specifications">(
    "description"
  );
  const [showCart, setShowCart] = useState(false);
  const { addToCart } = useCart();

  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const slideAnim = useMemo(() => new Animated.Value(50), []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchProducts().then((products) => {
      const pid = typeof id === "string" ? parseInt(id) : parseInt(id[0]);
      const foundProduct = products.find((p) => p.id === pid);
      setProduct(foundProduct || null);
      setLoading(false);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [id, fadeAnim, slideAnim]);

  const renderStars = useCallback((rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={18} color={colors.secondary} />
      );
    }
    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={18} color={colors.secondary} />
      );
    }
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Ionicons
          key={`empty-${i}`}
          name="star-outline"
          size={18}
          color={colors.textLight}
        />
      );
    }
    return stars;
  }, [colors]);

  const handleAddToCart = useCallback(() => {
    if (product && product.inStock) {
      const cartProduct = {
        ...product,
        category: product.category_name,
      };
      addToCart(cartProduct, quantity);
      setShowCart(true);
    }
  }, [product, quantity, addToCart]);

  const handleBuyNow = useCallback(() => {
    if (product && product.inStock) {
      const cartProduct = {
        ...product,
        category: product.category_name,
      };
      addToCart(cartProduct, quantity);
      setShowCart(true);
    }
  }, [product, quantity, addToCart]);

  if (loading) {
    return (
      <LinearGradient colors={colors.cardGradient} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ color: colors.primary, marginTop: 12, fontSize: 18 }}>
              Loading product...
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }
  if (!product) {
    return (
      <LinearGradient colors={colors.cardGradient} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={64} color={colors.danger} />
            <Text style={styles.errorText}>Product not found</Text>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  return (
    <>
      <LinearGradient colors={colors.cardGradient} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar
            barStyle={themeName === "dark" ? "light-content" : "dark-content"}
            backgroundColor={colors.primary}
          />

          {/* Header */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={[styles.headerButton, { backgroundColor: colors.primary }]}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Product Details
            </Text>
            <TouchableOpacity
              style={[styles.headerButton, { backgroundColor: colors.primary }]}
            >
              <Ionicons name="heart-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </Animated.View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
            contentContainerStyle={{ paddingBottom: S.spacingXl + 60 }}
          >
            {/* Product Images */}
            <Animated.View
              style={[
                styles.imageSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                  backgroundColor: colors.card,
                },
              ]}
            >
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                  const index = Math.round(
                    event.nativeEvent.contentOffset.x / width
                  );
                  setSelectedImageIndex(index);
                }}
              >
                {productImages.map((imageUrl, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image
                      source={{ uri: imageUrl }}
                      style={styles.productImage}
                    />
                  </View>
                ))}
              </ScrollView>
              {productImages.length > 1 && (
                <View style={styles.imageIndicators}>
                  {productImages.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.indicator,
                        index === selectedImageIndex && styles.activeIndicator,
                        index === selectedImageIndex && { backgroundColor: colors.primary },
                      ]}
                    />
                  ))}
                </View>
              )}
              <View style={[styles.categoryBadge, { backgroundColor: colors.primary }]}>
                <Text style={[styles.categoryText, { color: "#fff" }]}>
                  {product.category_name}
                </Text>
              </View>
            </Animated.View>

            {/* Product Info */}
            <Animated.View
              style={[
                styles.productInfo,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={colors.cardGradient}
                style={styles.infoCard}
              >
                <Text
                  style={[
                    styles.productName,
                    {
                      color: colors.text,
                      fontFamily: "System",
                    },
                  ]}
                >
                  {product.name}
                </Text>
                <View style={styles.ratingPriceContainer}>
                  <View style={styles.ratingContainer}>
                    <View style={styles.starsContainer}>
                      {renderStars(product.rating)}
                    </View>
                    <Text style={[styles.ratingText, { color: colors.textLight }]}>
                      ({product.rating})
                    </Text>
                  </View>
                  <Text style={[styles.price, { color: colors.primary }]}>
                    ${product.price.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.stockContainer}>
                  <Ionicons
                    name={product.inStock ? "checkmark-circle" : "close-circle"}
                    size={18}
                    color={product.inStock ? colors.success : colors.danger}
                  />
                  <Text
                    style={[
                      styles.stockText,
                      {
                        color: product.inStock ? colors.success : colors.danger,
                      },
                    ]}
                  >
                    {product.inStock
                      ? `In Stock (${product.stockCount ?? 1} available)`
                      : "Out of Stock"}
                  </Text>
                </View>
                {/* Quantity Selector */}
                <View style={styles.quantityContainer}>
                  <Text style={[styles.quantityLabel, { color: colors.text }]}>
                    Quantity:
                  </Text>
                  <View
                    style={[
                      styles.quantitySelector,
                      { backgroundColor: colors.overlay },
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() => setQuantity(Math.max(1, quantity - 1))}
                      style={[
                        styles.quantityButton,
                        { backgroundColor: "#fff" },
                      ]}
                    >
                      <Ionicons name="remove" size={20} color={colors.primary} />
                    </TouchableOpacity>
                    <Text
                      style={[
                        styles.quantityText,
                        { color: colors.text, fontFamily: "System" },
                      ]}
                    >
                      {quantity}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        setQuantity(
                          Math.min(product.stockCount ?? 1, quantity + 1)
                        )
                      }
                      style={[
                        styles.quantityButton,
                        { backgroundColor: "#fff" },
                      ]}
                      disabled={quantity >= (product.stockCount ?? 1)}
                    >
                      <Ionicons name="add" size={20} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
                {/* Tabs */}
                <View
                  style={[
                    styles.tabContainer,
                    { backgroundColor: colors.overlay },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => setActiveTab("description")}
                    style={[
                      styles.tab,
                      activeTab === "description" && styles.activeTab,
                    ]}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        activeTab === "description" && [
                          styles.activeTabText,
                          { color: colors.primary },
                        ],
                      ]}
                    >
                      Description
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setActiveTab("specifications")}
                    style={[
                      styles.tab,
                      activeTab === "specifications" && styles.activeTab,
                    ]}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        activeTab === "specifications" && [
                          styles.activeTabText,
                          { color: colors.primary },
                        ],
                      ]}
                    >
                      Specifications
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* Tab Content */}
                <View style={styles.tabContent}>
                  {activeTab === "description" ? (
                    <View>
                      <Text
                        style={[
                          styles.description,
                          { color: colors.text, fontFamily: "System" },
                        ]}
                      >
                        {showFullDescription
                          ? product.fullDescription
                          : product.description}
                      </Text>
                      {product.fullDescription &&
                        product.fullDescription !== product.description && (
                          <TouchableOpacity
                            onPress={() =>
                              setShowFullDescription(!showFullDescription)
                            }
                          >
                            <Text
                              style={[
                                styles.showMoreText,
                                { color: colors.primary },
                              ]}
                            >
                              {showFullDescription ? "Show Less" : "Show More"}
                            </Text>
                          </TouchableOpacity>
                        )}
                    </View>
                  ) : (
                    <View style={styles.specificationsContainer}>
                      {product.specifications ? (
                        Object.entries(product.specifications).map(
                          ([key, value]) => (
                            <View key={key} style={styles.specificationRow}>
                              <Text
                                style={[
                                  styles.specKey,
                                  { color: colors.textLight },
                                ]}
                              >
                                {key}:
                              </Text>
                              <Text
                                style={[
                                  styles.specValue,
                                  { color: colors.text },
                                ]}
                              >
                                {value}
                              </Text>
                            </View>
                          )
                        )
                      ) : (
                        <Text
                          style={[
                            styles.noSpecsText,
                            { color: colors.textLight },
                          ]}
                        >
                          No specifications available
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              </LinearGradient>
            </Animated.View>
          </ScrollView>
          {/* Action Buttons */}
          <Animated.View
            style={[
              styles.actionButtons,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
                backgroundColor: colors.card,
                borderTopColor: colors.border,
                borderTopWidth: 1,
                shadowColor: colors.shadow,
              },
            ]}
          >
            <TouchableOpacity
              onPress={handleAddToCart}
              style={[styles.actionButton, styles.addToCartButton]}
              disabled={!product.inStock}
            >
              <LinearGradient
                colors={
                  product.inStock
                    ? [colors.primary, colors.secondary]
                    : [colors.textLight, colors.textLight]
                }
                style={styles.buttonGradient}
              >
                <Ionicons name="cart" size={20} color="#fff" />
                <Text style={styles.buttonText}>Add to Cart</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleBuyNow}
              style={[styles.actionButton, styles.buyNowButton]}
              disabled={!product.inStock}
            >
              <LinearGradient
                colors={
                  product.inStock
                    ? [colors.accent, colors.tint]
                    : [colors.textLight, colors.textLight]
                }
                style={styles.buttonGradient}
              >
                <Ionicons name="flash" size={20} color="#fff" />
                <Text style={styles.buttonText}>Buy Now</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
      <Cart visible={showCart} onClose={() => setShowCart(false)} />
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "transparent" },
  scrollView: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: S.spacingMd,
    paddingTop: S.spacingLg,
    paddingBottom: S.spacingMd,
    backgroundColor: "transparent",
  },
  headerButton: {
    padding: S.spacingSm,
    borderRadius: S.borderRadius,
    backgroundColor: "#667eea",
  },
  headerTitle: {
    fontSize: S.fontSizeXl,
    fontWeight: S.fontWeightBold,
    textAlign: "center",
    flex: 1,
  },
  imageSection: {
    position: "relative",
    height: height * 0.36,
    marginBottom: S.spacingMd,
    borderRadius: S.borderRadiusLarge,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  imageContainer: {
    width: width,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  imageIndicators: {
    position: "absolute",
    bottom: S.spacingMd,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#a0aec0",
    marginHorizontal: S.spacingXs,
    opacity: 0.7,
  },
  activeIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: "#fff",
    opacity: 1,
  },
  categoryBadge: {
    position: "absolute",
    top: S.spacingMd,
    left: S.spacingMd,
    borderRadius: S.borderRadius,
    paddingHorizontal: S.spacingMd,
    paddingVertical: S.spacingSm,
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  categoryText: {
    fontSize: S.fontSizeSm,
    fontWeight: S.fontWeightSemiBold,
    textTransform: "capitalize",
  },
  productInfo: {
    paddingHorizontal: S.spacingMd,
    marginBottom: S.spacingXxl,
  },
  infoCard: {
    borderRadius: S.borderRadiusLarge,
    padding: S.spacingLg,
    elevation: 7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    backgroundColor: "transparent",
  },
  productName: {
    fontSize: S.fontSizeXxxl,
    fontWeight: S.fontWeightBold,
    marginBottom: S.spacingMd,
    lineHeight: 38,
    letterSpacing: 0.4,
  },
  ratingPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: S.spacingMd,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
    marginRight: S.spacingSm,
  },
  ratingText: {
    fontSize: S.fontSizeSm,
    fontWeight: S.fontWeightMedium,
  },
  price: {
    fontSize: S.fontSizeXxl,
    fontWeight: S.fontWeightBold,
    letterSpacing: 0.3,
  },
  stockContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: S.spacingLg,
  },
  stockText: {
    fontSize: S.fontSizeSm,
    fontWeight: S.fontWeightSemiBold,
    marginLeft: S.spacingSm,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: S.spacingLg,
    marginTop: S.spacingSm,
  },
  quantityLabel: {
    fontSize: S.fontSizeMd,
    fontWeight: S.fontWeightSemiBold,
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: S.borderRadius,
    padding: S.spacingXs,
    minWidth: 110,
    justifyContent: "center",
  },
  quantityButton: {
    padding: S.spacingSm,
    borderRadius: S.spacingSm,
    backgroundColor: "#fff",
    elevation: 1,
  },
  quantityText: {
    fontSize: S.fontSizeMd,
    fontWeight: S.fontWeightSemiBold,
    marginHorizontal: S.spacingMd,
    minWidth: 30,
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    borderRadius: S.borderRadius,
    padding: S.spacingXs,
    marginBottom: S.spacingMd,
    marginTop: S.spacingMd,
  },
  tab: {
    flex: 1,
    paddingVertical: S.spacingSm,
    paddingHorizontal: S.spacingMd,
    borderRadius: S.spacingSm,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  tabText: {
    fontSize: S.fontSizeSm,
    fontWeight: S.fontWeightMedium,
    letterSpacing: 0.1,
  },
  activeTabText: {
    fontWeight: S.fontWeightBold,
  },
  tabContent: {
    minHeight: 100,
  },
  description: {
    fontSize: S.fontSizeMd,
    lineHeight: 24,
    marginBottom: S.spacingSm,
  },
  showMoreText: {
    fontSize: S.fontSizeSm,
    fontWeight: S.fontWeightSemiBold,
    marginTop: 4,
    textDecorationLine: "underline",
  },
  specificationsContainer: {
    gap: S.spacingSm,
  },
  specificationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: S.spacingSm,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  specKey: {
    fontSize: S.fontSizeSm,
    fontWeight: S.fontWeightMedium,
    flex: 1,
  },
  specValue: {
    fontSize: S.fontSizeSm,
    fontWeight: S.fontWeightSemiBold,
    textAlign: "right",
    flex: 1,
  },
  noSpecsText: {
    fontSize: S.fontSizeSm,
    textAlign: "center",
    fontStyle: "italic",
  },
  actionButtons: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: S.spacingMd,
    elevation: 8,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    zIndex: 100,
  },
  actionButton: {
    flex: 1,
    borderRadius: S.borderRadiusLarge,
    overflow: "hidden",
  },
  addToCartButton: {
    marginRight: S.spacingSm,
  },
  buyNowButton: {
    marginLeft: S.spacingSm,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: S.spacingMd,
    paddingHorizontal: S.spacingLg,
  },
  buttonText: {
    color: "#fff",
    fontSize: S.fontSizeMd,
    fontWeight: S.fontWeightBold,
    marginLeft: S.spacingSm,
    letterSpacing: 0.2,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: S.spacingXl,
  },
  errorText: {
    fontSize: S.fontSizeXl,
    color: "#fff",
    fontWeight: S.fontWeightBold,
    marginTop: S.spacingMd,
    marginBottom: S.spacingLg,
  },
  backButton: {
    backgroundColor: "#fff",
    paddingHorizontal: S.spacingLg,
    paddingVertical: S.spacingMd,
    borderRadius: S.borderRadius,
    marginTop: S.spacingMd,
  },
  backButtonText: {
    color: "#667eea",
    fontSize: S.fontSizeMd,
    fontWeight: S.fontWeightSemiBold,
  },
});

export default ProductDetail;