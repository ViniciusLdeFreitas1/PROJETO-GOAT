import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const NBA_Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigation = useNavigation(); 

  useEffect(() => {
    const fetchNBATeams = async () => {
      const options = {
        method: "GET",
        url: "https://api-basketball.p.rapidapi.com/teams",
        params: {
          league: "12", 
          season: "2023-2024", 
        },
        headers: {
          "x-rapidapi-key":
            "7fa880eb43msh5d32f8e9f689be4p1459efjsn6eb1f0a5d54f",
          "x-rapidapi-host": "api-basketball.p.rapidapi.com",
        },
      };

      try {
        const response = await axios.request(options);
        setTeams(response.data.response); // Salva todos os times
        setLoading(false);
      } catch (error) {
        setError("Erro ao buscar os times da NBA");
        setLoading(false);
      }
    };

    fetchNBATeams();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Times da NBA</Text>
      <FlatList
        data={teams}
        keyExtractor={(item) => item.id.toString()} // ID único de cada time
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("TeamDetails", { teamId: item.id })
            } // Navegação ao clicar
            style={styles.teamContainer}
          >
            <Image source={{ uri: item.logo }} style={styles.logo} />
            <Text style={styles.teamName}>{item.name}</Text>
            <Text style={styles.teamCountry}>{item.country.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#333"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff"
  },
  teamContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    marginBottom: 10
  },
  teamName: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: "bold",
    color: "#fff"
  },
  teamCountry: {
    fontSize: 16,
    marginLeft: 10,
    color: "#F56D09"
  },
  logo: {
    width: 50,
    height: 50,
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
});

export default NBA_Teams;
