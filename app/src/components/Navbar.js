import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { Alert, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const BUTTON_COLOR = '#C1644F';

const Navbar = ({ username, profileImage, setProfileImage, navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [imageURL, setImageURL] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const openImagePicker = () => {
        launchImageLibrary({ mediaType: 'photo' }, async (response) => {
            if (response.assets && response.assets.length > 0) {
                const uri = response.assets[0].uri;
                setProfileImage(uri);
                await AsyncStorage.setItem('profileImage', uri);
                setModalVisible(false);
            }
        });
    };

    const handleImageURLSubmit = async () => {
        setProfileImage(imageURL);
        await AsyncStorage.setItem('profileImage', imageURL);
        setModalVisible(false);
    };

    const handleLogout = async () => {
        try {
            console.log('Iniciando processo de logout...');

            await AsyncStorage.removeItem('username');
            await AsyncStorage.removeItem('profileImage');
            await AsyncStorage.removeItem('authToken');

            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });

            console.log('Logout concluído e navegação atualizada.');
        } catch (error) {
            console.error('Falha ao fazer logout', error);
        }
    };

    return (
        <View>
            <View style={styles.navbar}>
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
                <Text style={styles.username}>{username || 'Usuário'}</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <AntDesign name="setting" size={20} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.orangeBar} />

            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Opções</Text>

                        <TouchableOpacity style={styles.button} onPress={openImagePicker}>
                            <Text style={styles.buttonText}>Escolher da Galeria</Text>
                        </TouchableOpacity>
                        <View style={styles.separator} />
                        <TextInput
                            style={styles.urlInput}
                            placeholder="Cole a URL da imagem aqui"
                            value={imageURL}
                            onChangeText={setImageURL}
                        />
                        <TouchableOpacity style={styles.button} onPress={handleImageURLSubmit}>
                            <Text style={styles.buttonText}>Carregar Avatar</Text>
                        </TouchableOpacity>
                        <View style={styles.separator} />
                        <View style={styles.separator} />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => Alert.alert(
                                "Confirmar Logout",
                                "Você tem certeza que deseja sair?",
                                [
                                    {
                                        text: "Cancelar",
                                        style: "cancel",
                                    },
                                    {
                                        text: "OK",
                                        onPress: handleLogout,
                                    },
                                ]
                            )}
                        >
                            <Text style={styles.buttonText}>Logout</Text>
                        </TouchableOpacity>
                        <View style={styles.buttonSeparator} />
                        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                            <Text style={styles.buttonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#7D726F',
        padding: 10,
        position: 'relative',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    username: {
        flex: 1,
        fontSize: 18,
        color: 'white',
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginHorizontal: 10,
        color: 'white',
        backgroundColor: '#5B5959',
        borderRadius: 5,
    },
    orangeBar: {
        height: 4,
        backgroundColor: 'orange',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: '#5B5959',
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
    },
    separator: {
        height: 10,
    },
    urlInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        color: 'white',
    },
    button: {
        backgroundColor: BUTTON_COLOR,
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    buttonSeparator: {
        height: 10,
    },
});

export default Navbar;
