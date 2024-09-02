import React from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';

export default function Perfil() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.menuButton}>
                    <Text style={styles.menuText}>≡</Text>
                </TouchableOpacity>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar"
                    />
                    <TouchableOpacity style={styles.searchIcon}>
                        <Text style={styles.searchIconText}>🔍</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.profileButton}>
                    <Text style={styles.profileText}>👤</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.profile}>
                <Image
                    style={styles.profileImage}
                />
                <Text style={styles.profileName}>Michael Jordan</Text>
                <Text style={styles.profileEmail}>nome@email.com</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>🔔</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Plantel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>⚙️</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.sections}>
                <Text style={styles.sectionTitle}>Seguindo</Text>
                <Text style={styles.sectionSubtitle}>Times</Text>
                <TouchableOpacity style={styles.team}>
                    <Image

                        style={styles.teamImage}
                    />
                </TouchableOpacity>
                <Text style={styles.sectionSubtitle}>Jogadores</Text>
                <TouchableOpacity style={styles.player}>
                    <Image

                        style={styles.playerImage}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222',
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
    menuText: {
        color: '#fff',
        fontSize: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 5,
        flex: 1,
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
    searchIconText: {
        color: '#fff',
        fontSize: 20,
    },
    profileButton: {
        padding: 10,
        backgroundColor: '#333',
        borderRadius: 5,
    },
    profileText: {
        color: '#fff',
        fontSize: 20,
    },
    profile: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
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
        fontFamily: 'Poppins-Bold', // Ajuste conforme suas fontes
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
    team: {
        padding: 10,
        backgroundColor: '#333',
        borderRadius: 5,
        marginBottom: 10,
    },
    teamImage: {
        width: 100,
        height: 100,
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
    },
    PerfilHeader: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    }
});
