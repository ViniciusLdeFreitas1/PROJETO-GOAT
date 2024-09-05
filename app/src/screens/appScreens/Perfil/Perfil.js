import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import { auth } from "../../../config/firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Perfil({ navigation }) {
  const [image, setImage] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const storedUsername = await AsyncStorage.getItem("username");
      const storedEmail = await AsyncStorage.getItem("email");
      const storedImage = await AsyncStorage.getItem("profileImage");

      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        setUsername("User123");
      }

      if (storedEmail) {
        setEmail(storedEmail);
      } else {
        setEmail("nome@email.com"); 
      }

      if (storedImage) {
        setImage(storedImage);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Precisamos de acesso à sua galeria para você poder selecionar uma foto de perfil."
        );
      }
    })();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        Alert.alert("Logout", "Você foi desconectado com sucesso.");
        navigation.navigate("Login");
      })
      .catch((error) => {
        Alert.alert("Erro", "Ocorreu um erro ao tentar fazer logout.");
      });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      setImage(selectedImageUri);
      await AsyncStorage.setItem("profileImage", selectedImageUri); 
    }
  };

  const saveUsername = async (newUsername) => {
    try {
      await AsyncStorage.setItem("username", newUsername);
      setUsername(newUsername);
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao salvar o username.");
    }
  };

  const saveEmail = async (newEmail) => {
    try {
      await AsyncStorage.setItem("email", newEmail);
      setEmail(newEmail);
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao salvar o email.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuText}>≡</Text>
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar"
            placeholderTextColor="#888" 
          />
          <TouchableOpacity style={styles.searchIcon}>
            <Text style={styles.searchIconText}>🔍</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileText}>👤</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.profile}>
        <TouchableOpacity onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>Foto</Text>
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.profileName}>{username}</Text>
        <Text style={styles.profileEmail}>{email}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
      <br></br>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>🔔</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Plantel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>⚙️</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.sections}>
        <Text style={styles.sectionTitle}>Seguindo</Text>
        <Text style={styles.sectionSubtitle}>Times</Text>
        <TouchableOpacity style={styles.team}>
          <Image
            style={styles.teamImage}
            source={{ uri: "https://example.com/path-to-team-image.jpg" }} 
          />
        </TouchableOpacity>
        <Text style={styles.sectionSubtitle}>Jogadores</Text>
        <TouchableOpacity style={styles.player}>
          <Image
            style={styles.playerImage}
            source={{ uri: "https://example.com/path-to-player-image.jpg" }} 
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#5B5959",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", 
    marginBottom: 20,
  },
  menuButton: {
    width: 64, 
    height: 64, 
    padding: 10,
    backgroundColor: "#333",
    borderRadius: 2,
    justifyContent: "center", 
  },
  menuText: {
    color: "#fff",
    fontSize: 20,
    textAlign: 'center'
  },
  searchContainer: {
    flex: 1, 
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    padding: 10,
  },
  searchIcon: {
    padding: 10,
    backgroundColor: "#444",
    borderRadius: 5
  },
  searchIconText: {
    color: "#fff",
    fontSize: 20,

  },
  profileButton: {
    width: 64, 
    height: 64, 
    padding: 10,
    backgroundColor: "#333",
    borderRadius: 5,
    justifyContent: "center", 
  },
  profileText: {
    color: "#fff",
    fontSize: 20,
  },
  profile: {
    alignItems: "center",
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
    backgroundColor: "#C1644F",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "white",
    fontFamily: "Poppins-Bold",
  },
  profileName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  profileEmail: {
    color: "#fff",
    fontSize: 16,
    marginTop: 5,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "#333",
    borderRadius: 5,
    alignItems: "center",
    margin: 5,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  button: {
    backgroundColor: "#C1644F",
    padding: 10,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
    marginTop: 20,
    marginLeft: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  player: {
    padding: 10,
    backgroundColor: "#333",
    borderRadius: 5,
  },
  playerImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: "cover",
  },
  team: {
    padding: 10,
    backgroundColor: "#333",
    borderRadius: 5,
    marginBottom: 10,
  },
  teamImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
  },
  sections: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sectionSubtitle: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 10,
  },
});
