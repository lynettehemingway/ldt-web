// app/(tabs)/index.tsx
import { ResizeMode, Video } from 'expo-av';
import React, { useEffect, useRef } from 'react';
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Header from '../../components/Header';

export default function HomeScreen() {
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    videoRef.current?.playAsync();
  }, []);

  const screenWidth = Dimensions.get('window').width;
  const videoWidth = screenWidth * 0.8;
  const videoHeight = (videoWidth * 9) / 16;
  const sideWidth = screenWidth * 0.1;  // 10% of screen for side labels

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header />

      <View style={styles.videoContainer}>
        {/* Left vertical Chinese */}
        <View
          style={[
            styles.sideText,
            {
              width: sideWidth,
              height: videoHeight,
              borderRightWidth: 4,
              borderColor: '#ff1e1e',
            },
          ]}
        >
          <Text
            style={[
              styles.lang,
              styles.chinese,
              styles.chineseSpacing,
            ]}
          >
            舞{'\n'}狮
          </Text>
        </View>

        {/* Video */}
        <View style={styles.videoWrapper}>
          {Platform.OS === 'web' ? (
            <video
              src={require('../../assets/images/ufldtfinal.mp4') as any}
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: videoWidth,
                height: videoHeight,
                objectFit: 'contain',
                borderRadius: 12,
              }}
            />
          ) : (
            <Video
              ref={videoRef}
              source={require('../../assets/images/ufldtfinal.mp4')}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay
              isLooping
              isMuted
              useNativeControls={false}
              style={{
                width: videoWidth,
                height: videoHeight,
                borderRadius: 12,
              }}
            />
          )}
        </View>

        {/* Right vertical Vietnamese */}
        <View
          style={[
            styles.sideText,
            {
              width: sideWidth,
              height: videoHeight,
              borderLeftWidth: 4,
              borderColor: '#ff1e1e',
            },
          ]}
        >
          <Text
            style={[
              styles.lang,
              styles.vietnamese,
              styles.vietnameseSpacing,
            ]}
          >
            Múa{'\n'}lân
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0a0a0a',
    paddingBottom: 24,
  },
  videoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  sideText: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lang: {
    color: '#ff1e1e',
    textAlign: 'center',
  },
  // Additional spacing for Chinese label
  chinese: {
    fontFamily: 'ZCOOLKuaiLe',
    fontWeight: '600',
  },
  chineseSpacing: {
    fontSize: 44,
    letterSpacing: 8,
    lineHeight: 80,   // double the fontSize for extra gap
  },
  // Additional spacing for Vietnamese label
  vietnamese: {
    fontFamily: 'BeVietnam',
    fontWeight: '600',
  },
  vietnameseSpacing: {
    fontSize: 28,
    letterSpacing: 2,
    lineHeight: 56,   // double the fontSize for extra gap
  },
  videoWrapper: {
    marginHorizontal: 16,
  },
});
