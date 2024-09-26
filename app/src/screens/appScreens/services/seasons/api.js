import axios from "axios";

const api = axios.create({
  baseURL: "https://api-nba-v1.p.rapidapi.com",
  headers: {
    "x-rapidapi-key": "7fa880eb43msh5d32f8e9f689be4p1459efjsn6eb1f0a5d54f", 
    "x-rapidapi-host": "api-basketball.p.rapidapi.com",
  },
});

export const fetchSeasons = async () => {
  try {
    const response = await api.get("/seasons");
    return response.data.response; 
  } catch (error) {
    console.error("Falha ao buscar as temporadas", error);
    throw error;
  }
};

export default api;