import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Keyboard } from 'react-native';

import api from '../../services/api'
import PostItem from '../../components/PostItem'

import { Feather } from '@expo/vector-icons';

export default function Search() {

    const[input, setInput] = useState('');
    const [posts, setPosts] = useState([]);
    const [empty, setEmpty] = useState(false);

    async function handleSearchPost(){
        if(input == ''){
            alert('Digite o conteúdo desejado')
            return;
        }

        const response = await api.get(`api/posts?filters[title][$containsi]=${input}&populate=cover`) // Fazendo a pesquisa dentro de posts conforme o que tenho dentro da useState input

        if(response.data?.data.length === 0){
            setEmpty(true);
            setPosts([]);
            return;
        }

        setPosts(response.data?.data)
        setEmpty(false);
        setInput(''); // Limpar Input
        Keyboard.dismiss(); // Fechar o teclado

    }
    return (
        <View style={styles.container}>
            <View style={styles.containerInput}>
                <TextInput
                onChangeText={ (text) => setInput(text) }
                    value={input}
                    style={styles.input} 
                    placeholder="O que está buscando?"
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearchPost}>
                    <Feather name="search" size={25} color="#000"/>
                </TouchableOpacity>
            </View>

            {empty && (
                <View>
                    <Text style={styles.emptyText}>Ops, não encontramos nenhum post!</Text>
                </View>
            )}

            <FlatList 
            style={{ flex: 1 }}
            showsHorizontalScrollIndicator={false}
            data={posts}
            keyExtractor={ (item) => String(item.id) }
            renderItem={ ({item}) =>  <PostItem data={item} />}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingHorizontal: 18,
        paddingVertical: 18
    },
    containerInput: {
        flexDirection: 'row',
        width: '100%',
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    input: {
        width: '85%',
        backgroundColor: '#C4C4C4',
        height: 45,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        padding: 8,
        fontSize: 16
    },
    searchButton: {
        width: '15%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#C4C4C4',
        height: 45,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5
    },
    emptyText: {
        textAlign: 'center',
    }
})