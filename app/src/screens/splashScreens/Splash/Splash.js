import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { auth } from '../../../config/firebaseConfig';

export default function Splash({ navigation }) {
    useEffect(() => {
        const timeout = setTimeout(() => {
            const unsubscribe = onAuthStateChanged(auth, user => {
                if (user) {
                    navigation.replace('RoutesTab');
                } else {
                    navigation.replace('Login');
                }
            });
            return () => unsubscribe();
        }, 5000);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <View style={styles.container}>
            <Image source={require('../../../../../assets/Logo_goat.png')} style={styles.image} />
            <ActivityIndicator size="large" color="#fff" style={styles.loader} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: "#333",
    },
    image: {
        width: 500,
        height: 500,
        resizeMode: 'contain',
        marginBottom: '100px',
    },
    loader: {
        position: 'absolute',
        bottom: 130,
    },
});