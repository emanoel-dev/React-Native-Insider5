import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";


// Buscar uma categoria
export async function getFavorite() {
    const data = await AsyncStorage.getItem('@favCategory');

    if (data !== null) { // Se data for diferente de null
        const response = await api.get(`api/categories/${data}?fileds=name&populate=posts,posts.cover`);

        return response.data?.data?.attributes?.posts?.data
    } else { // senão, retorna array vazio
        return [];
    }
}

// Favoritar uma categoria
export async function setFavorite(category) {
    await AsyncStorage.setItem('@favCategory', String(category)); // salvando a categoria favorita
    
    const response = await getFavorite(); // buscando através da função e retornando para o usuário
    return response;
}