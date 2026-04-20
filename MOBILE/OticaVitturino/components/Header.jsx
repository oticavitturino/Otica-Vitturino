import { View, Text, Image, StyleSheet, Pressable } from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router';

export function Header() {

    const router = useRouter();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Função executada ao clicar no botão de usuário
    function handleUserMenuClick() {
        setIsMenuOpen(!isMenuOpen);

    }

    return (
        <View style={styles.header}>
            {/* 1: Ícone de score */}
            <View style={styles.scoreContainer}>
                <Image style={styles.scoreImage} source={require('../assets/img/medal.png')} />
                <Text style={styles.scoreText}>300</Text>
            </View>

            {/* 2: Logo */}
            <Pressable style={styles.logoContainer} onPress={() => router.replace('/homepage')}>
                <Image style={styles.logo} source={require('../assets/img/logovitturino.png')} />
            </Pressable>

            {/* 3: Ícone de usuário */}
            <Pressable style={styles.userButton} onPress={handleUserMenuClick}>
                <Image resizeMode='contain' style={[styles.userIcon, { tintColor: isMenuOpen ? "#3C7975" : undefined }]} source={require('../assets/img/circle-user-round.png')} />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        width: "100%",
        height: 140,
        padding: 30,
        backgroundColor: "#1da299d0"
    },
    scoreContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6
    },
    scoreImage: {
        width: 38,
        height: 38
    },
    scoreText: {
        fontFamily: "PoppinsRegular",
        fontSize: 18,
        marginTop: 4,
        color: "#ffffff"
    },
    logoContainer: {
        position: "absolute",
        bottom: 12,
        left: "50%",
        marginLeft: -38
    },
    logo: {
        width: 140,
        height: 80,

    },
    userButton: {
        marginRight: 8
    },
    userIcon: {
        width: 42,
        height: 42,
    }
})
