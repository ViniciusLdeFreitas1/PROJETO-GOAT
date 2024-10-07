import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Likes = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Likes</Text>
      <Text style={styles.content}>Aqui estão seus itens favoritos.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#54514F',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  content: {
    color: '#fff',
  },
});

export default Likes;
