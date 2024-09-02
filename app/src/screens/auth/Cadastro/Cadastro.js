import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { auth, db } from '../../../config/firebaseConfig';
import Fonts from '../../../utils/Fonts';

const badWords = [
    'senha', '123456', 'password', 'admin', 'user',

];

export default function Cadastro({ navigation }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const isValidUsername = (username) => {
        // Permitir apenas letras, números e sublinhados
        const regex = /^[a-zA-Z0-9_]+$/;
        return regex.test(username);
    };

    const isBadWord = (word) => {
        // Checa se a palavra é uma palavra de baixo calão
        return badWords.includes(word.toLowerCase());
    };

    const isValidEmail = (email) => {
        // Regex básica para validação de email
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validate = () => {
        let valid = true;

        // Validar email
        if (email === '') {
            setEmailError('Isto é obrigatório.');
            valid = false;
        } else if (!isValidEmail(email)) {
            setEmailError('Email inválido.');
            valid = false;
        } else {
            setEmailError('');
        }

        // Validar senha
        if (password === '') {
            setPasswordError('Isto é obrigatório.');
            valid = false;
        } else if (password.length < 6) {
            setPasswordError('A senha deve ter pelo menos 6 caracteres.');
            valid = false;
        } else if (isBadWord(password)) {
            setPasswordError('A senha é muito comum ou inapropriada.');
            valid = false;
        } else {
            setPasswordError('');
        }

        // Validar nome de usuário
        if (username === '') {
            setUsernameError('Isto é obrigatório.');
            valid = false;
        } else if (username.length < 7) {
            setUsernameError('O nome de usuário deve ter pelo menos 7 caracteres.');
            valid = false;
        } else if (!isValidUsername(username)) {
            setUsernameError('O nome de usuário só pode conter letras, números e sublinhados.');
            valid = false;
        } else if (isBadWord(username)) {
            setUsernameError('O nome de usuário é muito comum ou inapropriado.');
            valid = false;
        } else {
            setUsernameError('');
        }

        // Validar confirmação de senha
        if (confirmpassword === '') {
            setConfirmPasswordError('Isto é obrigatório.');
            valid = false;
        } else if (password !== confirmpassword) {
            setConfirmPasswordError('As senhas não coincidem.');
            valid = false;
        } else {
            setConfirmPasswordError('');
        }

        return valid;
    };

    const handleCadastro = () => {
        if (validate()) {
            createUserWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {
                    const user = userCredential.user;
                    const userId = user.uid;
                    await setDoc(doc(db, "Users", userId), {
                        nome: username,
                        email: email,
                        senha: password,
                    });
                    setUsername('');
                    setEmail('');
                    setPassword('');
                    navigation.navigate('Login');
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
                <Text style={styles.title}>Registrar</Text>

                <TextInput
                    style={styles.input}
                    onChangeText={setUsername}
                    value={username}
                    placeholder="Username"
                    placeholderTextColor="#ccc"
                    autoCapitalize="none"
                    keyboardType="default"
                />
                {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}

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

                <TextInput
                    style={styles.input}
                    onChangeText={setPassword}
                    value={password}
                    placeholder="Senha"
                    placeholderTextColor="#ccc"
                    secureTextEntry
                />
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                <TextInput
                    style={styles.input}
                    onChangeText={setConfirmPassword}
                    value={confirmpassword}
                    placeholder="Confirm Password"
                    placeholderTextColor="#ccc"
                    secureTextEntry
                />
                {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

                <TouchableOpacity style={styles.button} onPress={handleCadastro}>
                    <Text style={styles.buttonText}>Registrar</Text>
                </TouchableOpacity>
                <Text
                    style={styles.linkText}
                    onPress={() => navigation.navigate('Login')}
                >
                    Logar
                </Text>
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
        backgroundColor: '#5B5959',
    },
    loginContainer: {
        backgroundColor: '#7D726F',
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
        fontFamily: Fonts['poppins-bold']
    },
    input: {
        height: 50,
        backgroundColor: '#A49A97',
        borderRadius: 5,
        marginBottom: 22,
        paddingHorizontal: 8,
        color: 'white',
        width: '100%',
        fontSize: 14,
        fontFamily: Fonts['poppins-regular']
    },
    errorText: {
        color: 'red',
        marginBottom: 5,
        marginTop: -15,
        fontFamily: Fonts['poppins-regular']
    },
    button: {
        backgroundColor: '#C1644F',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: Fonts['poppins-bold']
    },
    logo: {
        width: 170,
        height: 170,
        marginBottom: 10,
    },
    linkText: {
        color: 'white',
        textDecorationLine: 'underline',
        fontSize: 16,
        marginTop: 10,
        fontFamily: Fonts['poppins-regular']
    },
});