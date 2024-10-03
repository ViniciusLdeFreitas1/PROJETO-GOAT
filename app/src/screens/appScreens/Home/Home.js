import axios from "axios"; 
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator, FlatList, SafeAreaView, TextInput, Image, TouchableOpacity, Alert } from "react-native";
import Navbar from "../../../components/Navbar";

const api = axios.create({
  baseURL: "https://api-basketball.p.rapidapi.com",
  headers: {
    "x-rapidapi-key": "7fa880eb43msh5d32f8e9f689be4p1459efjsn6eb1f0a5d54f",
    "x-rapidapi-host": "api-basketball.p.rapidapi.com",
    "Accept": "application/json",
  },
});

const Home = () => {
  const [easternTeams, setEasternTeams] = useState([]);
  const [westernTeams, setWesternTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentConference, setCurrentConference] = useState(0); // 0 = Leste, 1 = Oeste

  const fetchNBAStandings = async () => {
    setLoading(true);
    try {
      const response = await api.get("/standings", {
        params: { league: 12, season: "2023-2024" },
      });

      const standingsData = response.data.response[0];

      if (standingsData && Array.isArray(standingsData)) {
        const eastern = standingsData.filter(team => team.conference === "East");
        const western = standingsData.filter(team => team.conference === "West");
        setEasternTeams(eastern);
        setWesternTeams(western);
      } else {
        console.error("Dados de standings não encontrados");
        setEasternTeams([]);
        setWesternTeams([]);
      }

      setError("");
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setError(error.response ? error.response.data.message || "Erro ao carregar dados. Tente novamente." : "Erro desconhecido.");
      Alert.alert("Erro", error.message || "Erro desconhecido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNBAStandings();
  }, []);

  // Filtra as equipes com base no termo de busca
  const filteredTeams = (currentConference === 0 ? easternTeams : westernTeams).filter((team) => {
    const teamName = team.team?.name;
    return teamName && teamName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const conferenceNames = ["Conferência Leste", "Conferência Oeste"];

  const handleConferenceChange = (direction) => {
    setCurrentConference((prev) => {
      const nextConference = prev + direction;
      return Math.max(0, Math.min(nextConference, 1));
    });
  };

  const handleRetry = () => {
    fetchNBAStandings();
  };

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
        <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Navbar>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar times..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor="#fff"
        />
      </Navbar>
      <View style={styles.orangeBar} />
      <View style={styles.conferenceHeader}>
        <TouchableOpacity onPress={() => handleConferenceChange(-1)} disabled={currentConference === 0}>
          <Text style={styles.arrow}>&lt;</Text>
        </TouchableOpacity>
        <Text style={styles.conferenceTitle}>{conferenceNames[currentConference]}</Text>
        <TouchableOpacity onPress={() => handleConferenceChange(1)} disabled={currentConference === 1}>
          <Text style={styles.arrow}>&gt;</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.underline} />
      <FlatList
        data={filteredTeams}
        keyExtractor={(item) => item.team.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.teamContainer}>
            <Image
              source={{ uri: item.team.logo }}
              style={styles.teamLogo}
            />
            <View style={styles.teamInfo}>
              <Text style={styles.teamName}>{item.team.name}</Text>
              <Text>Posição: {item.position}</Text>
              <Text>Vitórias: {item.games?.win?.total}</Text>
              <Text>Derrotas: {item.games?.lose?.total}</Text>
              <Text>Classificação: {item.position}</Text>
            </View>
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
  conferenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  arrow: {
    fontSize: 24,
    color: "#F55900",
    paddingHorizontal: 15,
  },
  conferenceTitle: {
    color: "white",
    fontSize: 20,
  },
  underline: {
    height: 2,
    backgroundColor: "#F55900",
    marginBottom: 10,
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "lightgray",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  teamLogo: {
    width: 50,  // Ajuste o tamanho do logo
    height: 50, // Ajuste o tamanho do logo
    marginRight: 15,
  },
  teamInfo: {
    flex: 1,
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
  orangeBar: {
    height: 4,
    backgroundColor: "#F55900",
  },
  emptyText: {
    color: "white",
    textAlign: "center",
    marginTop: 20,
  },
  retryButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#F55900",
    borderRadius: 5,
    alignItems: "center",
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default Home;
