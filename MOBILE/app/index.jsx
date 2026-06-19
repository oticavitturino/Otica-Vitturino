import { View, Text, Image, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Input } from '../components/Input'
import { Button } from '../components/Button'

export default function Login() {

  const router = useRouter();
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  async function handleLogin() {
    if (!emailInput || !passwordInput) {
      Alert.alert('Atenção', 'Preencha e-mail e senha para continuar.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: emailInput,
          password: passwordInput
        })
      });

      if (response.ok) {
        const data = await response.json();

        if (data.token) {
          await AsyncStorage.setItem('userToken', data.token);
        }

        router.replace('/homepage');
      } else {
        Alert.alert('Erro', 'E-mail ou senha incorretos.');
      }
    } catch (error) {
      console.error('Erro de requisição: ', error);
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
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
            <Button title='Entrar' onPress={handleLogin} />
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