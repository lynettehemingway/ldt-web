import Link from 'expo-router/link';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Header() {
  return (
    <View style={styles.navbar}>
      {/* Logo / Team Name */}
      <Link href={'/' as any} asChild>
        <TouchableOpacity style={styles.logoContainer}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.logoText}>UF LION DANCE</Text>
        </TouchableOpacity>
      </Link>

      {/* Navigation Links */}
      <View style={styles.linksContainer}>
        <Link href={'/about' as any} asChild>
          <TouchableOpacity>
            <Text style={styles.navLink}>About</Text>
          </TouchableOpacity>
        </Link>
        <Link href={'/media' as any} asChild>
          <TouchableOpacity>
            <Text style={styles.navLink}>Media</Text>
          </TouchableOpacity>
        </Link>
        <Link href={'/merch' as any} asChild>
          <TouchableOpacity>
            <Text style={styles.navLink}>Merch</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 32,
    paddingHorizontal: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    backgroundColor: '#0a0a0a',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  logoText: {
    color: '#ff1e1e',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 4,
    textTransform: 'uppercase',
    textShadowColor: '#111',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  linksContainer: {
    flexDirection: 'row',
    gap: 48,
  },
  navLink: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
});
