import axios from "axios";

const api = axios.create({
    baseURL: "https://api-basketball.p.rapidapi.com",
    headers: {
        "x-rapidapi-key": "7fa880eb43msh5d32f8e9f689be4p1459efjsn6eb1f0a5d54f",
        "x-rapidapi-host": "api-basketball.p.rapidapi.com",
    },
});

export const fetchGames = async () => {
    const params = {
        league: "12", 
        date: "2024-01-01", 
        team: "134", 
        timezone: "europe/london",
        season: "2024-2025",
    };

    try {
        const response = await api.get("/games", { params });
        return response.data.response; 
    } catch (error) {
        console.error("Falha ao buscar os jogos", error);
        throw error;
    }
};
