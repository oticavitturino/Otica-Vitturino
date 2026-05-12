import { View, Text, Image, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Input } from '../components/Input'
import { Button } from '../components/Button'

export default function Login() {

  const router = useRouter();

  const [emailInput, setEmailInput] = useState('');

  const [passwordInput, setPasswordInput] = useState('');

  const users = [
    {
      id: 1,
      email: "caiovtech@outlook.com",
      password: "123456"
    },
    {
      id: 2,
      email: "danieldanielsilva08@gmail.com",
      password: "123456"
    }
  ];

  function checkLogin() {
    Keyboard.dismiss();

    const userFound = users.find(
      (user) => user.email === emailInput && user.password === passwordInput
    );

    if (userFound) {
      router.replace('/homepage');
    } else {
      Alert.alert(
        "Acesso Negado",
        "E-mail ou senha incorretos. Tente novamente."
      );
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        <View style={styles.inner}>

          {/* 1: Header (Logo & Title) */}
          <View style={styles.headerContainer}>
            <Image style={styles.logo} source={require('../assets/img/upscalemedia-transformed.png')} resizeMode='contain' />
            <Text style={styles.title}>Fazer Login</Text>
          </View>

          {/* 2: Form (Inputs & Button) */}
          <View style={styles.formContainer}>
            <Input placeholder='Digite seu e-mail' keyboardType='email-address' autoCapitalize='none' autoCorrect={false} value={emailInput} onChangeText={setEmailInput} />
            <Input placeholder='Digite sua senha' secureTextEntry={true} value={passwordInput} onChangeText={setPasswordInput} />
            <Button title='Entrar' onPress={checkLogin} />
          </View>

        </View>

      </KeyboardAvoidingView>

    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEDED'
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 18
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 60,
    gap: 40
  },
  logo: {
    width: 250,
    height: 80,
    marginBottom: 10,
  },
  title: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 34,
    color: '#1DA299'
  },
  formContainer: {
    width: '100%',
    gap: 14
  }
})