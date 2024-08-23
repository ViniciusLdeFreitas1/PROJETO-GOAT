import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { StatusBar } from 'react-native';
import 'react-native-gesture-handler';
import fonts from './app/src/config/fonts';
import Routes from './app/src/routes/Routes';

export default function App() {
  const [fontsLoaded] = useFonts(fonts);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </>
  );
}