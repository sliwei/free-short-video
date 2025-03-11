import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  Platform,
  Pressable,
  View,
} from "react-native";
import { useEvent, useEventListener } from "expo";
import { Image } from "expo-image";
import { useFocusEffect } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import * as VideoThumbnails from "expo-video-thumbnails";
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

const v1 = require("@/assets/video/1.mp4");
const v2 = require("@/assets/video/2.mp4");
const v3 = require("@/assets/video/3.mp4");
const v4 = require("@/assets/video/4.mp4");
const v5 = require("@/assets/video/5.mp4");

const videos = (page = 0) => {
  // local
  return [v1, v2, v3, v4, v5];
  // remote
  // return [
  //   `http://192.168.125.116:3000/v1/${5 * page + 1}.mp4`,
  //   `http://192.168.125.116:3000/v1/${5 * page + 2}.mp4`,
  //   `http://192.168.125.116:3000/v1/${5 * page + 3}.mp4`,
  //   `http://192.168.125.116:3000/v1/${5 * page + 4}.mp4`,
  //   `http://192.168.125.116:3000/v1/${5 * page + 5}.mp4`,
  // ];
};

const { height, width } = Dimensions.get("window");

interface VideoWrapper {
  data: ListRenderItemInfo<string>;
  visibleIndex: number;
  pause: () => void;
  share: (videoURL: string) => void;
  paused: boolean;
}

const VideoWrapper = ({
  data,
  visibleIndex,
  pause,
  paused,
  share,
}: VideoWrapper) => {
  const bottomHeight = useBottomTabBarHeight();
  const { index, item } = data;
  const [image, setImage] = useState("");

  const generateThumbnail = async () => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(item, {
        time: 15000,
      });
      setImage(uri);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    generateThumbnail();
  }, [item]);

  const player = useVideoPlayer(item, (player) => {
    // console.log("uri", index, item);
    if (visibleIndex === index && !paused) {
      player.loop = false;
      player.play();
    }
  });

  const { status } = useEvent(player, "statusChange", {
    status: player.status,
  });
  // console.log("status", index, status);

  useEventListener(player, "playToEnd", () => {
    if (visibleIndex === index && !paused) {
      console.log("R 重播", index, item);
      player.loop = true;
      player.play();
    } else {
      console.log("E 结束", index, item);
      player.loop = false;
    }
  });

  useEffect(() => {
    if (!player) {
      return;
    }
    if (visibleIndex === index && !paused && !player.playing) {
      console.log("S 播放", index, item);
      player.play();
    }
    if (player.playing && (visibleIndex !== index || paused)) {
      console.log("P 暂停", index, item);
      player.pause();
    }
  }, [visibleIndex, index, paused, player]);

  return (
    <View style={{ height: height - bottomHeight, width }}>
      <VideoView
        style={{ height: height - bottomHeight, width }}
        className="absolute left-0 top-0"
        player={player}
        // nativeControls={false}
        allowsFullscreen
        allowsPictureInPicture
      />
      {image && !paused && status === "loading" && (
        <Image
          style={{
            flex: 1,
            width: "100%",
          }}
          source={{ uri: image }}
          contentFit="contain"
          transition={1000}
        />
      )}
      {/* <Pressable onPress={pause} className="absolute h-full w-full">
        {paused && (
          <Ionicons
            // style={{ position: "absolute", alignSelf: "center", top: "50%" }}
            className="absolute top-1/2 self-center"
            name="play"
            size={70}
            color="rgba(255, 255, 255, 0.6)"
          />
        )}
      </Pressable> */}

      {/* <Pressable onPress={() => share(item)} style={$shareButtonContainer}>
        <Image source="share" style={$shareButtonImage} />
        <Text style={$shareButtonText}>Share</Text>
      </Pressable> */}
    </View>
  );
};

export default function HomeScreen() {
  const bottomHeight = useBottomTabBarHeight();

  const [allVideos, setAllVideos] = useState([
    // "http://192.168.125.116:3000/v1/000.mp4",
    // "http://192.168.125.116:3000/m3u8/5d81aabdaae7494c82a61eb47dc37454.m3u8",
    ...videos(),
  ]);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const lastPlayStatus = useRef(paused);
  const page = useRef(0);

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
    page.current += 1;
    setAllVideos([...allVideos, ...videos(page.current)]);
  };

  const onViewableItemsChanged = (event: any) => {
    const newIndex = Number(event.viewableItems.at(-1).key);
    setVisibleIndex(Platform.OS === "android" ? newIndex - 1 : newIndex);
    setPaused(false);
  };

  const pause = () => {
    setPaused(!paused);
  };

  const share = (videoURL: string) => {
    // setPaused(true);
    // setTimeout(() => {
    //   Share.share({
    //     title: "Share This Video",
    //     message: `Check out: ${videoURL}`,
    //   });
    // }, 100);
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
        renderItem={(data) => {
          return (
            <VideoWrapper
              data={data}
              visibleIndex={visibleIndex}
              pause={pause}
              share={share}
              paused={paused}
            />
          );
        }}
      />
    </View>
  );
}
