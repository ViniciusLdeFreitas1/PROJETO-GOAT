import React, { useState, useEffect } from "react";
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { launchImageLibrary } from "react-native-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../components/UserContext";
import goatlogo from "../../../assets/goatlogo.png";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

const BUTTON_COLOR = "#F56D09";

const Navbar = ({ searchTerm, setSearchTerm, teams, setFilteredTeams }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { userData, updateUserData } = useUser();

  // Filtra os times com base no searchTerm
  useEffect(() => {
    const filtered = searchTerm.trim()
      ? teams.filter((team) =>
          team?.team?.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : teams;

    setFilteredTeams(filtered);
  }, [searchTerm, teams, setFilteredTeams]);

  const openImagePicker = () => {
    launchImageLibrary({ mediaType: "photo" }, async (response) => {
      if (response.didCancel) {
        Alert.alert("Erro", "Seleção de imagem cancelada.");
        return;
      }
      if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        await updateProfileImage(uri);
      } else {
        Alert.alert("Erro", "Nenhuma imagem selecionada.");
      }
    });
  };

  const updateProfileImage = async (uri) => {
    setLoading(true);
    try {
      await updateUserData({ profileImage: uri });
      setModalVisible(false);
      Alert.alert("Sucesso", "Imagem de perfil atualizada com sucesso.");
    } catch (error) {
      console.error("Erro ao atualizar imagem de perfil:", error);
      Alert.alert("Erro", "Falha ao atualizar a imagem de perfil.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePress = () => {
    navigation.navigate("Perfil");
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      await updateUserData({ username: "", email: "", profileImage: "" });
      Alert.alert("Logout", "Você foi desconectado com sucesso.");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Erro ao sair:", error);
      Alert.alert("Erro", "Ocorreu um erro ao tentar fazer logout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={handleProfilePress} disabled={loading}>
          <Image
            source={
              userData && userData.profileImage
                ? { uri: userData.profileImage }
                : goatlogo
            }
            style={styles.profileImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar times..."
          onChangeText={(text) => {
            if (text !== undefined && text !== null) {
              setSearchTerm(text);
            }
          }}
        />
        <TouchableOpacity
          onPress={() => setLogoutModalVisible(true)}
          style={styles.logoutButton}
          disabled={loading}
        >
          <AntDesign name="logout" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.orangeBar} />

      {/* Modal de confirmação de logout */}
      <Modal
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirmação de Logout</Text>
            <Text style={styles.modalMessage}>
              Você realmente deseja sair do aplicativo?
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={handleLogout}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Sair</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity
              style={styles.button}
              onPress={() => setLogoutModalVisible(false)}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={BUTTON_COLOR} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    padding: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginHorizontal: 10,
    color: "white",
    backgroundColor: "#333",
    borderRadius: 5,
  },
  orangeBar: {
    height: 4,
    backgroundColor: "#F55900",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "#5B5959",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 10,
    color: "white",
  },
  separator: {
    height: 10,
  },
  button: {
    backgroundColor: BUTTON_COLOR,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButton: {
    marginLeft: 10,
  },
});

export default Navbar;
