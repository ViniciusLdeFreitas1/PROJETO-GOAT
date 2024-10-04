import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet } from "react-native";
import axios from "axios";

const TeamDetails = ({ route }) => {
  const { teamId } = route.params; // Recebe o ID do time da navegação
  const [teamInfo, setTeamInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      const options = {
        method: "GET",
        url: "https://api-basketball.p.rapidapi.com/teams",
        params: { id: teamId }, // ID do time recebido via navegação
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

    fetchTeamDetails();
  }, [teamId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      {teamInfo && (
        <View>
          <Text style={styles.title}>{teamInfo.name}</Text>
          <Text style={styles.info}>País: {teamInfo.country.name}</Text>
          <Text style={styles.info}>Fundado em: {teamInfo.founded}</Text>
          <Image source={{ uri: teamInfo.logo }} style={styles.logo} />
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
    padding: 20,
    backgroundColor: "#333",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
  },
  info: {
    fontSize: 18,
    marginBottom: 5,
    color: "#fff"
  },
  logo: {
    width: 100,
    height: 100,
    marginTop: 20,
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
});

export default TeamDetails;
