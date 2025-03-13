import React, { useRef, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import ReanimatedDrawerLayout, {
  DrawerLayoutMethods,
  DrawerLockMode,
  DrawerPosition,
  DrawerType,
} from "react-native-gesture-handler/ReanimatedDrawerLayout";
import { SharedValue } from "react-native-reanimated";

import { LoremIpsum } from "@/components/Com";

export default function ReanimatedDrawerExample() {
  const drawerRef = useRef<DrawerLayoutMethods>(null);
  const [side, setSide] = useState(DrawerPosition.RIGHT);
  const [type, setType] = useState(DrawerType.FRONT);
  const [lock, setLock] = useState(DrawerLockMode.UNLOCKED);
  const { height, width } = Dimensions.get("window");

  return (
    <ReanimatedDrawerLayout
      ref={drawerRef}
      renderNavigationView={() => (
        <View className="border-2 flex h-full h-full items-center justify-center border-solid border-[red] bg-white">
          <Text>AAA</Text>
        </View>
      )}
      drawerPosition={DrawerPosition.RIGHT}
      drawerType={type}
      drawerLockMode={lock}
      hideStatusBar={true}
      drawerWidth={width}
    >
     
    </ReanimatedDrawerLayout>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "pink",
  },
  innerContainer: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  box: {
    width: 150,
    padding: 10,
    paddingHorizontal: 5,
    backgroundColor: "pink",
  },
});
