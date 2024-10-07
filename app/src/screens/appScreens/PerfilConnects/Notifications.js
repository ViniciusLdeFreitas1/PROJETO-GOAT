import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Notifications = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <Text style={styles.content}>Aqui estão suas notificações.</Text>
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

export default Notifications;
