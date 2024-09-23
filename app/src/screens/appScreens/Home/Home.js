import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, FlatList, Text, View } from "react-native";
import axios from "axios";
import Navbar from "../../../components/Navbar";
import { fetchSeasons } from "../../../services/api";

const DEFAULT_AVATAR =
  "https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/71201981163c1c1753fc67cb4c3944db";

export default function Home({ navigation }) {
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState(DEFAULT_AVATAR);
  const [seasons, setSeasons] = useState([]);


  useEffect(() => {
    const fetchUsernameAndAvatar = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("username");
        const storedProfileImage = await AsyncStorage.getItem("profileImage");

        if (storedUsername) {
          setUsername(storedUsername);
        }

        if (storedProfileImage) {
          setProfileImage(storedProfileImage);
        } else {
          await AsyncStorage.setItem("profileImage", DEFAULT_AVATAR);
        }
      } catch (error) {
        console.error(
          "Falha ao recuperar o nome do usuário ou a imagem do perfil",
          error
        );
      }
    };
    const getSeasons = async () => {
      try {
        const data = await fetchSeasons();
        setSeasons(data);
      }
      catch(error){
        console.error("Erro ao carregar as temporadas", error)
      }
    }

    fetchUsernameAndAvatar();
    getSeasons();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Navbar
        username={username}
        profileImage={profileImage}
        setProfileImage={setProfileImage}
        navigation={navigation}
      />
      <FlatList
        data={seasons}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.text} onPress={() => navigation.navigate('Temporadas')}>Temporada: {item}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#54514F",
  },
  item: {
    padding: 10,
    marginVertical: 8,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 18,
    color: "#333",
  },
});
