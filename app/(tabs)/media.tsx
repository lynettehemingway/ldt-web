import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Media() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Media</Text>
      <Text style={styles.subtitle}>Capturing the rhythm and power of tradition.</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Photos</Text>
        <View style={styles.grid}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.card}>
              <Image
                source={{ uri: 'https://via.placeholder.com/150x100.png?text=Photo+' + i }}
                style={styles.image}
              />
              <Text style={styles.caption}>Performance {i}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Videos</Text>
        <View style={styles.grid}>
          {[1, 2].map((i) => (
            <View key={i} style={styles.card}>
              <Image
                source={{ uri: 'https://via.placeholder.com/150x100.png?text=Video+' + i }}
                style={styles.image}
              />
              <Text style={styles.caption}>Highlight {i}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.footer}>More media coming soon, stay tuned!</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: 24,
  },
  title: {
    fontSize: 32,
    color: '#ff1e1e',
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 100,
  },
  caption: {
    color: '#ccc',
    fontSize: 14,
    padding: 8,
    textAlign: 'center',
  },
  footer: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
  },
});
