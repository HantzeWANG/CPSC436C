//const API_URL = "http://127.0.0.1:8000/api"; 
// get from .env file
const API_URL = process.env.REACT_APP_API_URL;


export const fetchPeopleData = async () => {
    try {
        const response = await fetch(`${API_URL}/People/`);
        if (!response.ok) {
            throw new Error("Failed to fetch people data");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching people data:", error);
        throw error;
    }
};
