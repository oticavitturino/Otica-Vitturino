import { View, Text, Image, StyleSheet, Share, Alert } from 'react-native'
import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { User_Guide_Card } from '../components/User_Guide_Card'

export default function Refer_A_Friend() {

    const [isGuideVisible, setIsGuideVisible] = useState(false);
    const [myReferralCode, setMyReferralCode] = useState('');

    useEffect(() => {
        async function loadReferralCode() {
            try {
                const code = await AsyncStorage.getItem('referralCode');
                if (code) {
                    setMyReferralCode(code);
                }
            } catch (error) {
                console.error('Erro ao carregar o código de indicação', error);
            }
        }
        loadReferralCode();
    }, []);

    // Função para compartilhar o aplicativo
    async function shareWithAFriend() {
        const shareMessage = `Oi! Estou usando o app da Ótica Vitturino para acompanhar meus serviços. Diga que eu te indiquei usando meu código ${myReferralCode} no seu primeiro atendimento e ganhe um bônus especial!`;

        try {
            const result = await Share.share({
                message: shareMessage,
                title: 'Convite para o App'
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log('Compartilhado no app: ', result.activityType);
                } else {
                    console.log('Gaveta de compartilhamento fechada');
                }
            } else if (result.action === Share.dismissedAction) {
                console.log('Compartilhamento cancelado');
            }
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível compartilhar no momento.');
            console.error(error.message);
        }
    }

    return (
        <>
            <View style={styles.container}>
                {/* 1: Header */}
                <Header />

                <View style={styles.inner}>
                    {/* 2: Guia de uso */}
                    <View style={styles.userGuideContainer}>
                        <Button title='Guia de uso' style={styles.userGuideButton} textStyle={styles.userGuideButtonText} onPress={() => setIsGuideVisible(true)} />
                    </View>

                    {/* 3: Texto */}
                    <Text style={styles.textContainer}>
                        <Text style={styles.text}>Compartilhe o aplicativo com seus amigos e ganhe </Text>
                        <Text style={styles.textSpan}>pontos </Text>
                        <Text style={styles.text}>para receber descontos!</Text>
                    </Text>

                    {/* 4: Ilustração */}
                    <Image style={styles.illustration} source={require('../assets/img/clap.png')} resizeMode='contain' />

                    {/* 5: Botão de indicar amigo */}
                    <Button title='Compartilhar' onPress={shareWithAFriend} style={styles.shareButton} />
                </View>
            </View>

            {/* 6: Card do guia de uso */}
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
        width: 400,
        height: 400
    },
    shareButton: {
        marginTop: 24
    }
})