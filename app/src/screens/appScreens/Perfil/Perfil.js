import { signOut } from 'firebase/auth';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { auth } from '../../../config/firebaseConfig';

export default function Perfil({ navigation }) {

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                // Logout bem-sucedido
                Alert.alert('Logout', 'Você foi desconectado com sucesso.');
                navigation.navigate('Login'); // Navegar para a tela de login ou inicial
            })
            .catch((error) => {
                // Captura de erros
                Alert.alert('Erro', 'Ocorreu um erro ao tentar fazer logout.');
            });
    };

    return (
        <View style={styles.container}>
            <View style={styles.PerfilHeader}>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Sair</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#5B5959',
    },
    title: {
        fontSize: 24,
        color: 'white',
        marginBottom: 20,
        fontFamily: 'Poppins-Bold',
    },
    button: {
        backgroundColor: '#C1644F',
        padding: 10,
        borderRadius: 5,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
    },
    PerfilHeader: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    }
});