import axios from "axios";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator, FlatList, SafeAreaView, TextInput, Image, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native'; // Importar o hook de navegação

const api = axios.create({
  baseURL: "https://api-basketball.p.rapidapi.com",
  headers: {
    "x-rapidapi-key": "7fa880eb43msh5d32f8e9f689be4p1459efjsn6eb1f0a5d54f",
    "x-rapidapi-host": "api-basketball.p.rapidapi.com",
  },
});

// Tradução de países para português
const countryTranslations = {
"Albania": "Albânia",
    "Germany": "Alemanha",
    "Angola": "Angola",
    "Saudi Arabia": "Arábia Saudita",
    "Argentina": "Argentina",
    "Armenia": "Armênia",
    "Asia": "Ásia",
    "Austria": "Áustria",
    "Azerbaijan": "Azerbaijão",
    "Belgium": "Bélgica",
    "Belarus": "Bielorrússia",
    "Bosnia": "Bósnia",
    "Brazil": "Brasil",
    "Bulgaria": "Bulgária",
    "Canada": "Canadá",
    "Chile": "Chile",
    "China": "China",
    "South Korea": "Coreia do Sul",
    "Croatia": "Croácia",
    "Cuba": "Cuba",
    "Denmark": "Dinamarca",
    "Egypt": "Egito",
    "United Arab Emirates": "Emirados Árabes Unidos",
    "Slovakia": "Eslováquia",
    "Slovenia": "Eslovênia",
    "Spain": "Espanha",
    "United States": "Estados Unidos",
    "Estonia": "Estônia",
    "Philippines": "Filipinas",
    "Finland": "Finlândia",
    "France": "França",
    "Georgia": "Geórgia",
    "Greece": "Grécia",
    "Netherlands": "Holanda",
    "Hungary": "Hungria",
    "India": "Índia",
    "Indonesia": "Indonésia",
    "England": "Inglaterra",
    "Ireland": "Irlanda",
    "Iceland": "Islândia",
    "Israel": "Israel",
    "Italy": "Itália",
    "Japan": "Japão",
    "Kazakhstan": "Cazaquistão",
    "Kosovo": "Kosovo",
    "Latvia": "Letônia",
    "Lebanon": "Líbano",
    "Lithuania": "Lituânia",
    "Luxembourg": "Luxemburgo",
    "North Macedonia": "Macedônia",
    "Mexico": "México",
    "Moldova": "Moldávia",
    "Montenegro": "Montenegro",
    "Nigeria": "Nigéria",
    "Norway": "Noruega",
    "New Zealand": "Nova Zelândia",
    "Paraguay": "Paraguai",
    "Peru": "Peru",
    "Poland": "Polônia",
    "Portugal": "Portugal",
    "Qatar": "Qatar",
    "Czech Republic": "República Checa",
    "Romania": "Romênia",
    "Russia": "Rússia",
    "Serbia": "Sérvia",
    "Sweden": "Suécia",
    "Switzerland": "Suíça",
    "Turkey": "Turquia",
    "Ukraine": "Ucrânia",
    "Uruguay": "Uruguai",
    "Venezuela": "Venezuela",
    "Vietnam": "Vietnã",
};

// Excluir ligas específicas pelo nome
const excludedLeagues = [
  "Prvenstvo BiH Women",
  "Czech Cup Women",
  "Suomen Cup",
  "Suomen Cup Women",
  "Greek Cup Women",
  "B2.League",
  "Higher League",
  "National League Women",
  "Division 1",
  "South American League",
  "Betty Codona Trophy Women",
  "P.League+",
  "T1 League",
  "Superliga Women",
  "Liga Unike Women",
  "WCBA Women",
  "Superliga",
  "WASL",
];

const fetchLeagues = async () => {
  try {
    const response = await api.get("/leagues", {
      params: {
        season: '2023-2024', // Temporada
      },
    });
    console.log("Leagues Response:", response.data.response); // Para depuração

    const leaguesWithLogos = response.data.response.filter(league => 
      league.logo &&
      !excludedLeagues.includes(league.name)
    );
    return leaguesWithLogos; // Retorna apenas ligas com logos válidas
  } catch (error) {
    console.error("Falha ao buscar as ligas", error);
    throw error;
  }
};

export default function Leagues() {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigation = useNavigation(); // Usar o hook de navegação

  useEffect(() => {
    const getLeagues = async () => {
      try {
        const leaguesData = await fetchLeagues();
        setLeagues(leaguesData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    getLeagues();
  }, []);

  const filteredLeagues = leagues.filter(league => {
    const leagueName = league.name ? league.name.toLowerCase() : '';
    const countryName = translateCountry(league.country?.name || '').toLowerCase();
    return leagueName.includes(searchTerm.toLowerCase()) || countryName.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ color: 'white' }}>Carregando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro: {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navbar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar ligas ou país..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor="#fff"
        />
      </View>
      <View style={styles.orangeBar} />
      {filteredLeagues.length === 0 ? (
        <Text style={{ color: "white", textAlign: "center", marginTop: 20 }}>Nenhum resultado encontrado</Text>
      ) : (
        <FlatList
          data={filteredLeagues}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('LeaguesDetails', { league: item })}>
              <View style={styles.card}>
                <Image
                  source={{ uri: item.logo || item.country.flag }} // Exibe a logo ou a bandeira do país
                  style={styles.leagueLogo}
                  resizeMode="contain"
                />
                <Text style={styles.cardText}>Nome da Liga: {item.name || 'Desconhecido'}</Text>
                <View style={styles.countryInfo}>
                  <Text style={styles.cardText}>País: {translateCountry(item.country?.name) || 'Desconhecido'}</Text>
                  {item.country?.flag && (
                    <Image
                      source={{ uri: item.country.flag }}
                      style={styles.countryFlag}
                      resizeMode="contain"
                    />
                  )}
                </View>
                <Text style={styles.cardText}>Tipo: {item.type || 'N/A'}</Text>
                <Text style={styles.cardText}>Temporada: {item.seasons[0]?.season || 'N/A'}</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#333", // Cor do fundo
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7D7875',
    padding: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginHorizontal: 10,
    color: 'white',
    backgroundColor: '#A69F9C',
    borderRadius: 5,
    height: 50,
  },
  orangeBar: {
    height: 4,
    backgroundColor: '#F55900',
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#444",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  leagueLogo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 10,
    backgroundColor: "transparent", // Fundo transparente para a logo
  },
  countryInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  countryFlag: {
    width: 20,
    height: 20,
    marginLeft: 5,
  },
  cardText: {
    color: "white",
    marginBottom: 5,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

// Função para traduzir nomes de países
const translateCountry = (country) => {
  return countryTranslations[country] || country;
};
