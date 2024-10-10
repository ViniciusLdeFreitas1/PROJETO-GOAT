import React, { useState, useEffect } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator, // Adicionei o indicador de carregamento
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons"; // Ícones
import { useUser } from "../../../components/UserContext";
import goatlogo from "../../../../../assets/goatlogo.png";
import { auth, db } from "../../../config/firebaseConfig";
import { onSnapshot, doc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function Perfil({ navigation }) {
  const { userData, updateUserData } = useUser();
  const [profileImage, setProfileImage] = useState(userData.profileImage || "");
  const [nomeUser, setNomeUser] = useState("");
  const [emailUser, setEmailUser] = useState("");
  const [favoriteTeams, setFavoriteTeams] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false); // Para controlar o estado de carregamento

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Precisamos de acesso à sua galeria."
        );
      }
    })();

    fetchUserData();
    loadFavorites(); // Carregar favoritos ao iniciar
  }, []);

  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDoc = doc(db, "Users", user.uid);
      const unsubscribe = onSnapshot(userDoc, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setNomeUser(userData.nome || "");
          setEmailUser(userData.email || "");
        } else {
          console.log("No such document!");
        }
      });
      return () => unsubscribe();
    }
  };

  const loadFavorites = async () => {
    try {
      setLoadingFavorites(true); // Começar a mostrar o carregamento
      const storedFavorites = await AsyncStorage.getItem("favoriteTeams");
      if (storedFavorites) {
        const favoriteIds = JSON.parse(storedFavorites);
        console.log("Favorite IDs recuperados:", favoriteIds); // Verifique os favoritos recuperados

        // Buscando dados da API
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

        const response = await axios.request(options);
        const allTeams = response.data.response;

        const favoriteTeamsList = allTeams.filter((team) =>
          favoriteIds.includes(team.id)
        );
        setFavoriteTeams(favoriteTeamsList);
      }
    } catch (error) {
      console.error("Erro ao buscar times:", error);
    } finally {
      setLoadingFavorites(false); // Parar de mostrar o carregamento
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const selectedImageUri = result.assets[0].uri;
        setProfileImage(selectedImageUri);
        await updateUserData({ profileImage: selectedImageUri });
        Alert.alert("Sucesso", "Imagem de perfil atualizada com sucesso.");
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao selecionar a imagem.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => navigation.navigate("Settings")}
      >
        <FontAwesome name="cog" size={24} color="#fff" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profile}>
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <Image source={goatlogo} style={styles.placeholder} />
            )}
          </TouchableOpacity>
          <Text style={styles.label}>Username</Text>
          <View style={styles.card}>
            <Text style={[styles.profileText, styles.centeredText]}>
              {nomeUser}
            </Text>
          </View>
          <Text style={[styles.label, { marginTop: 20 }]}>Email</Text>
          <View style={styles.card}>
            <Text style={[styles.profileText, styles.centeredText]}>
              {emailUser}
            </Text>
          </View>
        </View>
        <View style={styles.FavoriteContainer}>
          <Text style={styles.header}>Times favoritos</Text>

          {loadingFavorites ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : favoriteTeams.length > 0 ? (
            <FlatList
              data={favoriteTeams}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.teamCard}>
                  <Image
                    source={{ uri: item.logo }} 
                    style={styles.logo}
                    resizeMode="contain"
                  />
                  <Text style={styles.teamName}>{item.name}</Text>
                </View>
              )}
            />
          ) : (
            <Text style={styles.noFavorites}>Não há times favoritos.</Text>
          )}

          {/* Botão para recarregar os favoritos */}
          <TouchableOpacity style={styles.reloadButton} onPress={loadFavorites}>
            <Text style={styles.reloadButtonText}>Recarregar Favoritos</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333",
  },
  scrollContainer: {
    alignItems: "center",
    padding: 20,
    paddingTop: 60  ,
  },
  profile: {
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    resizeMode: "cover",
  },
  placeholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  card: {
    backgroundColor: "#222",
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
    width: 275,
    alignItems: "center",
  },
  profileText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  centeredText: {
    textAlign: "center",
  },
  settingsButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    alignSelf: "flex-start",
    marginLeft: 80,
    marginBottom: 5,
    alignItems: "center",
  },
  teamCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  teamName: {
    fontSize: 18,
    color: "#fff",
  },
  noFavorites: {
    fontSize: 16,
    color: "#888",
    textAlign: "center"
  },
  FavoriteContainer: {
    backgroundColor: "#444",
    borderRadius: 5,
    width: 275,
    height: 175,
    marginBottom: 20,
    padding: 10,
    alignItems: "center"
  },
  reloadButton: {
    backgroundColor: "#F56D09",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  reloadButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  header: {
    fontSize: 22,
    color: "#fff"
  }
});
