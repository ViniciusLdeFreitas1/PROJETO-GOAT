import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import Navbar from '../../../components/Navbar'; // Importando a Navbar

const api = axios.create({
  baseURL: "https://api-basketball.p.rapidapi.com",
  headers: {
    "x-rapidapi-key": "7fa880eb43msh5d32f8e9f689be4p1459efjsn6eb1f0a5d54f",
    "x-rapidapi-host": "api-basketball.p.rapidapi.com",
    "Accept": "application/json",
  },
});

const Home = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeConference, setActiveConference] = useState("Leste");

  const fetchNBAStandings = async () => {
    setLoading(true);
    try {
      const response = await api.get("/standings", {
        params: { league: 12, season: "2023-2024" },
      });

      const standingsData = response.data.response[0];
      if (!standingsData || standingsData.length === 0) {
        throw new Error("Dados de standings não encontrados.");
      }

      const uniqueTeams = [];
      const seenTeams = new Set();

      standingsData.forEach(item => {
        if (!seenTeams.has(item.team.name)) {
          uniqueTeams.push(item);
          seenTeams.add(item.team.name);
        }
      });

      setTeams(uniqueTeams);
      setError("");
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setError(error.response?.data.message || "Erro desconhecido.");
      Alert.alert("Erro", error.message || "Erro desconhecido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNBAStandings();
  }, []);

  const handleRetry = () => {
    fetchNBAStandings();
  };

  const easternTeamsNames = [
    "Celtics",
    "Nets",
    "Knicks",
    "76ers",
    "Raptors",
    "Bulls",
    "Cavaliers",
    "Pistons",
    "Heat",
    "Magic",
    "Hawks",
    "Hornets",
    "Pacers",
    "Wizards",
  ];
  const westernTeamsNames = [
    "Thunder",
    "Mavericks",
    "Nuggets",
    "Warriors",
    "Rockets",
    "Clippers",
    "Lakers",
    "Trail Blazers",
    "Suns",
    "Grizzlies",
    "Kings",
    "Pelicans",
    "Jazz",
    "Timberwolves",
  ];

  const easternConferenceTeams = teams.filter(team =>
    easternTeamsNames.some(name => team.team?.name?.includes(name))
  );
  const westernConferenceTeams = teams.filter(team =>
    westernTeamsNames.some(name => team.team?.name?.includes(name))
  );

  const renderTeamList = (data) => {
    if (!data || data.length === 0) {
      return <Text style={styles.emptyText}>Nenhum time encontrado.</Text>;
    }
    return (
      <FlatList
        data={data.filter((team) =>
          team.team?.name.toLowerCase().includes(searchTerm.toLowerCase())
        )}
        keyExtractor={(item) => item.team.id.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.teamRow}>
            <Text style={styles.positionText}>{index + 1}</Text>
            <Image 
              source={{ uri: item.team.logo || 'url_da_imagem_padrao' }} 
              style={[styles.teamLogo, item.team.name.includes('Heat') && styles.heatLogo]} 
            />
            <Text style={styles.teamName}>{item.team.name}</Text>
            <View style={styles.recordContainer}>
              <Text style={styles.winsText}>V: {item.games.win.total}</Text>
              <View style={styles.lineRecord} />
              <Text style={styles.lossesText}>D: {item.games.lose.total}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.flatListContent}
      />
    );
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
      <Navbar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        onConfigPress={() => Alert.alert("Configurações", "Configurações em desenvolvimento.")} // Adicione a lógica de configuração aqui
      />

      <View style={styles.orangeBar} />

      <View style={styles.spacer} />

      <View style={styles.toggleContainer}>
        <TouchableOpacity 
          onPress={() => setActiveConference("Leste")} 
          style={[styles.toggleButton, activeConference === "Leste" && styles.activeToggle]}
        >
          <Text style={styles.toggleText}>Conferência Leste</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setActiveConference("Oeste")} 
          style={[styles.toggleButton, activeConference === "Oeste" && styles.activeToggle]}
        >
          <Text style={styles.toggleText}>Conferência Oeste</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeConference === "Leste" ? [{ title: 'Conferência Leste', data: easternConferenceTeams }] : [{ title: 'Conferência Oeste', data: westernConferenceTeams }]}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <View style={styles.conferenceContainer}>
            <View style={styles.tableContainer}>
              <Text style={styles.conferenceTitle}>{item.title}</Text>
              <View style={styles.line} />
              {renderTeamList(item.data || [])}
            </View>
          </View>
        )}
        contentContainerStyle={styles.flatListContent}
      />
      <View style={styles.extraSpace} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#54514F",
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    color: "white",
    backgroundColor: "#A69F9C",
    borderRadius: 5,
    height: 40,
  },
  configButton: {
    marginLeft: 10,
  },
  configButtonText: {
    color: "white",
    fontSize: 20,
  },
  teamRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7D7875",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  teamLogo: {
    width: 80,
    height: 80,
    marginRight: 10,
    resizeMode: "contain",
  },
  heatLogo: {
    width: 100,
    height: 100,
  },
  teamName: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },
  positionText: {
    color: "#F55900",
    fontSize: 20,
    marginRight: 10,
  },
  recordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  lineRecord: {
    height: 25,
    width: 2,
    backgroundColor: "#fff",
    marginHorizontal: 10,
  },
  winsText: {
    color: "#00FF00",
  },
  lossesText: {
    color: "#FF0000",
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
    backgroundColor: "#FFDDDD",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  retryButtonText: {
    color: "red",
    textAlign: "center",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  toggleButton: {
    backgroundColor: "#7D7875",
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  activeToggle: {
    backgroundColor: "#F55900",
  },
  toggleText: {
    color: "white",
    fontWeight: "bold",
  },
  conferenceContainer: {
    marginVertical: 8,
  },
  tableContainer: {
    padding: 8,
    backgroundColor: "#7D7875",
    borderRadius: 6,
  },
  conferenceTitle: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    marginBottom: 5,
  },
  line: {
    height: 2,
    backgroundColor: "#fff",
    marginVertical: 5,
  },
  spacer: {
    height: 10,
  },
  extraSpace: {
    height: 20, // Ajuste a altura do espaço conforme necessário
  },
});

export default Home;
