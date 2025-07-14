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
        <Link href={'/' as any} asChild>
          <TouchableOpacity>
            <Text style={styles.navLink}>Home</Text>
          </TouchableOpacity>
        </Link>
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
    gap: 12,
  },
  logoImage: {
    width: 64,
    height: 64,
  },
  logoText: {
    color: '#ff1e1e',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 3,
    textTransform: 'uppercase',
    textShadowColor: '#111',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  linksContainer: {
    flexDirection: 'row',
    gap: 32,
  },
  navLink: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
