import React, { useRef, useCallback, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import InfinitePager, { Preset } from 'react-native-infinite-pager';
const NUM_ITEMS = 5;

function getColor(i: number) {
  const multiplier = 255 / (NUM_ITEMS - 1);
  const colorVal = Math.abs(i) * multiplier;
  return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
}

export default function App() {
  const [preset, setPreset] = useState<Preset>(Preset.SLIDE);
  const pagerRef = useRef(null);

  const renderPage = useCallback(({ index }: { index: number }) => {
    return (
      <View
        style={[
          styles.flex,
          {
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: getColor(index),
          },
        ]}>
        <Text style={{ color: 'white', fontSize: 80, fontWeight: 'bold' }}>
          {index}
        </Text>
      </View>
    );
  }, []);

  return (
    <GestureHandlerRootView
      style={[styles.flex, { backgroundColor: 'seashell' }]}>
      <InfinitePager
        key={`infinite-pager-${preset}`}
        ref={pagerRef}
        renderPage={renderPage}
        style={styles.flex}
        pageWrapperStyle={styles.flex}
        preset={preset}
        pageBuffer={4}
        vertical={true}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
