import React, { useLayoutEffect, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native'
import api from '../../services/api'

import PostItem from '../../components/PostItem'

export default function CategoryPosts() {
    const navigation = useNavigation();
    const route = useRoute();

    const [posts, setPosts] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: route.params?.title === '' ? 'Categoria' : route.params?.title
        })
    }, [navigation])

    useEffect(() => {
        async function loadPosts() {
            // Acessando categories e buscando o ID, as postagens, nomes e imagens através da Route recebida de CategoryItem
            const response = await api.get(`api/categories/${route.params?.id}?fields=name&populate=posts,posts.cover`)
            setPosts(response.data?.data?.attributes?.posts?.data)
        }

        loadPosts();
    }, [])

    function handleBack() {
        navigation.goBack(); // retornar para a tela anterior da navegação
    }

    return (
        <View style={styles.container}>

            {posts.length === 0 && (
                <View style={styles.warningContainer}>
                    <Text style={styles.alert}>Essa categoria ainda não possui postagens!</Text>
                    <TouchableOpacity style={styles.button} onPress={handleBack}>
                        <Text style={styles.textButton}>Encontrar postagens</Text>
                    </TouchableOpacity>
                </View>
                // Renderização Condicional
            )}

            <FlatList
                showsHorizontalScrollIndicator={false}
                style={{ flex: 1 }}
                data={posts}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => <PostItem data={item} />}

            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 18,
        backgroundColor: '#FFF'
    },
    warningContainer: {
        alignItems: 'center',
    },
    alert: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#162133',
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginTop: 12,
        borderRadius: 5
    },
    textButton: {
        color: '#FFF',
    }
})