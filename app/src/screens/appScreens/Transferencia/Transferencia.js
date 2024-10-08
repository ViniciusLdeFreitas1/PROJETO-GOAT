import axios from "axios";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator, FlatList, SafeAreaView, TextInput, Image } from "react-native";

const api = axios.create({
  baseURL: "https://api-basketball.p.rapidapi.com",
  headers: {
    "x-rapidapi-key": "7fa880eb43msh5d32f8e9f689be4p1459efjsn6eb1f0a5d54f",
    "x-rapidapi-host": "api-basketball.p.rapidapi.com",
  },
});

// Tradução de países para português
const countryTranslations = {
  "United States": "Estados Unidos",
  "Spain": "Espanha",
  "Italy": "Itália",
  "France": "França",
  "Germany": "Alemanha",
  "Brazil": "Brasil",
  "Finland": "Finlândia",
  "Greece": "Grécia",
  "Japan": "Japão",
  "Kazakhstan": "Cazaquistão",
  "China": "China",
  "Czech Republic": "República Checa",
  "Lebanon": "Líbano",
  "Albania": "Albânia",
  "Asia": "Ásia",
  "Bosnia": "Bósnia",
  "Kosovo": "Kosovo",
  "South Africa": "África do Sul",
  "Taiwan": "Taiwan",
  "United Kingdom": "Reino Unido",
  // Adicione mais traduções conforme necessário
};

// Filtrar ligas indesejadas
const excludedCountries = [
  "Albania",
  "Asia",
  "Bósnia",
  "China",
  "República Checa ",
  "Europe",
  "Finlândia",
  "Grécia",
  "Japão",
  "Cazaquistão",
  "Kosovo",
  "Líbano",
  "África do Sul",
  "Taiwan",
  "Reino Unido"
];

const translateCountry = (countryName) => {
  return countryTranslations[countryName] || countryName;
};

// Buscar ligas e filtrar as indesejadas e sem logo válida
const fetchLeagues = async () => {
  try {
    const response = await api.get("/leagues", {
      params: {
        season: '2023-2024', // Temporada
      },
    });
    console.log("Leagues Response:", response.data.response); // Para depuração
    // Filtra para incluir apenas ligas que possuem uma URL válida para a logo e que não estão na lista de exclusão
    const leaguesWithLogos = response.data.response.filter(league => 
      league.logo && !excludedCountries.includes(league.country?.name)
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
  },
  card: {
    backgroundColor: "#222", // Cor do card
    borderRadius: 8,
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
    width: 50,
    height: 50,
    marginBottom: 10,
    alignSelf: "center",
  },
  countryInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  countryFlag: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  cardText: {
    color: "#fff", // Cor do texto
  },
});
