import { View, Text, StyleSheet, Image } from 'react-native'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { useRouter } from 'expo-router'

export default function Homepage() {

    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* 1: Header */}
            <Header />

            <View style={styles.inner}>

                {/* 2: Guia de uso */}
                <View style={styles.userGuideContainer}>
                    <Button style={styles.userGuideButton} textStyle={styles.userGuideButtonText} title="Guia de uso" />
                </View>

                {/* 3: Texto */}
                <Text style={styles.textContainer}>
                    <Text style={styles.text}>O que faremos hoje, </Text> <Text style={styles.textSpan}>usuário</Text> <Text style={styles.text}>?</Text>
                </Text>

                {/* 4: Imagem */}
                <Image style={styles.illustration} source={require("../assets/img/10725885-cut.png")} resizeMode="contain" />

                {/* 5: Botões */}
                <View style={styles.pageButtonContainer}>
                    <Button style={styles.pageButton} textStyle={styles.pageButtonText} title="Agendar Consulta" onPress={() => router.navigate('/booking-page')} />
                    <Button style={styles.pageButton} textStyle={styles.pageButtonText} title="Acompanhar Produção" onPress={() => router.navigate('/production-page')} />
                    <Button style={styles.pageButton} textStyle={styles.pageButtonText} title="Registrar Ocorrência/Reclamação" onPress={() => router.navigate('/incident-history')} />
                    <Button style={styles.pageButton} textStyle={styles.pageButtonText} title="Indicar Aplicativo" onPress={() => router.navigate('')} />
                </View>

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEEDED"
    },
    inner: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        paddingHorizontal: 18
    },
    userGuideContainer: {
        alignItems: "flex-end",
        width: "100%",
        marginTop: 22
    },
    userGuideButton: {
        width: 180,
        height: 50,
        paddingVertical: 10,
        borderRadius: 30,
        backgroundColor: "#D9D9D9",
    },
    userGuideButtonText: {
        fontSize: 18,
        color: "#1DA299"
    },
    textContainer: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "center",
        marginTop: 16
    },
    text: {
        fontFamily: "PoppinsRegular",
        fontSize: 22,
        color: "#6E6E6E"
    },
    textSpan: {
        fontFamily: "PoppinsRegular",
        fontSize: 22,
        color: "#1DA299"
    },
    illustration: {
        width: 250,
        height: 250,
        marginTop: 14,
        marginBottom: 14,
        marginRight: 10

    },
    pageButtonContainer: {
        width: "100%",
        gap: 6
    },
    pageButton: {
        height: 70,
        borderRadius: 10,
        backgroundColor: "#31A9A1C5"
    },
    pageButtonText: {
        fontSize: 16
    }
})