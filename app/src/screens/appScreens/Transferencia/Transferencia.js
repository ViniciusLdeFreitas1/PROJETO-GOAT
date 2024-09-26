import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, FlatList, SafeAreaView } from 'react-native'
import { fetchSeasons } from '../services/seasons/api';


export default function Transferencia() {
    const [seasons, setSeasons] = useState([]);

    useEffect(() => {
        const getSeasons = async () => {
            try {
                const data = await fetchSeasons();
                setSeasons(data);
            }
            catch (error) {
                console.error("Erro ao carregar as temporadas", error)
            }
        }

        getSeasons();
    }, [])
    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={seasons}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.text} onPress={() => navigation.navigate('Temporadas')}>Temporada: {item}</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#54514F",
    },
    item: {
        padding: 10,
        marginVertical: 8,
        backgroundColor: "#fff",
    },
    text: {
        fontSize: 18,
        color: "#333",
    }
})