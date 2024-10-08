import axios from "axios";

const api = axios.create({
    baseURL: "https://api-basketball.p.rapidapi.com",
    headers: {
        "x-rapidapi-key": "7fa880eb43msh5d32f8e9f689be4p1459efjsn6eb1f0a5d54f",
        "x-rapidapi-host": "api-basketball.p.rapidapi.com",
    },
});

export const fetchTeams = async () => {
    const params = {
        id: "erf",
        league: "12", 
    };

    try {
        const response = await api.get("/teams", { params });
        return response.data.response; 
    } catch (error) {
        console.error("Falha ao buscar os times", error);
        throw error;
    }
};
