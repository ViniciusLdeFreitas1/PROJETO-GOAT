import axios from "axios";

const api = axios.create({
  baseURL: "https://api-basketball.p.rapidapi.com",
  headers: {
    "x-rapidapi-key": "7fa880eb43msh5d32f8e9f689be4p1459efjsn6eb1f0a5d54f", // Substitua pela sua chave
    "x-rapidapi-host": "api-basketball.p.rapidapi.com",
  },
});

// Função para buscar jogadores
const fetchPlayers = async () => {
  try {
    const response = await api.get("/players", {
      params: {
        league: 12, 
        season: 2023-2024,
      },
    });
    console.log(response.data); // Verifique a resposta
  } catch (error) {
    console.error("Falha ao buscar os jogadores", error.message);
  }
};

fetchPlayers();
