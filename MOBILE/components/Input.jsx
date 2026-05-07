import { TextInput, StyleSheet } from 'react-native'

export function Input({ ...rest }) {
    return (
        <TextInput style={styles.input} {...rest} />
    )
}

const styles = StyleSheet.create({
    input: {
        width: '100%',
        height: 64,
        paddingLeft: 12,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        fontFamily: 'PoppinsRegular',
        textAlign: 'center',
    }
})