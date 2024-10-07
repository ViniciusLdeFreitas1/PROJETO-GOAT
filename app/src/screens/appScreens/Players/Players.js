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
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";

const NBA_Teams = () => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);

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
        const allTeams = response.data.response;

        const filteredTeams = allTeams.filter(
          (team) => team.name !== "West" && team.name !== "East"
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
  const toggleFavorite = async (teamId) => {
    let updatedFavorites = [];
    if (favorites.includes(teamId)) {
      updatedFavorites = favorites.filter((id) => id !== teamId);
    } else {
      updatedFavorites = [...favorites, teamId];
    }
    setFavorites(updatedFavorites);
    await AsyncStorage.setItem(
      "favoriteTeams",
      JSON.stringify(updatedFavorites)
    );
     console.log("Favorites salvos:", updatedFavorites);
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
          <View style={styles.teamCard}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("TeamDetails", { teamId: item.id })
              }
              style={styles.teamInfo}
            >
              <Image
                source={{ uri: item.logo }}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.teamName}>{item.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
              <Icon
                name={favorites.includes(item.id) ? "heart" : "heart-o"}
                size={24}
                color={favorites.includes(item.id) ? "red" : "gray"}
                style={styles.favoriteIcon}
              />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={<View style={styles.footerSpace} />}
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
    justifyContent: "space-between",
    padding: 15,
    marginVertical: 10,
    elevation: 3, 
    width: "100%",
  },
  listContent: {
    paddingBottom: 20, 
  },
  footerSpace: {
    height: 50,
  },
  teamName: {
    fontSize: 18,
    marginLeft: 15,
    fontWeight: "bold",
    color: "#fff",
    flex: 1, 
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 5, 
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
  favoriteIcon: {
    justifyContent: "flex-end"  
  }
});

export default NBA_Teams;
