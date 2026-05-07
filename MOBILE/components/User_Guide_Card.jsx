import { View, ScrollView, Text, StyleSheet } from 'react-native'
import { Button } from './Button'

export function User_Guide_Card({ onClose }) {
    return (
        <View style={styles.overlay}>
            <View style={styles.container}>
                <ScrollView>
                    <Text style={styles.userGuideText}>Ao usar a função <Text style={styles.userGuideTextSpan}>"Agendar Consulta"</Text>, selecione um dia disponível no calendário (marcado em verde) e em seguida o tipo de agendamento desejado.</Text>
                    <Text style={styles.userGuideText}>Utilizando a função <Text style={styles.userGuideTextSpan}>"Acompanhar Produção"</Text>, seus produtos em andamento estarão disponíveis na tela e basta clicar em cima deles para verficar os seus detalhes.</Text>
                    <Text style={styles.userGuideText}>Na sessão de <Text style={styles.userGuideTextSpan}>"Registrar Ocorrência/Reclamação"</Text>, haverá dois botões onde você poderá registrar qualquer problema que venha a ter. Basta clicar no botão desejado que irá abrir um espaço para você digitar e um botão para o envio do seu problema. No final dessa sessão estarão listados todas as suas ocorrências/reclamações.</Text>
                    <Text style={styles.userGuideText}>Na função <Text style={styles.userGuideTextSpan}>"Indicar Aplicativo"</Text>, você poderá compartilhar o App com outras pessoas e receber pontos que se tornarão descontos nos seus próximos serviços agendados.</Text>
                </ScrollView>
                <Button title='Entendi' style={styles.gotItButton} textStyle={styles.gotItButtonText} onPress={onClose}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        zIndex: 999, elevation: 999,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: 'rgba(0, 0, 0, 0.6)'
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '95%',
        height: '65%',
        position: 'absolute',
        top: 230,
        zIndex: 999,
        padding: 16,
        paddingTop: 30,
        borderRadius: 20,
        backgroundColor: '#D9D9D9'
    },
    userGuideText: {
        fontFamily: 'PoppinsRegular',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 18,
        marginBottom: 18,
        color: '#919191'
    },
    userGuideTextSpan: {
        color: '#1DA299'
    },
    gotItButton: {
        backgroundColor: 'transparent',
        marginTop: 12
    },
    gotItButtonText: {
        color: '#1DA299'
    }
})