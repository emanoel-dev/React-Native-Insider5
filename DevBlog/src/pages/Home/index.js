import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    FlatList,
    StyleSheet, 
    SafeAreaView, 
    TouchableOpacity  
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import api from '../../services/api';
import { getFavorite, setFavorite } from '../../services/favorite';

import CategoryItem from '../../components/CategoryItem';
import FavoritePost from '../../components/FavoritePost';
import PostItem from '../../components/PostItem';

import * as Animatable from 'react-native-animatable';

const FlatListAnimated = Animatable.createAnimatableComponent(FlatList);

export default function Home() {
    const navigation = useNavigation();

    // Acessando API e consumindo os dados de Categories
    // Utilizando UseState para trazer os dados da API e jogando na FlatList das Categorias
    const [categories, setCategories] = useState([])
    const [favCategory, setFavCategory] = useState([])

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        // Acessando Categories e armazenando dentro de UseState
        async function loadData() {

            await getListPosts(); // Chamando funcionaldiade para listar os Posts

            const category = await api.get("/api/categories?populate=icon")
            setCategories(category.data.data)
        }
        loadData();

    }, [])

    useEffect(() => {
        async function favorite() {
            const response = await getFavorite(); // espera a requisição de getFavorite
            setFavCategory(response); // se tiver cateogria favorita passa para dentro de response, senão passa array vazio do useState;
        }
        favorite();
    }, [])

    // Acessando os Posts e armazenando dentro do useState
    async function getListPosts() {

        setLoading(true);

        const response = await api.get("api/posts?populate=cover&sort=createdAt:desc")
        setPosts(response.data.data)

        setLoading(false);
    }

    // Favoritando Categoria
    async function handleFavorite(id) {
        const response = await setFavorite(id);
        setFavCategory(response)
        alert("Categoria favoritada")
    }


    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.header}>
                <Animatable.Text animation="fadeInLeft" style={styles.name}>DevBlog</Animatable.Text>

                <TouchableOpacity onPress={() => navigation.navigate("Search")}>
                    <Feather name="search" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            <FlatListAnimated
                animation="flipInX"
                delay={500}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                contentContainerStyle={{ paddingRight: 12 }}
                style={styles.categories}
                data={categories}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (<CategoryItem
                    data={item}
                    favorite={() => handleFavorite(item.id)}
                />)}
            />

            <View style={styles.main}>

                {favCategory.length !== 0 && ( // requisição: se minhas categorias favoritadas for tamanho diferente que 0, exibe a FlatList
                    <FlatList
                        style={{ marginTop: 50, maxHeight: 100, paddingStart: 18 }}
                        contentContainerStyle={{ paddingEnd: 25 }}
                        data={favCategory}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => <FavoritePost data={item} />}
                    />
                )}

                <Text style={[styles.title, { marginTop: favCategory.length > 0 ? 14 : 45 } // Renderização Condicional
                ]}>Conteúdos em Alta</Text>

                <FlatList
                    style={{ flex: 1, paddingHorizontal: 18 }}
                    showsHorizontalScrollIndicator={false}
                    data={posts}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => <PostItem data={item} />}
                    refreshing={loading}
                    onRefresh={ () => getListPosts()}
                />

            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#232630'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 18,
        marginTop: 18,
        marginBottom: 24
    },
    name: {
        fontSize: 28,
        color: '#FFF',
        fontWeight: 'bold'
    },
    categories: {
        maxHeight: 115,
        backgroundColor: '#EFEFEF',
        marginHorizontal: 8,
        borderRadius: 8,
        zIndex: 9
    },
    main: {
        backgroundColor: '#FFF',
        flex: 1,
        marginTop: -30
    },
    title: {
        fontSize: 21,
        paddingHorizontal: 18,
        marginBottom: 14,
        fontWeight: 'bold',
        color: '#162133'
    }
})