import { View, Text, Image, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '../components/Input'
import { Button } from '../components/Button'

export default function Login() {

  const router = useRouter();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.inner}>

          {/* 1: Header (Logo & Title) */}
          <View style={styles.headerContainer}>
            <Image style={styles.logo} source={require("../assets/img/upscalemedia-transformed.png")} resizeMode="contain" />
            <Text style={styles.title}>Fazer Login</Text>
          </View>

          {/* 2: Form (Inputs & Button) */}
          <View style={styles.formContainer}>
            <Input placeholder="Digite seu e-mail" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
            <Input placeholder="Digite sua senha" secureTextEntry={true} />
            <Button title="Entrar" onPress={() => router.replace('/homepage')} />
          </View>

        </View>

      </KeyboardAvoidingView>

    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eeeded",
  },
  inner: {
    flex: 1,
    paddingHorizontal: 18,
    justifyContent: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 60,
    gap: 40
  },
  logo: {
    width: 250,
    height: 80,
    marginBottom: 10,
  },
  title: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 34,
    color: "#1DA299",
  },
  formContainer: {
    width: "100%",
    gap: 14,
  }
})