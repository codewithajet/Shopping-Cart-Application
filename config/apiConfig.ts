import { Platform } from "react-native";

export function getApiBaseUrl() {
  if (Platform.OS === "android") {
    // Android emulator AND physical device (with adb reverse)
    return "https://shopping-cart-5wj4.onrender.com";
  }
  // iOS simulator/device: use your computer's LAN IP
  return "https://shopping-cart-5wj4.onrender.com";
}
