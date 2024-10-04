import React, { useState } from 'react';
import { Alert, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../components/UserContext';
import goatlogo from '../../../assets/goatlogo.png'; // Verifique se o caminho está correto
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

const BUTTON_COLOR = '#F56D09';

const Navbar = ({ searchTerm, setSearchTerm }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [logoutModalVisible, setLogoutModalVisible] = useState(false); // Estado para o modal de logout
    const [imageURL, setImageURL] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const { userData, updateUserData } = useUser();

    const openImagePicker = () => {
        launchImageLibrary({ mediaType: 'photo' }, async (response) => {
            if (response.assets && response.assets.length > 0) {
                const uri = response.assets[0].uri;
                await updateProfileImage(uri);
            } else {
                Alert.alert('Erro', 'Nenhuma imagem selecionada.');
            }
        });
    };

    const updateProfileImage = async (uri) => {
        setLoading(true);
        try {
            await updateUserData({ profileImage: uri });
            setModalVisible(false);
            Alert.alert('Sucesso', 'Imagem de perfil atualizada com sucesso.');
        } catch (error) {
            console.error('Error updating profile image:', error);
            Alert.alert('Erro', 'Falha ao atualizar a imagem de perfil.');
        } finally {
            setLoading(false);
        }
    };

    const handleImageURLSubmit = async () => {
        if (!imageURL.trim()) {
            Alert.alert('Erro', 'Por favor, insira uma URL válida.');
            return;
        }
        await updateProfileImage(imageURL);
    };

    const handleProfilePress = () => {
        navigation.navigate('Perfil');
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            Alert.alert('Erro', 'Por favor, insira uma consulta de busca.');
            return;
        }
        try {
            const response = await fetch(`https://api.rapidapi.com/basketball/teams?query=${searchTerm}`, {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': '7fa880eb43msh5d32f8e9f689be4p1459efjsn6eb1f0a5d54f',
                    'X-RapidAPI-Host': 'api.rapidapi.com'
                }
            });
            const data = await response.json();
            console.log(data);
            Alert.alert('Sucesso', `Times encontrados: ${data.teams.length}`);
        } catch (error) {
            console.error('Error fetching teams:', error);
            Alert.alert('Erro', 'Falha ao buscar os times.');
        }
    };

    const handleLogout = async () => {
        setLoading(true); // Defina loading como true antes de tentar o logout
        try {
            await signOut(auth);
            await updateUserData({ username: '', email: '', profileImage: '' });
            Alert.alert('Logout', 'Você foi desconectado com sucesso.');
            navigation.navigate('Login');
        } catch (error) {
            console.error('Error signing out:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao tentar fazer logout.');
        } finally {
            setLoading(false); // Assegure-se de que o loading é definido como false
        }
    };

    return (
        <View>
            <View style={styles.navbar}>
                <TouchableOpacity onPress={handleProfilePress}>
                    <Image
                        source={userData.profileImage ? { uri: userData.profileImage } : goatlogo}
                        style={styles.profileImage}
                        resizeMode="cover"
                    />
                </TouchableOpacity>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar times..."
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    placeholderTextColor="#fff"
                />
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <AntDesign name="setting" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setLogoutModalVisible(true)} style={styles.logoutButton}>
                    <AntDesign name="logout" size={20} color="white" />
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
                            placeholderTextColor="#ccc"
                            value={imageURL}
                            onChangeText={setImageURL}
                        />
                        <TouchableOpacity style={styles.button} onPress={handleImageURLSubmit}>
                            <Text style={styles.buttonText}>Carregar Avatar</Text>
                        </TouchableOpacity>
                        <View style={styles.separator} />
                        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                            <Text style={styles.buttonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal de confirmação de logout */}
            <Modal
                transparent={true}
                visible={logoutModalVisible}
                onRequestClose={() => setLogoutModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Confirmação de Logout</Text>
                        <Text style={styles.modalMessage}>Você realmente deseja sair do aplicativo?</Text>

                        <TouchableOpacity style={styles.button} onPress={handleLogout}>
                            <Text style={styles.buttonText}>Sair</Text>
                        </TouchableOpacity>
                        <View style={styles.separator} />
                        <TouchableOpacity style={styles.button} onPress={() => setLogoutModalVisible(false)}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={BUTTON_COLOR} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#7D7875',
        padding: 10,
        position: 'relative',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: 'transparent',
    },
    searchInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginHorizontal: 10,
        color: 'white',
        backgroundColor: '#A69F9C',
        borderRadius: 5,
    },
    orangeBar: {
        height: 4,
        backgroundColor: '#F55900',
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
    modalMessage: {
        fontSize: 16,
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
        textAlign: 'center',
    },
    buttonSeparator: {
        height: 10,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutButton: {
        marginLeft: 10,
        color: '#F56D09',
    },
});

export default Navbar;
