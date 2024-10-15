import axios from "axios";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator, FlatList, TouchableOpacity, SafeAreaView, Image, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';

const api = axios.create({
  baseURL: "https://api-basketball.p.rapidapi.com",
  headers: {
    "x-rapidapi-key": "7fa880eb43msh5d32f8e9f689be4p1459efjsn6eb1f0a5d54f",
    "x-rapidapi-host": "api-basketball.p.rapidapi.com",
  },
});

// Função para buscar todos os times de uma liga específica
const fetchTeamsByLeague = async (leagueId) => {
  console.log(`Buscando times para a liga: ${leagueId}`);
  try {
    const response = await api.get("/teams", {
      params: {
        league: leagueId,
        season: "2023"
      }
    });
    console.log("Dados da API:", response.data);
    if (response.data.response && response.data.response.length > 0) {
      return response.data.response;
    } else {
      console.warn(`Nenhum time encontrado para a liga: ${leagueId}`);
      return [];
    }
  } catch (error) {
    console.error("Falha ao buscar os times da liga", error.response ? error.response.data : error.message);
    throw error;
  }
};

// Definir ligas a serem removidas
const leaguesToRemove = [
  "Albania",
  "Asia",
  "Bosnia Women",
  "China",
  "Republica Checa Women",
  "Europe Women League",
  "Cup Finlandia",
  "Grecia Cup Women",
  "Japão B2",
  "Cazaquistão Higher",
  "Cazaquistão Women",
  "Kosovo Women",
  "Líbano",
  "África do Sul",
  "Taiwan P League",
  "Taiwan T1 League",
  "Reino Unido Women",
  "Prvenstvo BiH Women",
  "Czech Cup Women",
  "Suomen Cup",
  "Suomen Cup Women",
  "Greek Cup Women",
  "B2.League",
  "Higher League",
  "National League Women",
  "Division 1",
  "South American League",
  "Betty Codona Trophy Women",
  "P.League+",
  "Taiwan",
  "World"
];

// Função para remover ligas indesejadas
const removeLeagues = (teams) => {
  return teams.filter(team => {
    return !leaguesToRemove.includes(team.country && team.country.name ? team.country.name : "");
  });
};

export default function Teams({ route, navigation }) {
  const { leagueId, leagueName } = route.params;
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
          if (item && item.id && !seenIds.has(item.id)) {
            seenIds.add(item.id);
            uniqueTeams.push(item);
          }
        });

        // Remover ligas indesejadas
        const filteredTeams = removeLeagues(uniqueTeams);
        console.log("Times filtrados após remoção de ligas indesejadas:", filteredTeams);
        setTeams(filteredTeams);
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
      <ScrollView contentContainerStyle={styles.scrollView}>
        <FlatList
          data={teams}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <TouchableOpacity onPress={() => {
                console.log(`Navegando para detalhes do time: ${item.id}`);
                navigation.navigate("TeamDetails", { teamId: item.id });
              }} style={styles.teamContainer}>
                <Image source={{ uri: item.logo }} style={styles.logo} resizeMode="contain" />
                <View style={styles.teamInfo}>
                  <Text style={styles.cardText}>{item.name}</Text>
                  <Text style={styles.cardText}>País: {item.country && item.country.name ? item.country.name : "Desconhecido"}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.flatListContent}
          ListFooterComponent={<View style={{ height: 50 }} />} // Espaço extra de 50 pixels abaixo do último card
        />
      </ScrollView>
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
  scrollView: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#222",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamInfo: {
    flex: 1,
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
