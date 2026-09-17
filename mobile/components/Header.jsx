import { View, Text, Image, StyleSheet, Pressable } from 'react-native'
import { useState, useEffect, useCallback } from 'react'
import { useRouter, useFocusEffect } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Profile_Card } from './Profile_Card';
import { apiFetch, getUserId } from '../services/api'

export function Header() {

    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userScore, setUserScore] = useState(0);

    function handleUserMenuClick() {
        setIsMenuOpen(!isMenuOpen);
    }

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

    useEffect(() => {
        fetchScore();
    }, []);

    return (
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) + 8 }]}>
            <View style={styles.side}>
                <View style={styles.scoreContainer}>
                    <Image style={styles.scoreImage} source={require('../assets/img/medal.png')} resizeMode='contain' />
                    <Text style={styles.scoreText}>{userScore}</Text>
                </View>
            </View>

            <Pressable style={styles.logoContainer} onPress={() => router.replace('/homepage')}>
                <Image style={styles.logo} source={require('../assets/img/logovitturino.png')} resizeMode='contain' />
            </Pressable>

            <View style={[styles.side, styles.sideRight]}>
                <Pressable style={styles.userButton} onPress={handleUserMenuClick}>
                    <View style={[styles.glowContainer, isMenuOpen && styles.activeGlow]}>
                        <Image style={styles.userIcon} source={require('../assets/img/circle-user-round.png')} resizeMode='contain' />
                    </View>
                </Pressable>
            </View>

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
        minHeight: 112,
        paddingHorizontal: 20,
        paddingBottom: 16,
        backgroundColor: 'rgba(29, 162, 153, 0.82)'
    },
    side: {
        width: 72,
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
    },
    sideRight: {
        alignItems: 'flex-end',
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
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    logo: {
        width: 140,
        height: 80
    },
    userButton: {
        marginRight: 0
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
