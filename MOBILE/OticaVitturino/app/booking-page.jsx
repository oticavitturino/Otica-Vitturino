import { View, ScrollView, Text, Image, StyleSheet } from 'react-native'
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useState } from 'react';
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { List_Item } from '../components/List_Item';

LocaleConfig.locales['pt-br'] = {
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

const agendamentos = [
    {
        id: '1',
        title: 'Limpeza - 6 mar (16:30)',
        color: '#963765'
    },
    {
        id: '2',
        title: 'Consulta - 30 mar (14:00)',
        color: '#33AB5B'
    },
    {
        id: '3',
        title: 'Manutenção - 15 mai (09:00)',
        color: '#4085AF'
    },
    {
        id: '4',
        title: 'Consulta - 22 abr (10:45)',
        color: '#33AB5B'
    },
    {
        id: '5',
        title: 'Limpeza - 31 dez (23:59)',
        color: '#963765'
    }
]

export default function BookingPage() {

    const [selectedDate, setSelectedDate] = useState('');

    // Função de seleção de dia do calendário
    function handlePressedDay(day) {
        setSelectedDate(day.dateString);

    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
            {/* 1: Header */}
            <Header />

            <View style={styles.inner}>
                {/* 2: Guia de uso */}
                <View style={styles.userGuideContainer}>
                    <Button style={styles.userGuideButton} textStyle={styles.userGuideButtonText} title='Guia de uso' />
                </View>

                {/* 3: Texto */}
                <Text style={styles.textContainer}>
                    <Text style={styles.text}>Selecione um dia</Text> <Text style={styles.textSpan}>disponível</Text> <Text style={styles.text}>:</Text>
                </Text>

                {/* 4: Calendário */}
                <View style={styles.calendarContainer}>
                    <Calendar
                        onDayPress={handlePressedDay}
                        markedDates={{
                            [selectedDate]: {
                                selected: true,
                                disableTouchEvent: true
                            }
                        }}
                        theme={{
                            backgroundColor: 'transparent',
                            calendarBackground: 'transparent',
                            textSectionTitleColor: '#1DA299',
                            selectedDayBackgroundColor: '#1DA299',
                            selectedDayTextColor: '#FFFFFF',
                            todayTextColor: '#1DA299',
                            dayTextColor: '#8C8C8C',
                            textDisabledColor: '#D9E1E8',
                            arrowColor: '#8C8C8C',
                            monthTextColor: '#1DA299',
                            textMonthFontFamily: 'PoppinsSemiBold',
                            textDayHeaderFontFamily: 'PoppinsRegular',
                            textDayFontFamily: 'PoppinsRegular',
                            textMonthFontSize: 18,
                        }}
                        hideExtraDays={true}
                    />
                </View>

                {/* 5: Legenda de serviços */}
                <View style={styles.legendContainer}>
                    {/* Consulta */}
                    <View style={styles.legend}>
                        <Image style={styles.legendDot} source={require('../assets/img/green-dot.png')} />
                        <Text style={styles.legendText}>Consulta</Text>
                    </View>
                    {/* Manutenção */}
                    <View style={styles.legend}>
                        <Image style={styles.legendDot} source={require('../assets/img/blue-dot.png')} />
                        <Text style={styles.legendText}>Manutenção</Text>
                    </View>
                    {/* Limpeza */}
                    <View style={styles.legend}>
                        <Image style={styles.legendDot} source={require('../assets/img/purple-dot.png')} />
                        <Text style={styles.legendText}>Limpeza</Text>
                    </View>
                </View>

                {/* 6: Texto */}
                <Text style={styles.textBooking}>Agendamentos:</Text>

                {/* 7: Renderização dos agendamentos */}
                {agendamentos.map((item) => (
                    <List_Item key={item.id} title={item.title} dotColor={item.color} />
                ))}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEDED'
    },
    inner: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 18
    },
    userGuideContainer: {
        alignItems: 'flex-end',
        width: '100%',
        marginTop: 22
    },
    userGuideButton: {
        width: 180,
        height: 50,
        paddingVertical: 10,
        borderRadius: 30,
        backgroundColor: '#D9D9D9',
    },
    userGuideButtonText: {
        fontSize: 18,
        color: '#1DA299'
    },
    textContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        textAlign: 'center',
        marginTop: 16
    },
    text: {
        fontFamily: 'PoppinsRegular',
        fontSize: 22,
        marginBottom: 20,
        color: '#6E6E6E'
    },
    textSpan: {
        fontFamily: 'PoppinsRegular',
        fontSize: 22,
        color: '#1DA299'
    },
    calendarContainer: {
        width: '100%',
        backgroundColor: '#D9D9D9',
        borderRadius: 20,
        marginTop: 16,
        padding: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginTop: 12,
        gap: 10
    },
    legend: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    legendDot: {
        width: 14,
        height: 14
    },
    legendText: {
        fontFamily: 'PoppinsRegular',
        fontSize: 16,
        marginTop: 4,
        color: '#33ABA3'
    },
    textBooking: {
        fontFamily: 'PoppinsRegular',
        fontSize: 22,
        marginTop: 14,
        marginBottom: 18,
        color: '#1DA299'
    }
})