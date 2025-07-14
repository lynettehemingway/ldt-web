import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Merch() {
  const products = [
    {
      id: 1,
      name: 'Team Hoodie',
      price: '$45',
      image: 'https://via.placeholder.com/150x150.png?text=Hoodie',
    },
    {
      id: 2,
      name: 'Crew T-Shirt',
      price: '$25',
      image: 'https://via.placeholder.com/150x150.png?text=T-Shirt',
    },
    {
      id: 3,
      name: 'Embroidered Cap',
      price: '$20',
      image: 'https://via.placeholder.com/150x150.png?text=Cap',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Merch</Text>
      <Text style={styles.subtitle}>Shop team gear and support our lion dance crew.</Text>

      <View style={styles.grid}>
        {products.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>{item.price}</Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Buy Now</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  price: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#ff1e1e',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textTransform: 'uppercase',
  },
});
