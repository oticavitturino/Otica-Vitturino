import { TextInput, StyleSheet, Platform } from 'react-native'

export function Input({ style, ...rest }) {
    return (
        <TextInput
            style={[styles.input, style]}
            placeholderTextColor="#8C8C8C"
            {...rest}
        />
    )
}

const styles = StyleSheet.create({
    input: {
        width: '100%',
        height: 64,
        paddingHorizontal: 12,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        textAlign: 'center',
        color: '#333333',
        fontSize: 16,
        ...(Platform.OS === 'android' ? {} : { fontFamily: 'PoppinsRegular' }),
    }
})
