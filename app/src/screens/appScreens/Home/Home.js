import React from 'react';
import { Image, SafeAreaView, StyleSheet, TextInput, View } from 'react-native';

export default function Home({ navigation }) {

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Buscar..."
                    placeholderTextColor="#ccc"
                />
                <Image
                    source={{ uri: 'https://example.com/user-photo.jpg' }}
                    style={styles.userPhoto}
                />
            </View>
            {/* O conteúdo da sua tela vem aqui */}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#5B5959',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#7D726F',
    },
    searchBar: {
        flex: 1,
        height: 40,
        backgroundColor: '#A49A97',
        borderRadius: 5,
        paddingHorizontal: 10,
        color: 'white',
    },
    userPhoto: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginLeft: 10,
    },
});
