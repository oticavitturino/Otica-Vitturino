import { View, ScrollView, Text, Image, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { useState } from 'react'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { List_Item } from '../components/List_Item'
import { Occurrence_Card } from '../components/Occurrence_Card'

const historico = [
    {
        id: "1",
        title: "Acho que meu óculos está demorando demais para chegar"
    },
    {
        id: "2",
        title: "O óculos chegou, mas o parafuso que segura a perna esquerda caiu. Acho que veio danificado"
    }
]

export default function Incident_History() {

    const [openCard, setOpenCard] = useState(null);

    // Função para fechar um card aberto ao abrir outro card
    function toggleCard(cardName) {
        if (openCard === cardName) {
            setOpenCard(null);
        } else {
            setOpenCard(cardName);
        }
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
                {/* 1: Header */}
                <Header />

                <View style={styles.inner}>
                    {/* 2: Guia de uso */}
                    <View style={styles.userGuideContainer}>
                        <Button style={styles.userGuideButton} textStyle={styles.userGuideButtonText} title="Guia de uso" />
                    </View>

                    {/* 3: Texto */}
                    <Text style={styles.textContainer}>
                        <Text style={styles.text}>Registre aqui sua {"\n"}</Text> <Text style={styles.textSpan}>ocorrência/reclamação</Text> <Text style={styles.text}>:</Text>
                    </Text>

                    {/* 4: Ilustração */}
                    <Image style={styles.illustration} source={require("../assets/img/thinking.png")} resizeMode="contain" />

                    {/* 5: Container dos cards */}
                    <View style={styles.cardsContainer}>
                        <Occurrence_Card type="Ocorrência" isExpanded={openCard === "Ocorrência"} onToggle={() => toggleCard("Ocorrência")} />
                        <Occurrence_Card type="Reclamação" isExpanded={openCard === "Reclamação"} onToggle={() => toggleCard("Reclamação")} />
                    </View>

                    {/* 6: Texto */}
                    <Text style={styles.textHistory}>Histórico:</Text>

                    {/* 7: Itens do histórico */}
                    {historico.map((item) => (
                        <List_Item titleStyle={styles.titleStyle} key={item.id} title={item.title} />
                    ))}
                </View>

            </ScrollView>

        </KeyboardAvoidingView>
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
        textAlign: "center",
        marginTop: 16,
    },
    text: {
        fontFamily: "PoppinsRegular",
        fontSize: 22,
        marginBottom: 20,
        color: "#6E6E6E"
    },
    textSpan: {
        fontFamily: "PoppinsRegular",
        fontSize: 22,
        color: "#1DA299"
    },
    illustration: {
        width: 250,
        height: 250
    },
    cardsContainer: {
        width: "100%",
        marginTop: 20,
    },
    textHistory: {
        fontFamily: "PoppinsRegular",
        fontSize: 22,
        marginTop: 14,
        marginBottom: 14,
        color: "#1DA299"
    },
    titleStyle: {
        fontSize: 14
    }
})