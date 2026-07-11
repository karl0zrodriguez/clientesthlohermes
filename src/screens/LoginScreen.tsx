import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useAuthContext } from '../context/AuthContext';

export const LoginScreen = () => {
  const { login, isLoading } = useAuthContext();

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        icon="login"
        mode="contained"
        style={styles.button}
        onPress={login}
        disabled={isLoading}
      >
        {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión con Google'}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  button: {
    width: '80%',
    marginVertical: 20,
  },
});