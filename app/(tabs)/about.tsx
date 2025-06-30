import { StyleSheet, Text, View } from 'react-native';

export default function About() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About Us</Text>
      <Text style={styles.text}>
        We're a lion dance team dedicated to cultural performance and preserving heritage with fire and rhythm.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', padding: 24 },
  title: { fontSize: 24, color: '#ff1e1e', fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 16, color: '#ccc' },
});
