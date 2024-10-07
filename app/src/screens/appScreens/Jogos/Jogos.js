import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Image,
  TextInput,
  Picker,
  TouchableOpacity,
} from "react-native";
import Fonts from "../../../utils/Fonts";
import Navbar from '../../../components/Navbar';

const api = axios.create({
  baseURL: "https://api-basketball.p.rapidapi.com",
  headers: {
    "x-rapidapi-key": "7fa880eb43msh5d32f8e9f689be4p1459efjsn6eb1f0a5d54f",
    "x-rapidapi-host": "api-basketball.p.rapidapi.com",
  },
});

const fetchGames = async (season) => {
  try {
    const response = await api.get("/games", {
      params: {
        league: 12,
        season,
        timezone: "Europe/London",
      },
    });
    return response.data.response;
  } catch (error) {
    console.error("Falha ao buscar os jogos", error);
    throw error;
  }
};

const Times = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [season, setSeason] = useState("2023-2024");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const getGames = async () => {
      try {
        setLoading(true);
        const gamesData = await fetchGames(season);
        setGames(gamesData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getGames();
  }, [season]);

  const filteredGames = games.filter((game) => {
    const homeName = game.teams.home.name.toLowerCase();
    const awayName = game.teams.away.name.toLowerCase();
    return (
      homeName.includes(searchTerm.toLowerCase()) ||
      awayName.includes(searchTerm.toLowerCase())
    );
  });

  const sortedGames = filteredGames.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const groupedGames = sortedGames.reduce((acc, game) => {
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
      <Navbar setSearchTerm={setSearchTerm} />
      <View style={styles.orangeBar} />
      <Picker
        selectedValue={season}
        style={styles.picker}
        onValueChange={setSeason}
      >
        <Picker.Item label="2024-2025" value="2024-2025" />
        <Picker.Item label="2023-2024" value="2023-2024" />
        <Picker.Item label="2022-2023" value="2022-2023" />
      </Picker>
      <TouchableOpacity
        onPress={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        style={styles.order}
      >
        <Text style={styles.orderText}>Ordenar</Text>
      </TouchableOpacity>
      <FlatList
        data={Object.keys(groupedGames)}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.dateHeader}>{item}</Text>
            {groupedGames[item].map((game) => (
              <View key={game.id} style={styles.card}>
                <View style={styles.teamContainer}>
                  <View style={styles.teamInfo}>
                    <Image
                      source={{ uri: game.teams.home.logo }}
                      style={styles.logo}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.score}>
                    {game.scores.home.total} - {game.scores.away.total}
                  </Text>
                  <View style={styles.teamInfo}>
                    <Image
                      source={{ uri: game.teams.away.logo }}
                      style={styles.logo}
                      resizeMode="contain"
                    />
                  </View>
                </View>
                <Text style={styles.statusText}>
                  Status: {game.status.long === "Not Started"
                    ? "Não começado"
                    : game.status.long === "Game Finished"
                    ? "Jogo Finalizado"
                    : game.status.long}
                </Text>
                <Text style={styles.dateText}>
                  Data: {new Date(game.date).toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        )}
        contentContainerStyle={styles.flatListContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#333",
  },
  // ... other styles ...
  orangeBar: {
    height: 4,
    backgroundColor: "#F55900",
  },
  picker: {
    flex: 1,
    color: "#fff",
    backgroundColor: "#A69F9C",
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 5,
    height: 70,
  },
  order: {
    marginTop: 10,
    marginHorizontal: 10,
    backgroundColor: "#F56D09",
    alignItems: "center",
    borderRadius: 5,
    height: 30,
    marginBottom: 5,
  },
  orderText: {
    color: "white",
    fontSize: 16,
    justifyContent: "center",
    fontFamily: Fonts["poppins-bold"],
  },
});

export default Times;
