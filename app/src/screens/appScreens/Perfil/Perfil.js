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
import { FontAwesome } from '@expo/vector-icons';
import { useUser } from '../../../components/UserContext';
import goatlogo from '../../../../../assets/goatlogo.png'; // Verifique se o caminho está correto

export default function Perfil({ navigation }) {
  const { userData, updateUserData } = useUser();
  const [profileImage, setProfileImage] = useState(userData.profileImage || '');

  // Solicita permissão para acessar a galeria
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Precisamos de acesso à sua galeria para você poder selecionar uma foto de perfil."
        );
      }
    })();
  }, []);

  // Função para escolher a imagem
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
        setProfileImage(selectedImageUri); // Atualiza a imagem de perfil localmente
        try {
          await updateUserData({ profileImage: selectedImageUri });
          Alert.alert('Sucesso', 'Imagem de perfil atualizada com sucesso.');
        } catch (error) {
          console.error('Erro ao atualizar imagem de perfil:', error);
          Alert.alert('Erro', 'Falha ao atualizar a imagem de perfil.');
        }
      }
    } catch (error) {
      console.error('Erro ao selecionar a imagem:', error);
      Alert.alert('Erro', 'Falha ao selecionar a imagem.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profile}>
        <TouchableOpacity onPress={pickImage}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Image source={goatlogo} style={styles.placeholder} /> // Usando goatlogo como fundo
          )}
        </TouchableOpacity>
        <Text style={styles.profileName}>{userData.username}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome name="bell" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Plantel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome name="cog" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.sections}>
        <Text style={styles.sectionTitle}>Seguindo</Text>
        <Text style={styles.sectionSubtitle}>Times</Text>
        <TouchableOpacity style={styles.team}>
          <Image
            style={styles.teamImage}
            source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-Ld9sSzDQr1jTUZbJovDrGPLzsrHBwR.svg' }}
          />
        </TouchableOpacity>
        <Text style={styles.sectionSubtitle}>Jogadores</Text>
        <TouchableOpacity style={styles.player}>
          <Image
            style={styles.playerImage}
            source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-Ld9sSzDQr1jTUZbJovDrGPLzsrHBwR.svg' }}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#54514F',
    padding: 20,
  },
  profile: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    resizeMode: 'cover',
  },
  placeholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#7D7875',
    borderRadius: 5,
    alignItems: 'center',
    margin: 5,
  },
  sections: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionSubtitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  team: {
    padding: 10,
    backgroundColor: '#7D7875',
    borderRadius: 5,
    marginBottom: 10,
  },
  teamImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  player: {
    padding: 10,
    backgroundColor: '#7D7875',
    borderRadius: 5,
  },
  playerImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: 'cover',
  },
});

