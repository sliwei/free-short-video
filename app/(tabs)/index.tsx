import { useEffect, useRef, useState } from "react";
import { FlatList, useWindowDimensions, View } from "react-native";

import VideoPost from "@/components/VideoPost";

const v1 = require("@/assets/video/1.mp4");
const v2 = require("@/assets/video/2.mp4");
const v3 = require("@/assets/video/3.mp4");
const v4 = require("@/assets/video/4.mp4");
const v5 = require("@/assets/video/5.mp4");

const dummyPosts = [
  {
    id: "2",
    video: v1, // "https://bstu.oss-cn-shenzhen.aliyuncs.com/video/2.mp4",
    caption: "AAA 帖子标题",
  },
  {
    id: "1",
    video: v2, // "https://bstu.oss-cn-shenzhen.aliyuncs.com/video/1.mp4",
    caption: "AAA 嘿",
  },
  {
    id: "3",
    video: v3, // "https://bstu.oss-cn-shenzhen.aliyuncs.com/video/3.mp4",
    caption: "AAA 你好",
  },
  {
    id: "4",
    video: v4, // "https://bstu.oss-cn-shenzhen.aliyuncs.com/video/4.mp4",
    caption: "AAA 钢琴练习",
  },
  {
    id: "5",
    video: v5, // "https://bstu.oss-cn-shenzhen.aliyuncs.com/video/5.mp4",
    caption: "AAA 世界您好！",
  },
];

const Index = () => {
  const [activePostId, setActivePostId] = useState(dummyPosts[0].id);
  const [posts, setPosts] = useState<typeof dummyPosts>([]);
  const { height } = useWindowDimensions();

  useEffect(() => {
    const fetchPosts = async () => {
      // fetch posts from the server
      setPosts(dummyPosts);
    };

    fetchPosts();
  }, []);

  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig: { itemVisiblePercentThreshold: 50 },
      onViewableItemsChanged: ({ changed, viewableItems }) => {
        if (viewableItems.length > 0 && viewableItems[0].isViewable) {
          setActivePostId(viewableItems[0].item.id);
        }
      },
    },
  ]);

  const onEndReached = () => {
    setPosts((currentPosts) => [...currentPosts, ...dummyPosts]);
  };

  return (
    <View className="flex bg-black">
      <FlatList
        className="flex"
        data={posts}
        style={{ height: height }}
        renderItem={({ item }) => (
          <VideoPost post={item} activePostId={activePostId} />
        )}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        pagingEnabled
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={3}
      />
    </View>
  );
};

export default Index;
