import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../../../../config/firebaseConfig';
import Fonts from '../../../../utils/Fonts';

export default function RecuperarSenha({ navigation }) {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const validate = () => {
        let valid = true;
        if (email === '') {
            setEmailError('Isto é obrigatório.');
            valid = false;
        } else {
            setEmailError('');
        }
        return valid;
    };

    const handleForgot = () => {
        if (!validate()) {
            return;
        }
        sendPasswordResetEmail(auth, email)
            .then(() => {
                Alert.alert("Email enviado")
            })
            .catch((error) => {
                const errorMessage = error.message;

            });
    };


    return (
        <View style={styles.container}>
            <Image source={require('../../../../../../assets/goatlogo.png')} style={styles.logo} />
            <Text style={styles.mainTitle}>Recuperar Senha</Text>
            <View style={styles.recoverContainer}>
                <Text style={styles.title}>Digite seu email</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setEmail}
                    value={email}
                    placeholder="Email"
                    placeholderTextColor="#ccc"
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                <TouchableOpacity style={styles.button} onPress={handleForgot}>
                    <Text style={styles.buttonText}>Enviar Email</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.linkText}>Voltar para Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#666360',
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    recoverContainer: {
        backgroundColor: '#868382',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#3F3B39',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 1.5,
        elevation: 5,
        width: 320,
        alignItems: 'center',
    },
    mainTitle: {
        fontSize: 32,
        fontFamily: Fonts['poppins-bold'],
        color: 'white',
        marginBottom: 20,
        textAlign: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 24,
        textAlign: 'center',
        color: 'white',
        fontFamily: Fonts['poppins-bold'],
    },
    input: {
        height: 50,
        backgroundColor: '#A59F9D',
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 8,
        color: 'white',
        width: '100%',
        fontFamily: Fonts['poppins-regular'],
    },
    errorText: {
        color: 'red',
        marginBottom: 12,
        fontFamily: Fonts['poppins-regular'],
    },
    button: {
        backgroundColor: '#F56D09',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: Fonts['poppins-bold'],
    },
    linkText: {
        color: 'white',
        textDecorationLine: 'underline',
        fontFamily: Fonts['poppins-regular'],
        fontSize: 16,
        marginTop: 10,
    },
});