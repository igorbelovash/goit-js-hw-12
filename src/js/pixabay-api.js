import axios from 'axios';

const API_KEY = "55663277-19ff75ff764545e0f4b912e24";

export default async function getImagesByQuery(query, page) {
    const { data } = await axios.get("https://pixabay.com/api/", {
        params: {
            key: API_KEY,
            q: `${query}`,
            image_type: "photo",
            orientation: "horizontal",
            safesearch: true,
            page: `${page}`,
            per_page: 15
        }
    });
    return data;
}