// components/Header.tsx
import { Ionicons } from '@expo/vector-icons';
import Link from 'expo-router/link';
import React, { useState } from 'react';
import {
  Image,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View
} from 'react-native';

const glowColor = '#ff1e1e';
const PADDING_HORIZONTAL = 25 * 2; // left + right from navbar

export default function Header() {
  const { width } = useWindowDimensions();

  // track measured widths
  const [logoWidth, setLogoWidth] = useState(0);
  const [linksWidth, setLinksWidth] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // if combined width + padding exceeds window, collapse
  const shouldCollapse = logoWidth + linksWidth + PADDING_HORIZONTAL > width;

  const onLogoLayout = (e: LayoutChangeEvent) => {
    setLogoWidth(e.nativeEvent.layout.width);
  };
  const onLinksLayout = (e: LayoutChangeEvent) => {
    setLinksWidth(e.nativeEvent.layout.width);
  };

  const NavItems = (
    <>
      <Link href='/' asChild>
        <TouchableOpacity onPress={() => setMenuOpen(false)}>
          <Text style={styles.navLink}>Home</Text>
        </TouchableOpacity>
      </Link>
      <Link href='/about' asChild>
        <TouchableOpacity onPress={() => setMenuOpen(false)}>
          <Text style={styles.navLink}>About</Text>
        </TouchableOpacity>
      </Link>
      <Link href='/media' asChild>
        <TouchableOpacity onPress={() => setMenuOpen(false)}>
          <Text style={styles.navLink}>Media</Text>
        </TouchableOpacity>
      </Link>
      <Link href='/merch' asChild>
        <TouchableOpacity onPress={() => setMenuOpen(false)}>
          <Text style={styles.navLink}>Merch</Text>
        </TouchableOpacity>
      </Link>
    </>
  );

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.navbar}>
        {/* Logo / Team Name */}
        <Link href='/' asChild>
          <TouchableOpacity
            style={styles.logoContainer}
            onLayout={onLogoLayout}
          >
            <Image
              source={require('../assets/images/ufldtlogowhite2.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>UF LION DANCE TEAM</Text>
          </TouchableOpacity>
        </Link>

        {/* Either inline links or hamburger */}
        {shouldCollapse ? (
          <TouchableOpacity
            onPress={() => setMenuOpen(o => !o)}
            style={styles.menuButton}
          >
            <Ionicons
              name={menuOpen ? 'close' : 'menu'}
              size={28}
              color="#fff"
            />
          </TouchableOpacity>
        ) : (
          <View
            style={styles.linksContainer}
            onLayout={onLinksLayout}
          >
            {NavItems}
          </View>
        )}
      </View>

      {/* Mobile dropdown */}
      {shouldCollapse && menuOpen && (
        <View style={styles.dropdown}>
          {NavItems}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    zIndex: 1000,
  },
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
    paddingVertical: 15,
    paddingHorizontal: 25,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoImage: {
    width: 64,
    height: 64,
    borderRadius: 20,
  },
  logoText: {
    color: glowColor,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 3,
    textTransform: 'uppercase',
    textShadowColor: glowColor,
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
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
    paddingVertical: 4,
  },
  menuButton: {
    padding: 8,
  },
  dropdown: {
    backgroundColor: '#0a0a0a',
    borderTopWidth: 1,
    borderTopColor: '#222',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
