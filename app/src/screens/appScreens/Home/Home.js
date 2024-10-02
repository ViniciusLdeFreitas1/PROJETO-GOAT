import React, { useEffect, useState } from "react";
import axios from "axios";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

const Home = () => {
  const [nbaStandings, setNbaStandings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNBAStandings = async () => {
    try {
      setLoading(true);

      // Faz a requisição à API
      const response = await axios.get(
        "https://api-basketball.p.rapidapi.com/standings",
        {
          headers: {
            "x-rapidapi-key": "7fa880eb43msh5d32f8e9f689be4p1459efjsn6eb1f0a5d54f",
            "x-rapidapi-host": "api-basketball.p.rapidapi.com",
          },
          params: {
            league: 12, // ID da liga da NBA
            season: "2023-2024", // Temporada da NBA
          },
        }
      );

      // Log da resposta completa para referência
      console.log("API response completa:", response.data);

      // Verificar se a resposta contém o array `response`
      if (
        response.data &&
        response.data.response &&
        response.data.response.length > 0
      ) {
        // Ajuste para trabalhar diretamente com o array de standings
        setNbaStandings(response.data.response);
      } else {
        throw new Error("Nenhuma resposta encontrada.");
      }
    } catch (error) {
      setError(error.message);
      console.log("Erro ao buscar standings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNBAStandings();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>Erro: {error}</Text>
      ) : (
        <View>
          {nbaStandings.length > 0 ? (
            nbaStandings.map((teamData, index) => (
              <View key={index} style={styles.teamContainer}>
                <Text>{teamData.team.name}</Text>
                <Text>Posição: {teamData.position}</Text>
                <Text>Vitórias: {teamData.games.win.total}</Text>
                <Text>Derrotas: {teamData.games.lose.total}</Text>
              </View>
            ))
          ) : (
            <Text>Nenhuma informação de standings disponível.</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
  },
  teamContainer: {
    marginVertical: 10,
  },
});

export default Home;
