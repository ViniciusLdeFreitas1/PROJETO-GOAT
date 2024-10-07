import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const NBA_Teams = () => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

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
          "x-rapidapi-key": "7fa880eb43msh5d32f8e9f689be4p1459efjsn6eb1f0a5d54f",
          "x-rapidapi-host": "api-basketball.p.rapidapi.com",
        },
      };

      try {
        const response = await axios.request(options);
        const allTeams = response.data.response;

        // Filtrando para remover "West" e "East"
        const filteredTeams = allTeams.filter((team) =>
          team.name !== "West" && team.name !== "East"
        );

        setTeams(filteredTeams);
        setFilteredTeams(filteredTeams);
        setLoading(false);
      } catch (error) {
        setError("Erro ao buscar os times da NBA");
        setLoading(false);
      }
    };

    fetchNBATeams();
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = teams.filter((team) =>
      team.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredTeams(filtered);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navbar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar times..."
          value={search}
          onChangeText={handleSearch}
          placeholderTextColor="#fff"
        />
      </View>
      <View style={styles.orangeBar} />
      <FlatList
        data={filteredTeams}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("TeamDetails", { teamId: item.id })
            }
            style={styles.teamCard}
          >
            <Image source={{ uri: item.logo }} style={styles.logo} resizeMode="contain" />
            <Text style={styles.teamName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={<View style={styles.footerSpace} />} // Adiciona espaço na parte inferior
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333",
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7D7875",
    padding: 10,
    width: "100%",
  },
  searchInput: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#444",
    color: "#fff",
  },
  orangeBar: {
    height: 4,
    backgroundColor: "#F55900",
    width: "100%",
  },
  teamCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#444",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    elevation: 3, // Adiciona sombra ao cartão
    width: '100%',
  },
  listContent: {
    paddingBottom: 20, // Espaço inferior da lista
  },
  footerSpace: {
    height: 50, // Espaço adicional na parte inferior
  },
  teamName: {
    fontSize: 18,
    marginLeft: 15,
    fontWeight: "bold",
    color: "#fff",
    flex: 1, // Permite que o nome do time ocupe o espaço disponível
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 5, // Adiciona borda arredondada à imagem do logo
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
});

export default NBA_Teams;
