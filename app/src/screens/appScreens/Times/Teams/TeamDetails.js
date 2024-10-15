import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

const api = axios.create({
  baseURL: "https://api-basketball.p.rapidapi.com",
  headers: {
    "x-rapidapi-key": "7fa880eb43msh5d32f8e9f689be4p1459efjsn6eb1f0a5d54f",
    "x-rapidapi-host": "api-basketball.p.rapidapi.com",
  },
});

const TeamDetails = ({ route }) => {
  const navigation = useNavigation();
  const { teamId, conference, position, fromHome } = route.params;
  const [teamInfo, setTeamInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextGame, setNextGame] = useState(null);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      const options = {
        method: "GET",
        url: "https://api-basketball.p.rapidapi.com/teams",
        params: { id: teamId },
        headers: {
          "x-rapidapi-key":
            "7fa880eb43msh5d32f8e9f689be4p1459efjsn6eb1f0a5d54f",
          "x-rapidapi-host": "api-basketball.p.rapidapi.com",
        },
      };

      try {
        const response = await axios.request(options);
        setTeamInfo(response.data.response[0]);
        setLoading(false);
      } catch (error) {
        setError("Erro ao buscar informações do time");
        setLoading(false);
      }
    };

    const fetchNextGame = async () => {
      try {
        const response = await api.get("/games", {
          params: {
            league: 12, 
            season: "2024-2025", 
            timezone: "Europe/London",
          },
        });

        // Filtrar o próximo jogo do time
        const upcomingGames = response.data.response.filter(
          (game) =>
            game.teams.home.id === teamId || game.teams.away.id === teamId
        );

        if (upcomingGames.length > 0) {
          // Ordena os jogos e pega o primeiro (próximo jogo)
          upcomingGames.sort((a, b) => new Date(a.date) - new Date(b.date));
          setNextGame(upcomingGames[0]);
        }
      } catch (error) {
        setError("Erro ao buscar o próximo jogo");
      }
    };

    fetchTeamDetails();
    fetchNextGame();
  }, [teamId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      {teamInfo ? (
        <View style={styles.infoContainer}>
          <View style={styles.card}>
            <Image source={{ uri: teamInfo.logo }} style={styles.logo} />
            <Text style={styles.title}>{teamInfo.name}</Text>
            <Image
              source={{
                uri:
                  teamInfo.country?.flag ||
                  "https://example.com/default-flag.png",
              }}
              style={styles.flag}
            />
            <Text style={styles.info}>
              País: {teamInfo.country?.name || "N/A"}
            </Text>
            {fromHome && (
              <>
                <Text style={styles.info}>
                  Conferência: {conference || "N/A"}
                </Text>
                <Text style={styles.info}>Posição: {position || "N/A"}</Text>
              </>
            )}
          </View>

          {/* Card do próximo jogo */}
          {nextGame && (
            <View style={styles.nextGameCard}>
              <Text style={styles.nextGameTitle}>Último Jogo</Text>
              <View style={styles.teamContainer}>
                <Image
                  source={{ uri: nextGame.teams.home.logo }}
                  style={styles.nextGameLogo}
                />
                <Text style={styles.score}>
                  {nextGame.scores.home.total} - {nextGame.scores.away.total}
                </Text>
                <Image
                  source={{ uri: nextGame.teams.away.logo }}
                  style={styles.nextGameLogo}
                />
              </View>
              <Text style={styles.statusText}>
                Status:{" "}
                {nextGame.status.long === "Not Started"
                  ? "Não começado"
                  : nextGame.status.long}
              </Text>
              <Text style={styles.dateText}>
                Data: {new Date(nextGame.date).toLocaleString()}
              </Text>
            </View>
          )}
        </View>
      ) : (
        <Text style={styles.errorText}>Time não encontrado.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#333",
  },
  backButton: {
    alignSelf: "flex-start",
    marginVertical: 10,
  },
  infoContainer: {
    alignItems: "center",
    width: "100%",
  },
  card: {
    borderRadius: 10,
    backgroundColor: "#222",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  nextGameCard: {
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: "#222",
    padding: 15,
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  nextGameTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  teamContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  nextGameLogo: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  score: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    width: 70,
    textAlign: "center",
  },
  statusText: {
    color: "white",
  },
  dateText: {
    color: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#fff",
  },
  flag: {
    width: 50,
    height: 30,
    marginVertical: 10,
  },
  info: {
    fontSize: 18,
    color: "#fff",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
    resizeMode: "contain",
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
});

export default TeamDetails;
