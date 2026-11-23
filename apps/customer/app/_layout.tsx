import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthGate } from "../components/auth-gate";
export default function RootLayout() {
  return <AuthGate expectedRole="customer"><><StatusBar style="dark" /><Stack screenOptions={{ headerShown: false }} /></></AuthGate>;
}
