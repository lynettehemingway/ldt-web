import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../../components/Header'; // adjust path if needed

export default function About() {
  return (
    <ScrollView style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.title}>About Us</Text>
        <Text style={styles.text}>
          We're a lion dance team dedicated to cultural performance and preserving heritage with fire and rhythm.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { padding: 24 },
  title: { fontSize: 24, color: '#ff1e1e', fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 16, color: '#ccc' },
});
