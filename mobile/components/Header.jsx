import { View, Text, Image, StyleSheet, Pressable } from 'react-native'
import { useState, useCallback } from 'react'
import { useRouter, useFocusEffect } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Profile_Card } from './Profile_Card';
import { apiFetch, getUserId } from '../services/api'

export function Header() {

    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userScore, setUserScore] = useState(0);

    // Função executada ao clicar no botão de usuário
    function handleUserMenuClick() {
        setIsMenuOpen(!isMenuOpen);
    }

    // Função para buscar a pontuação do cliente
    async function fetchScore() {
        try {
            const customerId = await getUserId();

            if (!customerId) return;

            const response = await apiFetch(`/customer/score?id=${customerId}`);

            if (response.ok) {
                const data = await response.json();
                setUserScore(typeof data === 'number' ? data : (data.points ?? 0));
            } else {
                console.error(`Falha na API ao buscar score: Status ${response.status}`);
            }
        } catch (error) {
            console.error('Erro de requisição: ', error);
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchScore();
        }, [])
    );

    return (
        <View style={[styles.header, { height: 140 + insets.top, paddingTop: insets.top }]}>
            <View style={styles.row}>
                {/* 1: Ícone de score */}
                <View style={styles.sideLeft}>
                    <Image style={styles.scoreImage} source={require('../assets/img/medal.png')} />
                    <Text style={styles.scoreText}>{userScore}</Text>
                </View>

                {/* 2: Logo */}
                <Pressable style={styles.sideCenter} onPress={() => router.replace('/homepage')}>
                    <Image style={styles.logo} source={require('../assets/img/logovitturino.png')} resizeMode="contain" />
                </Pressable>

                {/* 3: Ícone de usuário */}
                <View style={styles.sideRight}>
                    <Pressable onPress={handleUserMenuClick}>
                        <View style={[styles.glowContainer, isMenuOpen && styles.activeGlow]}>
                            <Image style={styles.userIcon} source={require('../assets/img/circle-user-round.png')} resizeMode="contain" />
                        </View>
                    </Pressable>
                </View>
            </View>

            {/* 4: Card de profile */}
            <Profile_Card isVisible={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 140,
        paddingHorizontal: 30,
        paddingBottom: 30,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(10, 10, 10, 0.8)'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
    },
    sideLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    sideCenter: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    sideRight: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    scoreImage: {
        width: 38,
        height: 38
    },
    scoreText: {
        fontFamily: 'PoppinsRegular',
        fontSize: 18,
        marginTop: 4,
        color: '#FFFFFF'
    },
    logo: {
        width: 60,
        height: 60
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
        width: 38,
        height: 38
    }
})