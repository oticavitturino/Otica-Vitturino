import { View, Text, StyleSheet, Modal, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
// import { useContext } from 'react' - para quando for integrar
// import { AuthContext } from '../contexts/AuthContext' - para quando for integrar
import { Button } from './Button'

export function Profile_Card({ isVisible, onClose }) {

    const router = useRouter();

    // const userContext = useContext(AuthContext); - para quando for integrar
    // const userName = userContext?.name || 'Usuário Indefinido'; - para quando for integrar
    // const userUsername = userContext?.username || '@indefinido'; - para quando for integrar

    const userName = 'Caio Vasconcelos';
    const userUsername = '@caiovtech';

    // Função de deslogar
    function handleLogout() {
        onClose();
        router.replace('/');
    }

    return (
        <Modal visible={isVisible} transparent={true} animationType='fade' onRequestClose={onClose}>
            <Pressable style={styles.overlay} onPress={onClose} />

            {/* 1: Container principal */}
            <View style={styles.container}>

                {/* 2: Nome e username do usuário */}
                <Text style={styles.nameText}>{userName}</Text>
                <Text style={styles.usernameText}>{userUsername}</Text>

                {/* 3: Botão de sair */}
                <Button title='Sair' style={styles.exitButton} textStyle={styles.exitButtonText} onPress={handleLogout} />
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'trasparent'
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
        marginBottom: 4
    },
    usernameText: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 10
    },
    exitButton: {
        width: '100%',
        height: 55,
        marginTop: 12
    },
    exitButtonText: {
        fontSize: 18
    }
})