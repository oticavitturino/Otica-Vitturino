import { View, Text, StyleSheet, Modal, Pressable, ScrollView, Linking } from 'react-native'
import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { Button } from './Button'
import { clearSession, getUserName } from '../services/api'

export function Profile_Card({ isVisible, onClose }) {

    const router = useRouter();
    const [userName, setUserName] = useState('Cliente');
    const [isCreditsOpen, setIsCreditsOpen] = useState(false);

    useEffect(() => {
        if (!isVisible) return;

        async function loadProfile() {
            const name = await getUserName();
            if (name) {
                setUserName(name);
            }
        }

        loadProfile();
    }, [isVisible]);

    // Função de deslogar
    async function handleLogout() {
        onClose();
        setIsCreditsOpen(false);
        await clearSession();
        router.replace('/');
    }

    function openCredits() {
        setIsCreditsOpen(true);
    }

    function closeCredits() {
        setIsCreditsOpen(false);
    }

    return (
        <>
            <Modal visible={isVisible && !isCreditsOpen} transparent={true} animationType='fade' onRequestClose={onClose}>
                <Pressable style={styles.overlay} onPress={onClose} />

                {/* 1: Container principal */}
                <View style={styles.container}>

                    {/* 2: Nome do usuário */}
                    <Text style={styles.nameText}>{userName}</Text>
                    <Text style={styles.usernameText}>Cliente Ótica Vitturino</Text>

                    {/* 3: Licenças e Créditos */}
                    <Button
                        title='Licenças e Créditos'
                        style={styles.creditsButton}
                        textStyle={styles.creditsButtonText}
                        onPress={openCredits}
                    />

                    {/* 4: Botão de sair */}
                    <Button title='Sair' style={styles.exitButton} textStyle={styles.exitButtonText} onPress={handleLogout} />
                </View>
            </Modal>

            {/* 5: Modal de créditos visuais */}
            <Modal visible={isCreditsOpen} transparent={true} animationType='fade' onRequestClose={closeCredits}>
                <Pressable style={styles.creditsOverlay} onPress={closeCredits}>
                    <Pressable style={styles.creditsCard} onPress={(e) => e.stopPropagation()}>
                        <Text style={styles.creditsTitle}>Créditos Visuais</Text>
                        <Text style={styles.creditsSubtitle}>
                            Agradecimento aos autores dos recursos visuais utilizados neste aplicativo:
                        </Text>

                        <ScrollView style={styles.creditsList} showsVerticalScrollIndicator={false}>
                            <Text style={styles.creditItem}>
                                • Foto de capa: Steve via{' '}
                                <Text style={styles.creditLink} onPress={() => Linking.openURL('https://www.pexels.com')}>
                                    Pexels
                                </Text>
                            </Text>
                            <Text style={styles.creditItem}>
                                • Ícones: Freepik /{' '}
                                <Text style={styles.creditLink} onPress={() => Linking.openURL('https://www.flaticon.com')}>
                                    Flaticon
                                </Text>
                            </Text>
                            <Text style={styles.creditItem}>
                                • Ilustrações:{' '}
                                <Text style={styles.creditLink} onPress={() => Linking.openURL('https://www.freepik.com')}>
                                    Freepik / Magnific
                                </Text>
                            </Text>
                        </ScrollView>

                        <Button
                            title='Fechar'
                            style={styles.closeCreditsButton}
                            textStyle={styles.closeCreditsButtonText}
                            onPress={closeCredits}
                        />
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'transparent'
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '70%',
        position: 'absolute',
        top: 80,
        right: 30,
        padding: 24,
        zIndex: 999,
        elevation: 10,
        borderRadius: 10,
        backgroundColor: '#D9D9D9',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.30,
        shadowRadius: 4.65
    },
    nameText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 4,
        textAlign: 'center'
    },
    usernameText: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 10,
        textAlign: 'center'
    },
    creditsButton: {
        width: '100%',
        height: 48,
        marginTop: 8,
        backgroundColor: '#EEEEEE',
    },
    creditsButtonText: {
        fontSize: 15,
        color: '#1DA299',
    },
    exitButton: {
        width: '100%',
        height: 55,
        marginTop: 12
    },
    exitButtonText: {
        fontSize: 18
    },
    creditsOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    creditsCard: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 22,
        alignItems: 'center',
    },
    creditsTitle: {
        fontFamily: 'PoppinsSemiBold',
        fontSize: 18,
        color: '#3C7975',
        marginBottom: 8,
        textAlign: 'center',
    },
    creditsSubtitle: {
        fontFamily: 'PoppinsRegular',
        fontSize: 13,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 16,
    },
    creditsList: {
        width: '100%',
        maxHeight: 180,
        marginBottom: 16,
    },
    creditItem: {
        fontFamily: 'PoppinsRegular',
        fontSize: 14,
        color: '#555555',
        marginBottom: 10,
        lineHeight: 20,
    },
    creditLink: {
        color: '#1DA299',
        textDecorationLine: 'underline',
    },
    closeCreditsButton: {
        width: '100%',
        height: 48,
        backgroundColor: '#D9D9D9',
    },
    closeCreditsButtonText: {
        fontSize: 16,
        color: '#1DA299',
    },
})
