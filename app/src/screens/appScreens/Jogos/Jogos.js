import axios from "axios";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator, FlatList, SafeAreaView, TextInput, Image } from "react-native";

const api = axios.create({
  baseURL: "https://api-basketball.p.rapidapi.com",
  headers: {
    "x-rapidapi-key": "7fa880eb43msh5d32f8e9f689be4p1459efjsn6eb1f0a5d54f",
    "x-rapidapi-host": "api-basketball.p.rapidapi.com",
  },
});

const fetchTeams = async () => {
  try {
    const response = await api.get("/teams", {
      params: {
        league: 12,
      },
    });
    return response.data.response.filter(team => team.id >= 132 && team.id <= 161);
  } catch (error) {
    console.error("Falha ao buscar os times", error);
    throw error;
  }
};

export default function Times() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getTeams = async () => {
      try {
        const teamsData = await fetchTeams();
        setTeams(teamsData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getTeams();
  }, []);

  // Filtro baseado no termo de pesquisa
  const filteredTeams = teams.filter((team) => {
    const lowercasedFilter = searchTerm.toLowerCase();
    return team.name.toLowerCase().includes(lowercasedFilter);
  });

  // Debugging para verificar os times filtrados e o termo de busca
  console.log("Filtered Teams: ", filteredTeams); // Verifica os times filtrados
  console.log("Search Term: ", searchTerm); // Verifica o termo de busca

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
          onChangeText={(text) => {
            setSearchTerm(text);
            console.log("Texto digitado:", text); // Verifica se o texto está sendo atualizado
          }}
          placeholderTextColor="#fff"
        />
      </View>
      <View style={styles.orangeBar} />
      <FlatList
        data={filteredTeams}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.teamName} accessibilityLabel={`Time: ${item.name}`}>
              {item.name}
            </Text>
            <Image source={{ uri: item.logo }} style={styles.logo} resizeMode="contain" />
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
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  logo: {
    width: 80,
    height: 80,
    marginTop: 5,
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
  },
  orangeBar: {
    height: 4,
    backgroundColor: '#F55900',
    marginBottom: 10,
  },
});
