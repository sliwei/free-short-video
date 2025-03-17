import { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import InfinitePager, { Preset } from "react-native-infinite-pager";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { fetch } from "expo/fetch";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

interface Res<T = { [key: string]: any }> {
  code: number;
  msg: string;
  data: T;
}

const { height, width } = Dimensions.get("window");

const VideoWrapper = ({ playItem }: { playItem: any }) => {
  const bottomHeight = useBottomTabBarHeight();

  const player = useVideoPlayer(
    "http://192.168.31.93:3000" + playItem.url,
    (player) => {
      player.loop = true;
      player.play();
    },
  );

  const { status } = useEvent(player, "statusChange", {
    status: player.status,
  });
  console.log("status", status);

  return (
    <View
      style={{ height: height - bottomHeight, width }}
      className="border-[2px] border-[red]"
    >
      {status !== "readyToPlay" ? (
        <View className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
          <Text className="text-[20px] text-white">Loading...</Text>
        </View>
      ) : (
        <VideoView
          style={{ height: height - bottomHeight, width }}
          className="absolute left-0 top-0"
          player={player}
          // nativeControls={false}
          allowsFullscreen
          allowsPictureInPicture
        />
      )}
      <Text
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          color: "white",
          fontSize: 20,
        }}
      >
        {playItem.title}第{playItem.indexTitle}集
      </Text>
    </View>
  );
};

export default function HomeScreen() {
  const [allVideos, setAllVideos] = useState<any[]>([]);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const page = useRef(0);
  const isLastPage = useRef(false);
  const [playItem, setPlayItem] = useState<any>(null);

  useEffect(() => {
    fetchMoreData();
  }, []);

  useEffect(() => {
    console.log("visibleIndex", visibleIndex);
    setPlayItem(allVideos[visibleIndex]);
  }, [visibleIndex, allVideos]);

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
      body: JSON.stringify({ page: page.current }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res: Res<any>) => {
        console.log("res", res.data);
        isLastPage.current = res.data.isLastPage;
        setAllVideos([...allVideos, ...res.data.videos]);
        page.current += 1;
      });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <InfinitePager
        minIndex={0}
        onPageChange={(index) => {
          setVisibleIndex(index);
        }}
        renderPage={(props) => {
          if (playItem) {
            return <VideoWrapper playItem={playItem} />;
          }
          return (
            <View
              style={[
                styles.flex,
                {
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              <Text
                style={{ color: "white", fontSize: 80, fontWeight: "bold" }}
              >
                {props.index}
              </Text>
            </View>
          );
        }}
        style={styles.flex}
        pageWrapperStyle={styles.flex}
        preset={Preset.SLIDE}
        pageBuffer={4}
        vertical={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
