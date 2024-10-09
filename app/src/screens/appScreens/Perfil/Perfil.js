import React, { useState, useEffect } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons"; // Ícones
import { useUser } from "../../../components/UserContext";
import goatlogo from "../../../../../assets/goatlogo.png";
import { auth, db } from "../../../config/firebaseConfig";
import { onSnapshot, doc } from "firebase/firestore";

export default function Perfil({ navigation }) {
  const { userData, updateUserData } = useUser();
  const [profileImage, setProfileImage] = useState(userData.profileImage || "");
  const [nomeUser, setNomeUser] = useState('');
  const [emailUser, setEmailUser] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão necessária", "Precisamos de acesso à sua galeria.");
      }
    })();

    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = doc(db, "Users", user.uid);
        const unsubscribe = onSnapshot(userDoc, (doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            setNomeUser(userData.nome || '');
            setEmailUser(userData.email || '');
          } else {
            console.log("No such document!");
          }
        });
        return () => unsubscribe();
      }
    };

    fetchUserData();
  }, []);

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
      <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Settings')}>
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
            <Text style={[styles.profileText, styles.centeredText]}>{nomeUser}</Text>
          </View>
          <Text style={[styles.label, { marginTop: 20 }]}>Email</Text>
          <View style={styles.card}>
            <Text style={[styles.profileText, styles.centeredText]}>{emailUser}</Text>
          </View>
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
    paddingTop: 120,
  },
  profile: {
    alignItems: "center",
    marginBottom: 40,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
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
    backgroundColor: "#444",
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
    width: 250,
    alignItems: "center",
  },
  profileText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  centeredText: {
    textAlign: 'center', // Adiciona centralização ao texto
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
    alignItems: 'center',
  },

});
