import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { auth, db } from '../../../config/firebaseConfig';
import Fonts from '../../../utils/Fonts';
import Login from '../Login/Login';

const badWords = [
    'senha', '123456', 'password', 'admin', 'user',
];

export default function Component({ navigation }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isUsernameValid, setIsUsernameValid] = useState(false);
    const [usernameBlurred, setUsernameBlurred] = useState(false);

    const isValidUsername = (username) => {
        const regex = /^[a-zA-Z0-9_]+$/;
        return regex.test(username);
    };

    const isBadWord = (word) => {
        return badWords.includes(word.toLowerCase());
    };

    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validateUsername = (username) => {
        if (username === '' && usernameBlurred) {
            setUsernameError('O nome de usuário é obrigatório.');
            setIsUsernameValid(false);
        } else if (username.length > 0 && username.length < 7) {
            setUsernameError('O nome de usuário deve ter pelo menos 7 caracteres.');
            setIsUsernameValid(false);
        } else if (username.length > 0 && !isValidUsername(username)) {
            setUsernameError('O nome de usuário só pode conter letras, números e sublinhados.');
            setIsUsernameValid(false);
        } else if (username.length > 0 && isBadWord(username)) {
            setUsernameError('O nome de usuário é muito comum ou inapropriado.');
            setIsUsernameValid(false);
        } else if (username.length >= 7) {
            setUsernameError('');
            setIsUsernameValid(true);
        } else {
            setUsernameError('');
            setIsUsernameValid(false);
        }
    };

    useEffect(() => {
        validateUsername(username);
    }, [username, usernameBlurred]);

    const validate = () => {
        let valid = true;

        if (email === '') {
            setEmailError('Isto é obrigatório.');
            valid = false;
        } else if (!isValidEmail(email)) {
            setEmailError('Email inválido.');
            valid = false;
        } else {
            setEmailError('');
        }

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

        validateUsername(username);
        if (usernameError || username === '') {
            valid = false;
        }

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
                    setConfirmPassword('');
                    navigation.navigate('Login')
                    sendEmailVerification(auth.currentUser)
                        .then(() => {
                            Toast.show({
                                type: 'success',
                                text1: 'Verifique seu Email',
                                text2: 'Por favor verifique seu email para poder continuar!',
                            });
                        })
                        .catch((error) => {
                            console.error("Erro ao enviar email de verificação:", error);
                        });
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

                <View style={styles.inputContainer}>
                    <FontAwesome name="user" size={20} color="#ccc" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => {
                            setUsername(text);
                        }}
                        onBlur={() => setUsernameBlurred(true)}
                        value={username}
                        placeholder="Username"
                        placeholderTextColor="#ccc"
                        autoCapitalize="none"
                        keyboardType="default"
                    />
                    {username.length > 0 && (
                        <FontAwesome
                            name={isUsernameValid ? 'check-circle' : 'times-circle'}
                            size={20}
                            color={isUsernameValid ? 'green' : 'red'}
                            style={styles.icon}
                        />
                    )}
                </View>
                {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}

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

                <View style={styles.inputContainer}>
                    <FontAwesome name="lock" size={20} color="#ccc" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        onChangeText={setConfirmPassword}
                        value={confirmpassword}
                        placeholder="Confirm Password"
                        placeholderTextColor="#ccc"
                        secureTextEntry={!showConfirmPassword}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.icon}>
                        <FontAwesome
                            name={showConfirmPassword ? 'eye' : 'eye-slash'}
                            size={20}
                            color="#C1644F"
                        />
                    </TouchableOpacity>
                </View>
                {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

                <TouchableOpacity style={styles.button} onPress={handleCadastro}>
                    <Text style={styles.buttonText}>Registrar</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text
                        style={styles.linkText}
                    >
                        Logar
                    </Text>
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
    loginContainer: {
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
        fontFamily: Fonts['poppins-bold']
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 22,
        backgroundColor: '#A59F9D',
        borderRadius: 5,
    },
    input: {
        flex: 1,
        height: 50,
        paddingHorizontal: 8,
        color: 'white',
        fontSize: 14,
        fontFamily: Fonts['poppins-regular']
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
        fontFamily: Fonts['poppins-regular']
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
        fontSize: 14,
        marginTop: 10,
        fontFamily: Fonts['poppins-regular']
    },
});
