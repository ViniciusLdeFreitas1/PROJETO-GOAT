import axios from "axios";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator, FlatList, SafeAreaView, Image, TextInput } from "react-native";

const api = axios.create({
  baseURL: "https://api-basketball.p.rapidapi.com",
  headers: {
    "x-rapidapi-key": "7fa880eb43msh5d32f8e9f689be4p1459efjsn6eb1f0a5d54f",
    "x-rapidapi-host": "api-basketball.p.rapidapi.com",
  },
});

const fetchGames = async () => {
  try {
    const response2023 = await api.get("/games", {
      params: {
        league: 12,
        season: "2023-2024",
        timezone: "Europe/London",
      },
    });
    
    const response2024 = await api.get("/games", {
      params: {
        league: 12,
        season: "2024-2025",
        timezone: "Europe/London",
      },
    });
    
    return [...response2023.data.response, ...response2024.data.response]; 
  } catch (error) {
    console.error("Falha ao buscar os jogos", error);
    throw error;
  }
};

export default function Times() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getGames = async () => {
      try {
        const gamesData = await fetchGames();
        setGames(gamesData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getGames();
  }, []);

  const filteredGames = games.filter(game => {
    const homeName = game.teams.home.name.toLowerCase();
    const awayName = game.teams.away.name.toLowerCase();
    return homeName.includes(searchTerm.toLowerCase()) || awayName.includes(searchTerm.toLowerCase());
  });

  const groupedGames = filteredGames.reduce((acc, game) => {
    const date = new Date(game.date).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(game);
    return acc;
  }, {});

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
          placeholder="Buscar times..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor="#fff" // Cor do texto do placeholder
        />
      </View>
      <View style={styles.orangeBar} />
      <FlatList
        data={Object.keys(groupedGames)}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.dateHeader}>{item}</Text>
            {groupedGames[item].map(game => (
              <View key={game.id} style={styles.card}>
                <View style={styles.teamContainer}>
                  <View style={styles.teamInfo}>
                    <Image source={{ uri: game.teams.home.logo }} style={styles.logo} resizeMode="contain" />
                  </View>
                  <Text style={styles.score}>{game.scores.home.total} - {game.scores.away.total}</Text>
                  <View style={styles.teamInfo}>
                    <Image source={{ uri: game.teams.away.logo }} style={styles.logo} resizeMode="contain" />
                  </View>
                </View>
                <Text>Status: {game.status.long === "Not Started" ? "Não começado" : game.status.long === "Game Finished" ? "Game Finalizado" : game.status.long}</Text>
                <Text>Data: {new Date(game.date).toLocaleString()}</Text>
              </View>
            ))}
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
  dateHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#F55900',
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    width: '100%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  teamInfo: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 5,
  },
  score: {
    fontSize: 22,
    fontWeight: 'bold',
    width: 70,
    textAlign: 'center',
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7D7875',
    padding: 10,
    position: 'relative',
  },
  orangeBar: {
    height: 4,
    backgroundColor: '#F55900',
  },
});
