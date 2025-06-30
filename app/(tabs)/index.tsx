import Link from 'expo-router/link';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
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

      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroText}>Lion Dance Team</Text>
        <Text style={styles.subText}>Tradition in motion. Power in rhythm.</Text>
      </View>
    </ScrollView>
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
  },
  navLink: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
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
