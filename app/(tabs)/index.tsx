import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../../components/Header';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <Header />
      <View style={styles.hero}>
        <Text style={styles.heroText}>Lion Dance Team</Text>
        <Text style={styles.subText}>Tradition in motion. Power in rhythm.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', padding: 24},
  hero: { padding: 48, alignItems: 'center', justifyContent: 'center' },
  heroText: {
    color: '#ff1e1e',
    fontSize: 32,
    fontWeight: '900',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  subText: { color: '#ccc', fontSize: 16, marginTop: 12, textAlign: 'center', maxWidth: 300 },
});
