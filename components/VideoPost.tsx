import { useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEvent } from "expo";
import { LinearGradient } from "expo-linear-gradient";
import { useVideoPlayer, VideoView } from "expo-video";
import { Ionicons } from "@expo/vector-icons";

type VideoPost = {
  post: {
    id: string;
    video: string;
    caption: string;
  };
  activePostId: string;
};

const VideoPost = ({ post, activePostId }: VideoPost) => {
  console.log(post);

  const { height } = useWindowDimensions();

  const player = useVideoPlayer(post.video, (player) => {
    player.loop = true;
    player.play();
    console.log("player", player);
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  useEffect(() => {
    if (!player) {
      return;
    }
    if (activePostId !== post.id) {
      player.pause();
    }
    if (activePostId === post.id) {
      player.play();
    }
  }, [activePostId, player]);

  return (
    <View style={[styles.container, { height: height }]}>
      <VideoView
        style={[StyleSheet.absoluteFill, styles.video]}
        player={player}
        nativeControls
        allowsFullscreen
        allowsPictureInPicture
      />

      <Pressable
        onPress={() => {
          if (isPlaying) {
            player.pause();
          } else {
            player.play();
          }
        }}
        style={styles.content}
      >
        {/* <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={[StyleSheet.absoluteFillObject, styles.overlay]}
        /> */}
        {!isPlaying && (
          <Ionicons
            style={{ position: "absolute", alignSelf: "center", top: "50%" }}
            name="play"
            size={70}
            color="rgba(255, 255, 255, 0.6)"
          />
        )}
        {/* <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.footer}>
            <View style={styles.leftColumn}>
              <Text style={styles.caption}>{post.caption}</Text>
            </View>

            <View style={styles.rightColumn}>
              <Ionicons name="heart" size={35} color="white" />
              <Ionicons name="share-social-sharp" size={35} color="white" />
              <Ionicons name="bookmark" size={35} color="white" />
            </View>
          </View>
        </SafeAreaView> */}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  video: {},
  content: {
    flex: 1,
    padding: 10,
  },
  overlay: {
    top: "50%",
  },
  footer: {
    marginTop: "auto",
    flexDirection: "row",
    alignItems: "flex-end",
  },
  leftColumn: {
    flex: 1,
  },
  caption: {
    color: "white",
    fontFamily: "Inter",
    fontSize: 18,
  },
  rightColumn: {
    gap: 10,
  },
});

export default VideoPost;
