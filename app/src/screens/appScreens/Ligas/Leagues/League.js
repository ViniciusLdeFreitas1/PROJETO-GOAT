import axios from "axios";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator, FlatList, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from '@expo/vector-icons';

const api = axios.create({
  baseURL: "https://api-basketball.p.rapidapi.com",
  headers: {
    "x-rapidapi-key": "7fa880eb43msh5d32f8e9f689be4p1459efjsn6eb1f0a5d54f", // Substitua pelo seu API Key
    "x-rapidapi-host": "api-basketball.p.rapidapi.com",
  },
});

// Função para buscar todos os times de uma liga específica
const fetchTeamsByLeague = async (leagueId) => {
  console.log(`Buscando times para a liga: ${leagueId}`);
  try {
    const response = await api.get("/teams", {
      params: { league: leagueId }
    });
    console.log("Dados da API:", response.data); // Log dos dados recebidos
    if (response.data.response && response.data.response.length > 0) {
      return response.data.response; // Retorna os times da liga se existirem
    } else {
      console.warn(`Nenhum time encontrado para a liga: ${leagueId}`);
      return []; // Retorna um array vazio se não houver times
    }
  } catch (error) {
    console.error("Falha ao buscar os times da liga", error.response ? error.response.data : error.message);
    throw error;
  }
};

export default function Teams({ route, navigation }) {
  const { leagueId, leagueName } = route.params; // Ex: leagueId = 'NBB_ID' (substitua pelo ID real)
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTeams = async () => {
      try {
        console.log(`Iniciando a busca por times para a liga: ${leagueId}`);
        const teamsData = await fetchTeamsByLeague(leagueId);
        
        // Filtrar times não duplicados e válidos
        const uniqueTeams = [];
        const seenIds = new Set();

        teamsData.forEach(item => {
          if (!seenIds.has(item.id)) {
            seenIds.add(item.id);
            uniqueTeams.push(item);
          }
        });

        console.log("Times filtrados:", uniqueTeams);
        
        setTeams(uniqueTeams);
      } catch (error) {
        setError("Erro ao buscar os times");
      } finally {
        setLoading(false);
      }
    };

    getTeams();
  }, [leagueId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ color: 'white' }}>Carregando...</Text>
      </View>
    );
  }

  if (error) {
    console.error("Erro ao carregar times:", error);
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (teams.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Nenhum time encontrado para esta liga.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{leagueName}</Text>
      </View>
      <FlatList
        data={teams}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => {
              console.log(`Navegando para detalhes do time: ${item.id}`);
              navigation.navigate("TeamDetails", { teamId: item.id });
            }}>
              <Text style={styles.cardText}>{item.name}</Text>
              <Text style={styles.cardText}>País: {item.country.name}</Text>
            </TouchableOpacity>
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
    backgroundColor: "#333",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    color: "white",
    fontSize: 24,
    flex: 1,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#222",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  cardText: {
    color: "white",
    fontSize: 18,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
