import React from 'react'; // Certifique-se de importar React
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { StatusBar } from 'react-native';
import 'react-native-gesture-handler';
import fonts from './app/src/config/fonts';
import Routes from './app/src/routes/Routes';
import { UserProvider } from './app/src/components/UserContext'; // Importando o UserProvider

export default function App() {
    const [fontsLoaded] = useFonts(fonts); // Carregando fontes

    if (!fontsLoaded) {
        return null; // Exibe null enquanto as fontes não estão carregadas
    }

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            <UserProvider>
                <NavigationContainer>
                    <Routes />
                </NavigationContainer>
            </UserProvider>
        </>
    );
}
