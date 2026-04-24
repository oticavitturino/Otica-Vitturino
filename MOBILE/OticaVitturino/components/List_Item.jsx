import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export function List_Item({ title, dotColor, expandable, onPress, headerStyle, titleStyle, children }) {

    const [isExpanded, setIsExpanded] = useState(false);

    // Função que roda ao clicar na caixa
    function handlePress() {
        if (expandable) {
            setIsExpanded(!isExpanded);
        } else if (onPress) {
            onPress();
        }
    }

    return (
        // 1: Container principal (que envolve tudo do list item)
        <View style={[styles.container, isExpanded && styles.containerExpanded]}>

            {/* 2: List item clicável */}
            <Pressable style={[styles.header, headerStyle, isExpanded && styles.headerExpanded]} onPress={handlePress}>

                {/* 3: Quadrado colorido da legenda (se tiver no list item) */}
                {dotColor && <View style={[styles.dot, { backgroundColor: dotColor }]} />}

                {/* 4: Título do list item */}
                <Text style={[styles.title, titleStyle]} numberOfLines={1}>
                    {title}
                </Text>
            </Pressable>

            {/* 5: Corpo do list item (quando for expansível) */}
            {expandable && isExpanded && (
                <View style={styles.body}>
                    {children}
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
        backgroundColor: "#FFFFFF",
        overflow: "hidden"
    },
    containerExpanded: {
        backgroundColor: "#E8E8E8"
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 24,
        borderRadius: 12,
        backgroundColor: "#FFFFFF"
    },
    headerExpanded: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
    },
    dot: {
        width: 14,
        height: 14,
        borderRadius: 3,
        marginRight: 12
    },
    title: {
        flex: 1,
        fontFamily: "PoppinsRegular",
        fontSize: 18,
        includeFontPadding: false,
        color: "#6E6E6E"
    },
    body: {
        padding: 16,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12
    }
})