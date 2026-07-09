import { View, Text, Image, StyleSheet, Pressable } from 'react-native'
import { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Profile_Card } from './Profile_Card';

export function Header() {

    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userScore, setUserScore] = useState(0);

    // Função executada ao clicar no botão de usuário
    function handleUserMenuClick() {
        setIsMenuOpen(!isMenuOpen);

    }

    // Função para buscar a pontuação do cliente
    async function fetchScore() {
        try {
            const customerId = await AsyncStorage.getItem('userId');

            if (!customerId) return;

            const url = `http://localhost:8080/customer/score?id=${customerId}`;
            const response = await fetch(url);

            if (response.ok) {
                const data = await response.json();
                setUserScore(data); //
            } else {
                console.error(`Falha na API ao buscar score: Status ${response.status}`);
            }
        } catch (error) {
            console.error('Erro de requisição: ', error);
        }
    }

    useEffect(() => {
        fetchScore();
    }, []);

    return (
        <View style={styles.header}>
            {/* 1: Ícone de score */}
            <View style={styles.scoreContainer}>
                <Image style={styles.scoreImage} source={require('../assets/img/medal.png')} />
                <Text style={styles.scoreText}>{userScore}</Text>
            </View>

            {/* 2: Logo */}
            <Pressable style={styles.logoContainer} onPress={() => router.replace('/homepage')}>
                <Image style={styles.logo} source={require('../assets/img/logovitturino.png')} />
            </Pressable>

            {/* 3: Ícone de usuário */}
            <Pressable style={styles.userButton} onPress={handleUserMenuClick}>
                <View style={[styles.glowContainer, isMenuOpen && styles.activeGlow]}>
                    <Image style={[styles.userIcon]} source={require('../assets/img/circle-user-round.png')} resizeMode='contain' />
                </View>
            </Pressable>

            {/* 4: Card de profile */}
            <Profile_Card isVisible={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        width: '100%',
        height: 140,
        padding: 30,
        backgroundColor: '#1DA299D0'
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    scoreImage: {
        width: 38,
        height: 38
    },
    scoreText: {
        fontFamily: 'PoppinsRegular',
        fontSize: 18,
        marginTop: 4,
        color: '#EEEDED'
    },
    logoContainer: {
        position: 'absolute',
        bottom: 12,
        left: '50%',
        marginLeft: -38
    },
    logo: {
        width: 140,
        height: 80

    },
    userButton: {
        marginRight: 8
    },
    glowContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    activeGlow: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderRadius: 25,
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 10
    },
    userIcon: {
        width: 42,
        height: 42
    }
})