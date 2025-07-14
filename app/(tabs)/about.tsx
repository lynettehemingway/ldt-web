<<<<<<< HEAD
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../../components/Header'; // adjust path if needed
=======
import React from 'react';
import { Image, ScrollView, StyleSheet, Text } from 'react-native';
>>>>>>> 9658ce667671e85067dd900fbd1af72dcdee2be0

export default function About() {
  return (
    <ScrollView style={styles.container}>
<<<<<<< HEAD
      <Header />
      <View style={styles.content}>
        <Text style={styles.title}>About Us</Text>
        <Text style={styles.text}>
          We're a lion dance team dedicated to cultural performance and preserving heritage with fire and rhythm.
        </Text>
      </View>
=======
      <Text style={styles.title}>About Us</Text>
      <Text style={styles.subtitle}>
        Preserving heritage. Performing with heart. Inspiring through rhythm.
      </Text>

      <Image
        source={{ uri: 'https://via.placeholder.com/300x180.png?text=Lion+Dance+Team' }}
        style={styles.image}
      />

      <Text style={styles.sectionTitle}>Who We Are</Text>
      <Text style={styles.text}>
        We are a dedicated lion dance team passionate about promoting culture, community,
        and the art of traditional performance. Whether it's celebrating Lunar New Year,
        performing at festivals, or representing our university, we bring fire, rhythm, and meaning to every show.
      </Text>

      <Text style={styles.sectionTitle}>Our Mission</Text>
      <Text style={styles.text}>
        To celebrate and preserve Asian cultural heritage through high-energy performances,
        team collaboration, and community engagement — one beat at a time.
      </Text>
>>>>>>> 9658ce667671e85067dd900fbd1af72dcdee2be0
    </ScrollView>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { padding: 24 },
  title: { fontSize: 24, color: '#ff1e1e', fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 16, color: '#ccc' },
=======
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
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 24,
    backgroundColor: '#1a1a1a',
  },
  sectionTitle: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
  },
  text: {
    fontSize: 16,
    color: '#ccc',
    lineHeight: 22,
  },
>>>>>>> 9658ce667671e85067dd900fbd1af72dcdee2be0
});
