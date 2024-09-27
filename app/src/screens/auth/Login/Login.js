import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { auth } from '../../../config/firebaseConfig';
import Fonts from '../../../utils/Fonts';
import firebase from 'firebase/compat/app';



export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const validate = () => {
        let valid = true;
        if (email === '') {
            setEmailError('Isto é obrigatório.');
            valid = false;
        } else {
            setEmailError('');
        }
        if (password === '') {
            setPasswordError('Isto é obrigatório.');
            valid = false;
        } else {
            setPasswordError('');
        }
        return valid;
    };

    const handleLogin = () => {
        if (validate()) {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log(user);
                    setEmail("");
                    setPassword("");
                    Alert.alert('Login bem-sucedido');
                    navigation.navigate("RoutesTab");
                })
                .catch((error) => {
                    const errorMessage = error.message;
                    Alert.alert('Erro', errorMessage);
                });
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('../../../../../assets/goatlogo.png')} style={styles.logo} />
            <Text style={styles.mainTitle}>GOAT</Text>
            <View style={styles.loginContainer}>
                <Text style={styles.title}>Login</Text>
                <View style={styles.inputContainer}>
                    <FontAwesome name="envelope" size={20} color="#ccc" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        onChangeText={setEmail}
                        value={email}
                        placeholder="Email"
                        placeholderTextColor="#ccc"
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                <View style={styles.inputContainer}>
                    <FontAwesome name="lock" size={20} color="#ccc" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        onChangeText={setPassword}
                        value={password}
                        placeholder="Senha"
                        placeholderTextColor="#ccc"
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.icon}>
                        <FontAwesome
                            name={showPassword ? 'eye' : 'eye-slash'}
                            size={20}
                            color="#C1644F"
                        />
                    </TouchableOpacity>
                </View>
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                <View style={styles.forgotPasswordContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate("RecuperarSenha")}>
                        <Text style={styles.forgotPasswordText}>
                            Esqueceu sua senha?
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
                        <Text style={styles.linkText}>Registre-se</Text>
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
        backgroundColor: '#54514F',
    },
    loginContainer: {
        backgroundColor: '#7D7875',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#595654',
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 22,
        backgroundColor: '#A49A97',
        borderRadius: 5,
    },
    input: {
        flex: 1,
        height: 50,
        backgroundColor: '#A49A97',
        borderRadius: 5,
        marginBottom: 8, 
        paddingHorizontal: 8,
        color: 'white',
        fontSize: 14,
        fontFamily: Fonts['poppins-regular'],
    },
    inputIcon: {
        padding: 10,
    },
    icon: {
        padding: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 5,
        marginTop: -15,
        fontFamily: Fonts['poppins-regular'],
    },
    button: {
        backgroundColor: '#F55900',
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
    logo: {
        width: 170,
        height: 170,
        marginBottom: 10,
    },
    forgotPasswordContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    forgotPasswordText: {
        fontFamily: Fonts["poppins-regular"],
        fontSize: 14,
        color: '#fff',
        alignItems: 'center',
        textAlign: 'center',
    },
    linkText: {
        color: 'white',
        textDecorationLine: 'underline',
        fontFamily: Fonts['poppins-regular'],
        fontSize: 14,
        marginTop: 10,
    },
});