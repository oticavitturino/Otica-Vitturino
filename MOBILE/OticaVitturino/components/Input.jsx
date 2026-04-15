import { TextInput, StyleSheet } from "react-native"

export function Input({ ...rest }) {
    return (
        <TextInput style={styles.input} {...rest} />
    )
}

const styles = StyleSheet.create({
    input: {
        width: "100%",
        height: 68,
        paddingLeft: 12,
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
    }
})