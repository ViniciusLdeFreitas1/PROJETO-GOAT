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
// Tradução de países para português
const countryTranslations = {
  "Afghanistan": "Afeganistão",
  "Albania": "Albânia",
  "Algeria": "Argélia",
  "Andorra": "Andorra",
  "Angola": "Angola",
  "Argentina": "Argentina",
  "Armenia": "Armênia",
  "Australia": "Austrália",
  "Austria": "Áustria",
  "Azerbaijan": "Azerbaijão",
  "Bahamas": "Bahamas",
  "Bahrain": "Bahrein",
  "Bangladesh": "Bangladesh",
  "Belarus": "Bielorrússia",
  "Belgium": "Bélgica",
  "Benin": "Benin",
  "Bolivia": "Bolívia",
  "Bosnia-and-Herzegovina": "Bósnia e Herzegovina",
  "Botswana": "Botswana",
  "Brazil": "Brasil",
  "Bulgaria": "Bulgária",
  "Burkina Faso": "Burkina Faso",
  "Burundi": "Burundi",
  "Cambodia": "Camboja",
  "Cameroon": "Camarões",
  "Canada": "Canadá",
  "Cape Verde": "Cabo Verde",
  "Central African Republic": "República Centro-Africana",
  "Chad": "Chade",
  "Chile": "Chile",
  "China": "China",
  "Colombia": "Colômbia",
  "Congo": "Congo",
  "Costa Rica": "Costa Rica",
  "Croatia": "Croácia",
  "Cuba": "Cuba",
  "Cyprus": "Chipre",
  "Czech Republic": "República Checa",
  "Denmark": "Dinamarca",
  "Dominican Republic": "República Dominicana",
  "DR Congo": "República Democrática do Congo",
  "Ecuador": "Equador",
  "Egypt": "Egito",
  "El Salvador": "El Salvador",
  "Estonia": "Estônia",
  "Ethiopia": "Etiópia",
  "Finland": "Finlândia",
  "France": "França",
  "Gabon": "Gabão",
  "Gambia": "Gâmbia",
  "Georgia": "Geórgia",
  "Germany": "Alemanha",
  "Ghana": "Gana",
  "Greece": "Grécia",
  "Guatemala": "Guatemala",
  "Guinea": "Guiné",
  "Honduras": "Honduras",
  "Hong Kong": "Hong Kong",
  "Hungary": "Hungria",
  "Iceland": "Islândia",
  "India": "Índia",
  "Indonesia": "Indonésia",
  "Iran": "Irã",
  "Iraq": "Iraque",
  "Ireland": "Irlanda",
  "Israel": "Israel",
  "Italy": "Itália",
  "Ivory Coast": "Costa do Marfim",
  "Jamaica": "Jamaica",
  "Japan": "Japão",
  "Jordan": "Jordânia",
  "Kazakhstan": "Cazaquistão",
  "Kenya": "Quênia",
  "Kuwait": "Kuwait",
  "Kyrgyzstan": "Quirguistão",
  "Laos": "Laos",
  "Latvia": "Letônia",
  "Lebanon": "Líbano",
  "Lithuania": "Lituânia",
  "Luxembourg": "Luxemburgo",
  "Macedonia": "Macedônia",
  "Madagascar": "Madagascar",
  "Malaysia": "Malásia",
  "Mali": "Mali",
  "Malta": "Malta",
  "Mauritania": "Mauritânia",
  "Mexico": "México",
  "Moldova": "Moldávia",
  "Mongolia": "Mongólia",
  "Montenegro": "Montenegro",
  "Morocco": "Marrocos",
  "Mozambique": "Moçambique",
  "Namibia": "Namíbia",
  "Nepal": "Nepal",
  "Netherlands": "Países Baixos",
  "New Zealand": "Nova Zelândia",
  "Nicaragua": "Nicarágua",
  "Nigeria": "Nigéria",
  "Norway": "Noruega",
  "Oman": "Omã",
  "Pakistan": "Paquistão",
  "Palestine": "Palestina",
  "Panama": "Panamá",
  "Paraguay": "Paraguai",
  "Peru": "Peru",
  "Philippines": "Filipinas",
  "Poland": "Polônia",
  "Portugal": "Portugal",
  "Qatar": "Catar",
  "Romania": "Romênia",
  "Russia": "Rússia",
  "Rwanda": "Ruanda",
  "Saudi Arabia": "Arábia Saudita",
  "Senegal": "Senegal",
  "Serbia": "Sérvia",
  "Singapore": "Singapura",
  "Slovakia": "Eslováquia",
  "Slovenia": "Eslovênia",
  "South Africa": "África do Sul",
  "South Korea": "Coreia do Sul",
  "Spain": "Espanha",
  "Sri Lanka": "Sri Lanka",
  "Sudan": "Sudão",
  "Sweden": "Suécia",
  "Switzerland": "Suíça",
  "Syria": "Síria",
  "Taiwan": "Taiwan",
  "Tajikistan": "Tajiquistão",
  "Tanzania": "Tanzânia",
  "Thailand": "Tailândia",
  "Togo": "Togo",
  "Trinidad and Tobago": "Trinidad e Tobago",
  "Tunisia": "Tunísia",
  "Turkey": "Turquia",
  "Uganda": "Uganda",
  "Ukraine": "Ucrânia",
  "United Arab Emirates": "Emirados Árabes Unidos",
  "United Kingdom": "Reino Unido",
  "USA": "Estados Unidos",
  "Uruguay": "Uruguai",
  "Uzbekistan": "Uzbequistão",
  "Venezuela": "Venezuela",
  "Vietnam": "Vietnã",
  "World":  "Mundo",
  "Zambia": "Zâmbia",
  "Zimbabwe": "Zimbábue"
};

