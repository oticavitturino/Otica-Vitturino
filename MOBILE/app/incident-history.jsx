import { View, ScrollView, Text, Image, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { useState, useEffect, useCallback } from 'react'
import { useFocusEffect } from 'expo-router'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { List_Item } from '../components/List_Item'
import { Occurrence_Card } from '../components/Occurrence_Card'
import { User_Guide_Card } from '../components/User_Guide_Card'
import { apiFetch } from '../services/api'

export default function Incident_History() {

    const [openCard, setOpenCard] = useState(null);
    const [occurrences, setOccurrences] = useState([]);
    const [isGuideVisible, setIsGuideVisible] = useState(false);

    //Função para retornar histórico de ocorrências
    async function fetchAllOccurrences() {
        try {
            const response = await apiFetch('/occurrences/occurrenceCustomer');
            if (response.ok) {
                const data = await response.json();
                setOccurrences(data);
            } else {
                console.error('Falha ao buscar histórico.');
            }
        } catch (error) {
            console.error('Erro de requisição: ', error);
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchAllOccurrences();
        }, [])
    );

    useEffect(() => {
        fetchAllOccurrences();
    }, []);

    // Função para registrar ocorrência
    async function registerOccurrence(categoryType, userDescription) {
        try {
            const response = await apiFetch('/occurrences/register', {
                method: 'POST',
                body: JSON.stringify({
                    description: userDescription,
                    sentAt: new Date().toISOString(),
                    category: categoryType,
                })
            });

            if (response.ok) {
                Alert.alert('Sucesso', 'Ocorrência registrada!');
                setOpenCard(null);
                fetchAllOccurrences();
            } else {
                Alert.alert('Erro', 'Ocorrência não registrada. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro de requisição: ', error);
            Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
        }
    }

    // Função para fechar um card aberto ao abrir outro card
    function toggleCard(cardName) {
        if (openCard === cardName) {
            setOpenCard(null);
        } else {
            setOpenCard(cardName);
        }
    }

    return (
        <>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
                    {/* 1: Header */}
                    <Header />

                    <View style={styles.inner}>
                        {/* 2: Guia de uso */}
                        <View style={styles.userGuideContainer}>
                            <Button title='Guia de uso' style={styles.userGuideButton} textStyle={styles.userGuideButtonText} onPress={() => setIsGuideVisible(true)} />
                        </View>

                        {/* 3: Texto */}
                        <Text style={styles.textContainer}>
                            <Text style={styles.text}>Registre aqui sua {"\n"}</Text> <Text style={styles.textSpan}>ocorrência/reclamação</Text> <Text style={styles.text}>:</Text>
                        </Text>

                        {/* 4: Ilustração */}
                        <Image style={styles.illustration} source={require('../assets/img/thinking.png')} resizeMode='contain' />

                        {/* 5: Container dos cards */}
                        <View style={styles.cardsContainer}>
                            <Occurrence_Card
                                type='Ocorrência'
                                isExpanded={openCard === 'Ocorrência'}
                                onToggle={() => toggleCard('Ocorrência')}
                                onSubmit={(typedText) => registerOccurrence('Ocorrência', typedText)}
                            />
                            <Occurrence_Card
                                type='Reclamação'
                                isExpanded={openCard === 'Reclamação'}
                                onToggle={() => toggleCard('Reclamação')}
                                onSubmit={(typedText) => registerOccurrence('Reclamação', typedText)}
                            />
                        </View>

                        {/* 6: Texto */}
                        <Text style={styles.historyText}>Histórico:</Text>

                        {/* 7: Itens do histórico */}
                        {occurrences.length === 0 ? (
                            <Text style={styles.emptyText}>Nenhuma ocorrência registrada.</Text>
                        ) : (
                            occurrences.map((item) => (
                                <List_Item titleStyle={styles.titleStyle} key={item.id} title={item.description} />
                            ))
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* 8: Card do guia de uso */}
            {isGuideVisible && (
                <User_Guide_Card onClose={() => setIsGuideVisible(false)} />
            )}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEDED'
    },
    inner: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 18
    },
    userGuideContainer: {
        alignItems: 'flex-end',
        width: '100%',
        marginTop: 22
    },
    userGuideButton: {
        width: 180,
        height: 50,
        paddingVertical: 10,
        borderRadius: 30,
        backgroundColor: '#D9D9D9'
    },
    userGuideButtonText: {
        fontSize: 18,
        color: '#1DA299'
    },
    textContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        textAlign: 'center',
        marginTop: 16,
    },
    text: {
        fontFamily: 'PoppinsRegular',
        fontSize: 22,
        marginBottom: 20,
        color: '#6E6E6E'
    },
    textSpan: {
        fontFamily: 'PoppinsRegular',
        fontSize: 22,
        color: '#1DA299'
    },
    illustration: {
        width: 250,
        height: 250
    },
    cardsContainer: {
        width: '100%',
        marginTop: 20,
    },
    historyText: {
        fontFamily: 'PoppinsRegular',
        fontSize: 22,
        marginTop: 18,
        marginBottom: 18,
        color: '#1DA299'
    },
    emptyText: {
        fontFamily: 'PoppinsRegular',
        fontSize: 14,
        color: '#8C8C8C',
        textAlign: 'center'
    },
    titleStyle: {
        fontSize: 14
    }
})
