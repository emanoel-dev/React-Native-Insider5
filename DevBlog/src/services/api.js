import axios from "axios";

const api = axios.create({
    baseURL: 'http://192.168.1.108:1337/'
})

export default api;

// Pages para possível troca de IP caso necessário: CategoryItem e FavoritePost