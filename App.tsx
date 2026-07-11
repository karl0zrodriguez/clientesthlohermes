import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, Text } from 'react-native-paper';
import { AuthProvider, useAuthContext } from './src/context/AuthContext';
import { LoginScreen } from './src/screens/LoginScreen';

// We'll keep the HomeScreen component here for simplicity, but you can move it to a separate file.
function HomeScreen() {
  const { logout } = useAuthContext();

  return (
    <PaperProvider>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
          Bienvenido a Clientes THLO Hermes
        </Text>
        <Text style={{ marginTop: 20 }}>
          Sesión iniciada correctamente
        </Text>
        <Text style={{ marginTop: 30 }} onPress={logout}>
          Cerrar sesión
        </Text>
      </View>
    </PaperProvider>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  const { accessToken, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <AuthProvider>
        <PaperProvider>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Cargando...</Text>
          </View>
        </PaperProvider>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator>
            {accessToken ? (
              <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            ) : (
              <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </AuthProvider>
  );
}