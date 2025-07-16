// app/(tabs)/index.tsx
import { ResizeMode, Video } from 'expo-av';
import Link from 'expo-router/link';
import React, { useEffect, useRef } from 'react';
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../components/Header';

const glowColor = '#ff1e1e';

export default function HomeScreen() {
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    videoRef.current?.playAsync();
  }, []);

  const screenWidth = Dimensions.get('window').width;
  const videoWidth = screenWidth * 0.8;
  const videoHeight = (videoWidth * 9) / 16;
  const sideWidth = screenWidth * 0.1; // 10% of screen for side labels

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
              borderColor: glowColor,
            },
          ]}
        >
          <Text
            style={[
              styles.lang,
              styles.chinese,
              styles.chineseGlow,
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
              borderColor: glowColor,
            },
          ]}
        >
          <Text
            style={[
              styles.lang,
              styles.vietnamese,
              styles.vietnameseGlow,
              styles.vietnameseSpacing,
            ]}
          >
            Múa{'\n'}lân
          </Text>
        </View>
      </View>

      <View style={styles.socialsContainer}>
        <Link href={'https://www.instagram.com/uf.ldt/' as any} asChild>
          <TouchableOpacity>
            <Text style={styles.socialsText}>Instagram</Text>
          </TouchableOpacity>
        </Link>
        <Link href={'https://discord.gg/zKkVwQqaFj' as any} asChild>
          <TouchableOpacity>
            <Text style={styles.socialsText}>Discord</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0a0a0a',
    paddingBottom: 24,
    paddingHorizontal: 24,
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
    color: glowColor,
    textAlign: 'center',
  },
  // Chinese base style
  chinese: {
    fontFamily: 'ZCOOLXiaoWei',
    fontWeight: '600',
    paddingLeft: 20,
  },
  // glow for Chinese
  chineseGlow: {
    textShadowColor: glowColor,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  // Spacing for Chinese label
  chineseSpacing: {
    fontSize: 44,
    letterSpacing: 8,
    lineHeight: 80,
  },
  // Vietnamese base style
  vietnamese: {
    fontFamily: 'BeVietnam',
    fontWeight: '600',
    paddingRight: 20,
  },
  // glow for Vietnamese
  vietnameseGlow: {
    textShadowColor: glowColor,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  // Spacing for Vietnamese label
  vietnameseSpacing: {
    fontSize: 28,
    letterSpacing: 2,
    lineHeight: 56,
  },
  videoWrapper: {
    marginHorizontal: 16,
  },
  socialsContainer: {
    flexDirection: 'row',
    gap: 32,
    padding: 24,
  },
  socialsText: {
    color: '#fff',
  },
});
