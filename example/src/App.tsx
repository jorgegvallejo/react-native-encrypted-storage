import * as React from 'react';

import { StyleSheet, View, Text, ActivityIndicator, Button } from 'react-native';
import EncryptedStorage, { useEncryptedStorage } from 'react-native-encrypted-storage';

export default function App() {
  const { value, error, loading, setItem, removeItem } = useEncryptedStorage('some-key');

  return (
    <View style={styles.container}>
      {loading ? (
       <ActivityIndicator />
      ) : error ? (
        <Text>Error: {JSON.stringify(error)}</Text>
      ) : value ? (
        <Text>Result: {value}</Text>
      ) : (
        <Text>No value for key some-key</Text>
      )}

      <Button title='Set a value' onPress={() => setItem(Math.random().toString())} />

      <Button title='Remove a value' onPress={removeItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
