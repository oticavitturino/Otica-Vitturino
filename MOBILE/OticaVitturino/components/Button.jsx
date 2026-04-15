import { TouchableOpacity, Text, StyleSheet } from "react-native";

export function Button({ title, ...rest }) {
    return (
        <TouchableOpacity style={styles.button} activeOpacity={0.7}>
            <Text style={styles.buttonText}>{title}</Text>
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