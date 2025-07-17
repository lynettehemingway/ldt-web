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

const glowColor = '#6F00FF';

export default function HomeScreen() {
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    videoRef.current?.playAsync();
  }, []);

  const screenWidth = Dimensions.get('window').width;
  const videoWidth = screenWidth * 0.8;
  const videoHeight = (videoWidth * 9) / 16;
  const sideWidth = screenWidth * 0.1;

  return (
    <View style={styles.page}>
      <Header />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.videoContainer}>
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
                styles.vietnameseVertical,
              ]}
            >
              {'M\nú\na\n\nL\nâ\nn'}
            </Text>
          </View>
        </View>

        <View style={styles.socialsContainer}>
          <Link href="https://www.instagram.com/uf.ldt/" asChild>
            <TouchableOpacity>
              <Text style={styles.socialsText}>Instagram</Text>
            </TouchableOpacity>
          </Link>
          <Link href="https://discord.gg/zKkVwQqaFj" asChild>
            <TouchableOpacity>
              <Text style={styles.socialsText}>Discord</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#fbf7f5',
  },
  container: {
    paddingBottom: 24,
    paddingHorizontal: 24,
    backgroundColor: '#fbf7f5',
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
  chinese: {
    fontFamily: 'ZCOOLXiaoWei',
    fontWeight: '600',
    paddingLeft: 20,
  },
  chineseGlow: {
    textShadowColor: glowColor,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  chineseSpacing: {
    fontSize: 44,
    letterSpacing: 8,
    lineHeight: 80,
  },
  vietnamese: {
    fontFamily: 'BeVietnam',
    fontWeight: '600',
    paddingRight: 20,
  },
  vietnameseGlow: {
    textShadowColor: glowColor,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  vietnameseVertical: {
    fontSize: 28,
    letterSpacing: 0,
    lineHeight: 40,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
});
