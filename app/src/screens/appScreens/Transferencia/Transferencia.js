import axios from "axios";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator, FlatList, SafeAreaView, TextInput } from "react-native";

const api = axios.create({
  baseURL: "https://api-basketball.p.rapidapi.com",
  headers: {
    "x-rapidapi-key": "7fa880eb43msh5d32f8e9f689be4p1459efjsn6eb1f0a5d54f",
    "x-rapidapi-host": "api-basketball.p.rapidapi.com",
  },
});

// Função para buscar jogadores em vez de odds
const fetchPlayers = async () => {
  try {
    const response = await api.get("/players", {
      params: {
        league: 12, // ajuste o parâmetro conforme necessário
      },
    });
    return response.data.response;
  } catch (error) {
    console.error("Falha ao buscar os jogadores", error);
    throw error;
  }
};

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getPlayers = async () => {
      try {
        const playersData = await fetchPlayers();
        setPlayers(playersData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getPlayers();
  }, []);

  // Filtra os jogadores com base no termo de busca
  const filteredPlayers = players.filter(player => {
    return player.name && player.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro: {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navbar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar jogadores..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor="#fff"
        />
      </View>
      <View style={styles.orangeBar} />
      <FlatList
        data={filteredPlayers}
        keyExtractor={(item) => item.id.toString()} // Ajuste conforme necessário
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Nome: {item.name || 'Desconhecido'}</Text>
            <Text>Time: {item.team || 'Desconhecido'}</Text>
            <Text>Pontos: {item.points || 'N/A'}</Text>
          </View>
        )}
        contentContainerStyle={styles.flatListContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#54514F",
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7D7875',
    padding: 10,
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
    height: 50,
  },
  orangeBar: {
    height: 4,
    backgroundColor: '#F55900',
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  flatListContent: {
    paddingBottom: 20,
  },
});
