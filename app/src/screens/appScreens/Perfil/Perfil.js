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
import { FontAwesome } from '@expo/vector-icons';
import { useUser } from '../../../components/UserContext';
import goatlogo from '../../../../../assets/goatlogo.png';

export default function Perfil({ navigation }) {
  const { userData, updateUserData } = useUser();
  const [profileImage, setProfileImage] = useState(userData.profileImage || '');

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão necessária", "Precisamos de acesso à sua galeria.");
      }
    })();
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
        Alert.alert('Sucesso', 'Imagem de perfil atualizada com sucesso.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao selecionar a imagem.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profile}>
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <Image source={goatlogo} style={styles.placeholder} />
            )}
          </TouchableOpacity>
          <Text style={styles.profileName}>{userData.username}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Likes')}>
            <View style={styles.card}>
              <FontAwesome name="heart" size={24} color="red" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Notifications')}>
            <View style={styles.card}>
              <FontAwesome name="bell" size={24} color="yellow" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Settings')}>
            <View style={styles.card}>
              <FontAwesome name="cog" size={24} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#54514F',
    justifyContent: 'center',
  },
  scrollContainer: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 180,
  },
  profile: {
    alignItems: 'center',
    marginBottom: 40,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
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
  },
  profileName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  actionButton: {
    padding: 10,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  card: {
    backgroundColor: '#7D7875',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
});
