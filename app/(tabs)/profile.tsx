import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <View className="flex items-center justify-center">
        <Link href="/login" className="mt-[20] text-[20px] text-blue-700">
          <Text>Login</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
}
