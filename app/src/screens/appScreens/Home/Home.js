import axios from "axios";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator, FlatList, SafeAreaView, TextInput } from "react-native";

const api = axios.create({
  baseURL: "https://api-basketball.p.rapidapi.com",
  headers: {
    "x-rapidapi-key": "7fa880eb43msh5d32f8e9f689be4p1459efjsn6eb1f0a5d54f",
    "x-rapidapi-host": "api-basketball.p.rapidapi.com",
    "Accept": "application/json",
  },
});

const Home = () => {
  const [nbaStandings, setNbaStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchNBAStandings = async () => {
    try {
      const response = await api.get("/standings", {
        params: { league: 12, season: "2023-2024" },
      });
      console.log("Resposta da API:", response.data.response);
      setNbaStandings(response.data.response || []);
    } catch (error) {
      console.error("Erro ao buscar dados:", error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.message || "Erro desconhecido" : error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNBAStandings();
  }, []);

  const filteredTeams = nbaStandings.filter((team) => {
    const teamName = team.team && team.team.name;
    return teamName && teamName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  console.log("Times filtrados:", filteredTeams); // Log dos times filtrados

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
          placeholderTextColor="#fff"
        />
      </View>
      <View style={styles.orangeBar} />
      <FlatList
        data={filteredTeams}
        keyExtractor={(item) => item.team.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.teamContainer}>
            <Text style={styles.teamName}>{item.team.name}</Text>
            <Text>Posição: {item.position}</Text>
            <Text>Vitórias: {item.games.win.total}</Text>
            <Text>Derrotas: {item.games.lose.total}</Text>
          </View>
        )}
        contentContainerStyle={styles.flatListContent}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum time encontrado.</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#54514F",
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginHorizontal: 10,
    color: "white",
    backgroundColor: "#A69F9C",
    borderRadius: 5,
    height: 50,
  },
  teamContainer: {
    backgroundColor: "lightgray",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  teamName: {
    color: "black",
    fontSize: 18,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7D7875",
    padding: 10,
  },
  orangeBar: {
    height: 4,
    backgroundColor: "#F55900",
  },
  emptyText: {
    color: "white",
    textAlign: "center",
    marginTop: 20,
  },
});

export default Home;