const excludedCountries = [
  "Taiwan", 
];


// Excluir ligas específicas pelo nome
const excludedLeagues = [
  "AfroCan",
  "Prvenstvo BiH Women",
  "Czech Cup Women",
  "Suomen Cup",
  "Suomen Cup Women",
  "Greek Cup Women",
  "B2.League",
  "Higher League",
  "National League Women",
  "Division 1",
  "EASL",
  "EABA Championship",
  "South American League",
  "Betty Codona Trophy Women",
  "NBL1 Central Women",
  "NBL1 East Women",
  "Libobasquet",
  "Super League",
  "Copa Chile",
  "Supercopa",
  "LNB",
  "NBA In-Season Tournament",
  "Czech-Slovak Cup",
  "European Challengers U16 Women",
  "European Challengers U20",
  "Federal Cup",
  "Games of the Small States of Europe Women",
  "LFB Super Cup Women",
  "Georgian Cup",
  "Latvian Cup",
  "Super Cup Women",
  "Taca de Portugal Women",
  "Super Cup",
  "Russian Cup W",
  "NBL",
  "South American Championship",
  "South American Championship U17",
  "South American Championship U17 Women",
  "South American Championship Women",
  "South American Championship U18",
  "Northern Cup",
  "P.League+",
  "T1 League",
  "Superliga Women",
  "Liga Unike Women",
  "WCBA Women",
  "Americas Championship U18 Women",
  "Stankovic Continental Cup",
  "Universiade",
  "WBLA Women",
  "Superliga",
  "WASL",
  "California Classic",
  "BAL",
  "African Championship",
];

const fetchLeagues = async () => {
  try {
    const response = await api.get("/leagues", {
      params: {},
    });
    console.log("Leagues Response:", response.data.response); // Para depuração

    const leaguesWithLogos = response.data.response.filter(league => 
      league.logo &&
      !excludedLeagues.includes(league.name) &&
      !excludedCountries.includes(league.country?.name) // Excluir baseando-se no país
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

  const filteredLeagues = leagues
  .filter(league => {
    const leagueName = league.name ? league.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "") : '';
    const countryName = translateCountry(league.country?.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    const normalizedSearchTerm = searchTerm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    return leagueName.includes(normalizedSearchTerm) || countryName.includes(normalizedSearchTerm);
  })
  .sort((a, b) => {
    const countryA = translateCountry(a.country?.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    const countryB = translateCountry(b.country?.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    return countryA.localeCompare(countryB);
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
            </View>
          )}
          contentContainerStyle={styles.flatListContent}
        />
      )}
      <View style={{ height: 50 }} /> 
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#333",
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginHorizontal: 10,
    color: 'white',
    backgroundColor: '#333',
    borderRadius: 5,
    height: 50,
  },
  orangeBar: {
    height: 4,
    backgroundColor: '#F55900',
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#222",
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
    backgroundColor: "transparent", 
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

const translateCountry = (country) => {
  return countryTranslations[country] || country;
};
