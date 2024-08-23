import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Navbar from '../../../components/Navbar';

const DEFAULT_AVATAR = 'https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/71201981163c1c1753fc67cb4c3944db'; // URL do logotipo do GOAT

export default function Home({ navigation }) {
    const [username, setUsername] = useState('');
    const [profileImage, setProfileImage] = useState(DEFAULT_AVATAR);

    useEffect(() => {
        const fetchUsernameAndAvatar = async () => {
            try {
                const storedUsername = await AsyncStorage.getItem('username');
                const storedProfileImage = await AsyncStorage.getItem('profileImage');

                if (storedUsername) {
                    setUsername(storedUsername);
                }

                if (storedProfileImage) {
                    setProfileImage(storedProfileImage);
                } else {
                    await AsyncStorage.setItem('profileImage', DEFAULT_AVATAR);
                }
            } catch (error) {
                console.error('Falha ao recuperar o nome do usuário ou a imagem do perfil', error);
            }
        };

        fetchUsernameAndAvatar();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Navbar
                username={username}
                profileImage={profileImage}
                setProfileImage={setProfileImage}
                navigation={navigation}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#5B5959',
    },
});