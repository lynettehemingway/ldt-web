import { StyleSheet, Text, View } from 'react-native';

export default function Media() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Media</Text>
      <Text style={styles.text}>
        Photos and videos from past performances coming soon.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', padding: 24 },
  title: { fontSize: 24, color: '#ff1e1e', fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 16, color: '#ccc' },
});
