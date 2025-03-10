import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <View className="m-1">
        <Text className="text-2xl font-bold">Welcome to Login!</Text>
      </View>
    </SafeAreaView>
  );
}
