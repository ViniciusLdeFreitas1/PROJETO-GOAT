import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  TextInput,
  Image,
} from "react-native";

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
    console.log(response.data.response); // Verificar os dados retornados
    return response.data.response; // Remover filtro por ID
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
        console.log('Teams Data:', teamsData); // Verificar os dados dos times
        setTeams(teamsData);
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    getTest();
  }, []);

  const filteredTeams = teams.filter(team => team.name.toLowerCase().includes(searchTerm.toLowerCase()));
  console.log('Filtered Teams:', filteredTeams); // Verificar os times filtrados

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

  if (filteredTeams.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Nenhum time encontrado.</Text>
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
            console.log("Texto digitado:", text); 
          }}
          placeholderTextColor="#fff"
        />
      </View>
      <View style={styles.orangeBar} />
      <FlatList
        data={teams}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text
              style={styles.teamName}
              accessibilityLabel={`Time: ${item.name}`}
            >
              {item.name}
            </Text>
            <Image
              source={{ uri: item.logo }}
              style={styles.logo}
              resizeMode="contain"
            />
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
    borderColor: "#ccc",
    padding: 10,
    marginHorizontal: 10,
    color: "white",
    backgroundColor: "#A69F9C",
    borderRadius: 5,
    height: 50,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    width: "100%",
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
    fontWeight: "bold",
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7D7875",
    padding: 10,
  },
  orangeBar: {
    height: 4,
    backgroundColor: "#F55900",
    marginBottom: 10,
  },
});
