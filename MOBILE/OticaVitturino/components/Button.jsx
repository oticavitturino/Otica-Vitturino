import { TouchableOpacity, Text, StyleSheet } from "react-native";

export function Button({ title, onPress, style, textStyle, ...rest }) {
    return (
        <TouchableOpacity style={[styles.button, style]} activeOpacity={0.6} onPress={onPress}>
            <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        width: "100%",
        height: 74,
        justifyContent: "center",
        alignItems: "center",
        padding: 12,
        borderRadius: 14,
        backgroundColor: "#1DA299"
    },
    buttonText: {
        fontFamily: "PoppinsRegular",
        fontSize: 24,
        color: "#FFFFFF"
    }
})