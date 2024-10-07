import { AntDesign } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet } from 'react-native';

import Home from '../screens/appScreens/Home/Home';
import Perfil from '../screens/appScreens/Perfil/Perfil';
import Players from '../screens/appScreens/Players/Players';
import Jogos from '../screens/appScreens/Jogos/Jogos';
import Transferencia from '../screens/appScreens/Transferencia/Transferencia';
import Cadastro from '../screens/auth/Cadastro/Cadastro';
import Login from '../screens/auth/Login/Login';
import RecuperarSenha from '../screens/auth/Login/RecuperarSenha/RecuperarSenha';
import Splash from '../screens/splashScreens/Splash/Splash';
import Fonts from '../utils/Fonts';
import Seasons from '../screens/appScreens/Temporadas/seasons';
import TeamDetails from "../screens/appScreens/Players/Teams/TeamDetails"

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function Routes() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>

            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Cadastro" component={Cadastro} />
            <Stack.Screen name="RecuperarSenha" component={RecuperarSenha} />
            <Stack.Screen name="RoutesTab" component={RoutesTab} />
            <Stack.Screen name="Temporadas" component={Seasons}/>
            <Stack.Screen name="TeamDetails" component={TeamDetails}/>

         </Stack.Navigator>
    );
}

function RoutesTab() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarLabelStyle: styles.label,
                headerShown: false,
                tabBarStyle: [
                    styles.tabContainer,
                ],
                tabBarItemStyle: {
                    marginBottom: 4,
                    marginTop: 10
                },
                tabBarInactiveTintColor: 'gray',
                tabBarActiveTintColor: 'orange',
            }}
            safeAreaInsets={{
                bottom: 0,
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <AntDesign
                            name="home"
                            size={24}
                            color={focused ? 'orange' : 'gray'}
                        />
                    ),
                }}
            />
            <Tab.Screen
                options={{
                    tabBarIcon: ({ focused }) => (
                        <AntDesign
                            name="team"
                            size={21}
                            color={focused ? 'orange' : 'gray'}
                        />
                    ),
                }}
                name="Players"
                component={Players}
            />
            <Tab.Screen
                name="Jogos"
                component={Jogos}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <AntDesign
                            name="dribbble"
                            size={22}
                            color={focused ? 'orange' : 'gray'}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Transferencia"
                component={Transferencia}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <AntDesign
                            name="swap"
                            size={22}
                            color={focused ? 'orange' : 'gray'}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Perfil"
                component={Perfil}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <AntDesign
                            name="user"
                            size={22}
                            color={focused ? 'orange' : 'gray'}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabContainer: {
        position: 'absolute',
        width: '100%',
        backgroundColor: '#000',
        height: 60,
    },
    label: {
        textTransform: 'capitalize',
        fontFamily: Fonts['poppins-regular'],
        fontSize: 12,
    },
});