// Perfil.js
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import { useUser } from '../../../components/UserContext';

export default function Perfil({ navigation }) {
    const { userData, updateUserData } = useUser();

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            const selectedImageUri = result.assets[0].uri;
            try {
                await updateUserData({ profileImage: selectedImageUri });
                Alert.alert('Sucesso', 'Imagem de perfil atualizada com sucesso.');
            } catch (error) {
                console.error('Error updating profile image:', error);
                Alert.alert('Erro', 'Falha ao atualizar a imagem de perfil.');
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.profile}>
                <TouchableOpacity onPress={pickImage}>
                    {userData.profileImage ? (
                        <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
                    ) : (
                        <View style={styles.placeholder}>
                            <Text style={styles.placeholderText}>Foto</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <Text style={styles.profileName}>{userData.username}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton}>
                    <FontAwesome name="bell" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Plantel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <FontAwesome name="cog" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
            <View style={styles.sections}>
                <Text style={styles.sectionTitle}>Seguindo</Text>
                <Text style={styles.sectionSubtitle}>Times</Text>
                <TouchableOpacity style={styles.team}>
                    <Image
                        style={styles.teamImage}
                        source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-Ld9sSzDQr1jTUZbJovDrGPLzsrHBwR.svg' }}
                    />
                </TouchableOpacity>
                <Text style={styles.sectionSubtitle}>Jogadores</Text>
                <TouchableOpacity style={styles.player}>
                    <Image
                        style={styles.playerImage}
                        source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-Ld9sSzDQr1jTUZbJovDrGPLzsrHBwR.svg' }}
                    />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#5B5959',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    menuButton: {
        padding: 10,
        backgroundColor: '#333',
        borderRadius: 5,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        margin: 20,
    },
    searchInput: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        padding: 10,
    },
    searchIcon: {
        padding: 10,
        backgroundColor: '#444',
        borderRadius: 5,
    },
    profileButton: {
        padding: 10,
        backgroundColor: '#333',
        borderRadius: 5,
    },
    profile: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        resizeMode: 'cover',
    },
    placeholder: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#C1644F',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: 'white',
        fontFamily: 'Poppins-Bold',
    },
    profileName: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    profileEmail: {
        color: '#fff',
        fontSize: 16,
        marginTop: 5,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    actionButton: {
        flex: 1,
        padding: 10,
        backgroundColor: '#333',
        borderRadius: 5,
        alignItems: 'center',
        margin: 5,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    button: {
        backgroundColor: '#C1644F',
        padding: 10,
        borderRadius: 5,
        width: '80%',
        alignItems: 'center',
        marginTop: 20,
        alignSelf: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
    },
    player: {
        padding: 10,
        backgroundColor: '#333',
        borderRadius: 5,
    },
    playerImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        resizeMode: 'cover',
    },
    team: {
        padding: 10,
        backgroundColor: '#333',
        borderRadius: 5,
        marginBottom: 10,
    },
    teamImage: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
    },
    sections: {
        marginBottom: 20,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    sectionSubtitle: {
        color: '#fff',
        fontSize: 18,
        marginBottom: 10,
    },
});