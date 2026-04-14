import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Bem-vindo à Ótica Vitturino!</Text>
      
      <Link href="/login" style={styles.botao}>
        Ir para Login
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#31A9A1',
  },
  titulo: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  botao: {
    fontSize: 18,
    color: '#FFF',
    textDecorationLine: 'underline',
  }
});