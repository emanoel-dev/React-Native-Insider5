import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { Feather } from '@expo/vector-icons';

import { WebView } from 'react-native-webview'; // Biblioteca para acessar Links dentro dos Apps

export default function LinkWeb({ Link, title, closeModal }) {
    return (
        <>
            <TouchableOpacity onPress={closeModal} style={styles.button}>
                <Feather name="x" size={25} color="#FFF" />
                <Text style={styles.name}>{title}</Text>
            </TouchableOpacity>
            <WebView
                source={{ uri: Link }}
            />
        </>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 10,
        backgroundColor: '#232630',
        marginTop: 60,
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        color: '#FFF',
        marginLeft: 8,
        fontSize: 18,
        zIndex: 100,
        fontWeight: 'bold'
    }
})
