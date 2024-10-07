import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Settings = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.content}>Aqui você pode ajustar suas configurações.</Text>
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

export default Settings;
