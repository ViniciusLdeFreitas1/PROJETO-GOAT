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
  ScrollView,
  Picker,
} from "react-native";
import Navbar from '../../../components/Navbar'; // Importando a Navbar

const api = axios.create({
  baseURL: "https://api-basketball.p.rapidapi.com",
  headers: {
    "x-rapidapi-key": "7fa880eb43msh5d32f8e9f689be4p1459efjsn6eb1f0a5d54f", // Substitua pela sua chave de API
    "x-rapidapi-host": "api-basketball.p.rapidapi.com",
    "Accept": "application/json",
  },
});

const Home = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTeams, setFilteredTeams] = useState([]); // Estado para os times filtrados
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
        const teamName = item.team?.name;
        if (teamName && !seenTeams.has(teamName)) {
          uniqueTeams.push(item);
          seenTeams.add(teamName);
        }
      });

      setTeams(uniqueTeams);
      setFilteredTeams(uniqueTeams); // Define os times filtrados inicialmente como todos os times
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
  }, []); // O useEffect só deve ser chamado uma vez na montagem do componente

  const handleRetry = () => {
    fetchNBAStandings();
  };

  const easternTeamsNames = [
    "Celtics", "Nets", "Knicks", "76ers", "Raptors", "Bulls", "Cavaliers",
    "Pistons", "Heat", "Magic", "Hawks", "Hornets", "Pacers", "Wizards",
  ];

  const westernTeamsNames = [
    "Thunder", "Mavericks", "Nuggets", "Warriors", "Rockets", "Clippers",
    "Lakers", "Trail Blazers", "Suns", "Grizzlies", "Kings", "Pelicans",
    "Jazz", "Timberwolves",
  ];

  const filterTeamsByConference = (conference) => {
    return teams.filter(team => 
      (conference === "Leste" 
        ? easternTeamsNames.some(name => team.team?.name?.includes(name))
        : westernTeamsNames.some(name => team.team?.name?.includes(name))
      )
    );
  };

  useEffect(() => {
    setFilteredTeams(filterTeamsByConference(activeConference)); // Atualiza os times filtrados quando a conferência ativa muda
  }, [activeConference, teams]);

  const renderTeamList = () => {
    const filteredTeamsList = filteredTeams.filter((team) =>
      team.team?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!filteredTeamsList.length) {
      return <Text style={styles.emptyText}>Nenhum time encontrado.</Text>;
    }

    return (
      <FlatList
        data={filteredTeamsList}
        keyExtractor={(item) => item.team.id.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.teamRow}>
            <Text style={styles.positionText}>{index + 1}</Text>
            <Image
              source={{ uri: item.team.logo || 'url_da_imagem_padrao' }}
              style={[styles.teamLogo, item.team.name.includes("Clippers") ? styles.clippersLogo : null]} // Adiciona uma classe específica para os Clippers
              resizeMode="contain"
            />
            <Text style={styles.teamName}>{item.team.name}</Text>
            <View style={styles.recordContainer}>
              <Text style={styles.winsText}>V: {item.games.win.total}</Text>
              <Text style={styles.recordSeparator}> </Text>
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
        teams={teams} 
        setFilteredTeams={setFilteredTeams} // Adiciona setFilteredTeams
      />
      
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={activeConference}
          onValueChange={(itemValue) => setActiveConference(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Conferência Leste" value="Leste" />
          <Picker.Item label="Conferência Oeste" value="Oeste" />
        </Picker>
      </View>
  
      <ScrollView style={styles.conferenceContainer}>
        <View style={styles.tableContainer}>
          <Text style={styles.conferenceTitle}>{activeConference === "Leste" ? 'Conferência Leste' : 'Conferência Oeste'}</Text>
          <View style={styles.orangeLine} />
          {renderTeamList()}
        </View>
        
        <View style={styles.extraSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
    padding: 20,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  positionText: {
    color: '#fff',
    width: 30,
  },
  teamLogo: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  clippersLogo: {
    width: 80, // Aumenta a largura da logo do Clippers
    height: 80, // Aumenta a altura da logo do Clippers
    shadowColor: '#000', // Adiciona sombra
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1.5,
  },
  teamName: {
    flex: 1,
    color: '#fff',
  },
  recordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  winsText: {
    color: '#0f0',
  },
  lossesText: {
    color: '#f00',
  },
  emptyText: {
    color: '#fff',
    textAlign: 'center',
  },
  flatListContent: {
    paddingBottom: 20,
  },
  errorText: {
    color: 'red',
  },
  retryButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
  },
  pickerContainer: {
    marginVertical: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#fff',
    backgroundColor: '#333',
  },
  conferenceContainer: {
    flex: 1,
  },
  tableContainer: {
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 5,
  },
  conferenceTitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 5,
  },
  orangeLine: {
    height: 2,
    backgroundColor: 'orange',
    marginBottom: 5,
  },
  extraSpace: {
    height: 50,
  },
  recordSeparator: {
    color: '#fff',
    paddingHorizontal: 5,
  },
});

export default Home;
