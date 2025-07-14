import { Link, usePathname } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function NavItem({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} asChild>
      <TouchableOpacity accessibilityRole="link">
        <Text style={[styles.navLink, isActive && styles.activeLink]}>{label}</Text>
      </TouchableOpacity>
    </Link>
  );
}

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navbar}>
        <NavItem href="/about" label="About" />
        <NavItem href="/media" label="Media" />
        <NavItem href="/merch" label="Merch" />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <Text style={styles.heroText}>Lion Dance Team</Text>
          <Text style={styles.subText}>Tradition in motion. Power in rhythm.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    backgroundColor: '#0a0a0a',
    zIndex: 10,
  },
  navLink: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  activeLink: {
    color: '#ff1e1e',
    textDecorationLine: 'underline',
  },
  scrollContent: {
    paddingTop: 24, 
  },
  hero: {
    padding: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: {
    color: '#ff1e1e',
    fontSize: 32,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: -1,
    textAlign: 'center',
  },
  subText: {
    color: '#ccc',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
    maxWidth: 300,
  },
});
