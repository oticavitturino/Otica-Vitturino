import { useState } from 'react';
import { Alert, Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from '../components/Button';

export function Occurrence_Card({ type = "Ocorrência ", isExpanded, onToggle }) {

    const [occurrenceText, setOccurrenceText] = useState('');

    // Função de envio de ocorrência/reclamação
    function handleSend() {
        if (occurrenceText.trim() === '') {
            Alert.alert(`Por favor, digite sua ${type.toLowerCase()} antes de enviar.`);
            return;
        }

        Alert.alert(`Sua ${type.toLowerCase()} foi enviada com sucesso!`);
        setOccurrenceText('');
        onToggle();
        Keyboard.dismiss();
    }

    return (
        // 1: Container principal (que envolve tudo do card)
        <View style={styles.container}>

            {/* 2: Card clicável */}
            <Pressable style={[styles.header, isExpanded && styles.headerExpanded]} onPress={onToggle}>

                {/* 3: Título do card */}
                <Text style={styles.headerTitle}>Registrar {type}</Text>
            </Pressable>

            {/* 4: Corpo do card (expande ao clicar) */}
            {isExpanded && (
                <View style={styles.body}>

                    {/* 5: Caixa de texto */}
                    <TextInput
                        style={styles.input}
                        placeholder={`Digite aqui sua ${type.toLowerCase()}`}
                        placeholderTextColor="#A9A9A9"
                        multiline={true}
                        numberOfLines={5}
                        textAlignVertical="top"
                        value={occurrenceText}
                        onChangeText={setOccurrenceText}
                    />

                    {/* 6: Botão de enviar */}
                    <Button title="Enviar" onPress={handleSend} style={styles.sendButton} textStyle={styles.sendButtonText} />
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginBottom: 8,
        borderRadius: 12,
        overflow: "hidden",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2
    },
    header: {
        backgroundColor: "#74C0B9",
        paddingVertical: 22,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12
    },
    headerExpanded: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
    },
    headerTitle: {
        fontFamily: "PoppinsSemiBold",
        fontSize: 16,
        color: "#FFFFFF",
        includeFontPadding: false
    },
    body: {
        backgroundColor: "#D9D9D9",
        padding: 16,
        alignItems: "center",
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12
    },
    input: {
        width: "100%",
        height: 240,
        backgroundColor: "#F8F8F8",
        borderRadius: 8,
        padding: 16,
        fontFamily: "PoppinsRegular",
        fontSize: 14,
        color: "#333333",
        marginBottom: 16
    },
    sendButton: {
        backgroundColor: "#1DA299",
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 8
    },
    sendButtonText: {
        fontFamily: "PoppinsSemiBold",
        fontSize: 16,
        color: "#FFFFFF",
        includeFontPadding: false
    }
})