import { View, ScrollView, Text, Image, StyleSheet } from 'react-native'
import { useState } from 'react'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { Production_Card } from '../components/Production_Card'

export default function Production_Page() {

    // Status ENUM
    const STATUS_DICIONARIO = {
        'PEDIDO_REALIZADO': {
            texto: 'Pedido realizado',
            icone: require('../assets/img/check-check.png') //
        },
        'EM_PRODUCAO': {
            texto: 'Em processo de montagem',
            icone: require('../assets/img/wrench.png') //
        },
        'CONCLUIDO': {
            texto: 'Produto concluído',
            icone: require('../assets/img/package-check.png') //
        }
    };

    const produtos = [
        {
            id: '1',
            title: 'RAY-BAN META WAYFARER - GEN 2',
            timeline: [
                { date: '8 mar', statusCode: 'PEDIDO_REALIZADO' },
                { date: '21 mar', statusCode: 'EM_PRODUCAO' }
            ]
        },
        {
            id: '2',
            title: 'Óculos de Grau Redondo Duna...',
            timeline: [
                { date: '10 abr', statusCode: 'PEDIDO_REALIZADO' },
                { date: '12 abr', statusCode: 'EM_PRODUCAO' },
                { date: '15 abr', statusCode: 'CONCLUIDO' }
            ]
        }
    ];

    const [openCardId, setOpenCardId] = useState(produtos[null]);

    function toggleCard(id) {
        if (openCardId === id) {
            setOpenCardId(null);
        } else {
            setOpenCardId(id);
        }
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
            {/* 1: Header */}
            <Header />

            <View style={styles.inner}>
                {/* 2: Guia de uso */}
                <View style={styles.userGuideContainer}>
                    <Button style={styles.userGuideButton} textStyle={styles.userGuideButtonText} title='Guia de uso' />
                </View>

                {/* 3: Texto */}
                <Text style={styles.textContainer}>
                    <Text style={styles.text}>Acompanhe aqui o</Text> <Text style={styles.textSpan}>status {"\n"}</Text> <Text style={styles.text}>de produção:</Text>
                </Text>

                {/* 4: Ilustração */}
                <Image style={styles.illustration} source={require('../assets/img/gear_10945800.png')} resizeMode='contain' />

                {/* 5: Texto */}
                <Text style={styles.textStatus}>Status:</Text>

                {/* 6: Container dos Cards */}
                <View style={styles.cardsContainer}>

                    {produtos.map((product) => (
                        <Production_Card
                            key={product.id}
                            title={product.title}
                            isExpanded={openCardId === product.id}
                            onToggle={() => toggleCard(product.id)}
                            timeline={product.timeline.map((step) => ({
                                date: step.date,
                                status: STATUS_DICIONARIO[step.statusCode].texto,
                                icon: STATUS_DICIONARIO[step.statusCode].icone
                            }))}
                        />
                    ))}
                </View>
            </View>
        </ScrollView>
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
        width: '100%',
        justifyContent: 'center',
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 24
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
        width: 150,
        height: 150,
    },
    textStatus: {
        fontFamily: 'PoppinsRegular',
        fontSize: 22,
        marginTop: 18,
        marginBottom: 18,
        color: '#1DA299'
    },
    cardsContainer: {
        width: '100%'
    }
})