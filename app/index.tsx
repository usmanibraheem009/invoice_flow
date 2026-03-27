import { router } from "expo-router";
import { Button, View } from "react-native";
import LoginScreen from "./screens/login-screen";

export default function Index() {
  return (
    <View>
      <LoginScreen />
      <Button title="login" onPress={() => router.push('/(tabs)')} />
    </View>
  );
}
