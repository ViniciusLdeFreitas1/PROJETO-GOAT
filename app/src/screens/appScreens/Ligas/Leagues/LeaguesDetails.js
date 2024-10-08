import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';

const LeaguesDetails = ({ route, navigation }) => {
  const { leagueId, leagueName, leagueLogo } = route.params; // Obtendo os parâmetros passados pela navegação
  const [teams, setTeams] = useState([]); // Estado para armazenar os times
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      const options = {
        method: 'GET',
        url: 'https://api-basketball.p.rapidapi.com/teams', // Endpoint para buscar times
        params: { league: leagueId }, // Passando o ID da liga
        headers: {
          'x-rapidapi-key': '7fa880eb43msh5d32f8e9f689be4p1459efjsn6eb1f0a5d54f',
          'x-rapidapi-host': 'api-basketball.p.rapidapi.com',
        },
      };

      try {
        const response = await axios.request(options);
        setTeams(response.data.response); // Atualizando o estado com a lista de times
        setLoading(false);
      } catch (error) {
        setError("Erro ao buscar os times da liga");
        setLoading(false);
      }
    };

    fetchTeams();
  }, [leagueId]); // Dependendo do leagueId, atualiza os times

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.infoContainer}>
            <Image
                source={{ uri: leagueLogo }}
                style={styles.leagueLogo}
                resizeMode="contain"
            />
            <Text style={styles.title}>{leagueName}</Text>
            <Text style={styles.info}>Times:</Text>
            <FlatList
                data={teams}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.teamCard}>
                        <Text style={styles.teamText}>{item.name}</Text> {/* Certifique-se de que o texto esteja dentro de <Text> */}
                    </View>
                )}
            />
        </View>
    </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#333",
  },
  backButton: {
    alignSelf: 'flex-start',
    marginVertical: 10,
  },
  infoContainer: {
    alignItems: "center",
    width: '100%',
  },
  leagueLogo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#fff",
  },
  info: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 10,
  },
  teamCard: {
    backgroundColor: '#444',
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    width: '100%',
    maxWidth: 400,
    alignItems: "center",
  },
  teamText: {
    color: "#fff",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
});

export default LeaguesDetails;
