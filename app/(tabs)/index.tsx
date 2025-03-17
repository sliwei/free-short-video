import { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, Platform, Text, View } from "react-native";
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useEvent } from "expo";
import { useFocusEffect } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { fetch } from "expo/fetch";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

interface Res<T = { [key: string]: any }> {
  code: number;
  msg: string;
  data: T;
}

const { height, width } = Dimensions.get("window");

interface VideoWrapper {
  index: number;
  data: any;
  visibleIndex: number;
  paused: boolean;
}

const VideoWrapper = ({ index, data, visibleIndex, paused }: VideoWrapper) => {
  const bottomHeight = useBottomTabBarHeight();
  const { title, number, indexTitle, poster, url, index: vIndex } = data;
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const player = useVideoPlayer("http://192.168.31.93:3000" + url, (player) => {
    // console.log("uri", index, item);
    if (visibleIndex === index && !paused) {
      player.loop = false;
      player.play();
    }
  });

  const { status } = useEvent(player, "statusChange", {
    status: player.status,
  });

  // useEventListener(player, "playToEnd", () => {
  //   if (visibleIndex === index && !paused) {
  //     console.log("R 重播", index, url);
  //     player.loop = true;
  //     player.play();
  //   } else {
  //     console.log("E 结束", index, url);
  //     player.loop = false;
  //   }
  // });

  useEffect(() => {
    if (!player) {
      return;
    }
    if (visibleIndex === index && !paused && !player.playing) {
      console.log("S 播放", index, url);
      player.play();
    }
    if (player.playing && (visibleIndex !== index || paused)) {
      console.log("P 暂停", index, url);
      player.pause();
    }
  }, [visibleIndex, index, paused, player]);

  return (
    <View style={{ height: height - bottomHeight, width }} className="pt-[40] border-[1px] border-[#000]">
      <VideoView
        style={{ height: height - bottomHeight - 40, width }}
        className="absolute left-0 top-0"
        player={player}
        // nativeControls={false}
        allowsFullscreen
        allowsPictureInPicture
      />
      {status !== 'readyToPlay' && <View className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
        <Text className="text-[20px] text-[#666]">loading...</Text>
      </View>}
      <Text className="absolute bottom-[30] left-[8] right-[8] text-[16px] text-[#999]">
        {title}第{indexTitle}集
      </Text>
    </View>
  );
};

export default function HomeScreen() {
  const bottomHeight = useBottomTabBarHeight();
  const [allVideos, setAllVideos] = useState<string[]>([]);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const lastPlayStatus = useRef(paused);
  const page = useRef(0);
  const indexs = useRef([]);
  const isLastPage = useRef(false);

  useEffect(() => {
    fetchMoreData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setPaused(lastPlayStatus.current);

      return () => {
        lastPlayStatus.current = paused;
        setPaused((v) => {
          lastPlayStatus.current = v;
          return true;
        });
      };
    }, []),
  );

  const fetchMoreData = () => {
    if (isLastPage.current) {
      console.log("没有更多数据了");
      return;
    }
    fetch("http://192.168.31.93:3000/api/video/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ page: page.current, indexs: indexs.current }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res: Res<any>) => {
        console.log("res", res.data);
        isLastPage.current = res.data.isLastPage;
        setAllVideos([...allVideos, ...res.data.videos]);
        page.current += 1;
        indexs.current = res.data.indexs;
        console.log('indexs.current', indexs.current)
      });
  };

  const onViewableItemsChanged = (event: any) => {
    const newIndex = Number(event.viewableItems.at(-1).key);
    setVisibleIndex(Platform.OS === "android" ? newIndex - 1 : newIndex);
    setPaused(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <FlatList
        pagingEnabled
        snapToInterval={
          Platform.OS === "android" ? height - bottomHeight : undefined
        }
        initialNumToRender={1}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        data={allVideos}
        onEndReachedThreshold={0.3}
        onEndReached={fetchMoreData}
        windowSize={3}
        renderItem={(data) => {
          if (visibleIndex > data.index + 1 || visibleIndex < data.index - 1) {
            return <View style={{ height: height - bottomHeight }} />;
          }
          return (
            <VideoWrapper
              index={data.index}
              data={data.item}
              visibleIndex={visibleIndex}
              paused={paused}
            />
          );
        }}
      />
    </View>
  );
}
