import { View, ScrollView, Text, Image, StyleSheet, Alert, Modal, TouchableOpacity } from 'react-native'
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { List_Item } from '../components/List_Item';
import { User_Guide_Card } from '../components/User_Guide_Card'
import { apiFetch } from '../services/api'

const TYPE_LABELS = {
    CONSULTA: 'Consulta',
    MANUTENCAO: 'Manutenção',
    LIMPEZA: 'Limpeza',
};

const colorsByType = {
    CONSULTA: '#33AB5B',
    MANUTENCAO: '#4085AF',
    LIMPEZA: '#963765',
};

const defaultColor = '#8C8C8C';

const SERVICE_TYPES = ['CONSULTA', 'MANUTENCAO', 'LIMPEZA'];

LocaleConfig.locales['pt-br'] = {
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

function normalizeDateTime(value) {
    if (!value) return '';
    return String(value);
}

function formatDateTimeLabel(isoDate) {
    if (!isoDate) return 'Data inválida';

    const [datePart, timePart = ''] = String(isoDate).split('T');
    const formattedDate = datePart.split('-').reverse().join('/');
    const formattedTime = timePart.substring(0, 5);
    return `${formattedDate} às ${formattedTime}`;
}

export default function BookingPage() {

    const [selectedDate, setSelectedDate] = useState('');
    const [isGuideVisible, setIsGuideVisible] = useState(false);
    const [availableDates, setAvailableDates] = useState([]);
    const [myAppointments, setMyAppointments] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [hoursForSelectedDay, setHoursForSelectedDay] = useState([]);
    const [selectedServiceType, setSelectedServiceType] = useState('CONSULTA');

    // Função de seleção de dia do calendário
    function handlePressedDay(day) {
        const dateStr = day.dateString;
        setSelectedDate(dateStr);

        const filteredHours = availableDates.filter((item) => {
            const itemDay = normalizeDateTime(item.date_available).split('T')[0];
            return itemDay === dateStr;
        });

        setHoursForSelectedDay(filteredHours);
        setIsModalVisible(true);
    }

    // Função para formatar as datas disponíveis para o calendário
    function getMarkedDates() {
        let marks = {};

        availableDates.forEach((item) => {
            const dayString = normalizeDateTime(item.date_available).split('T')[0];
            if (!dayString) return;

            marks[dayString] = {
                marked: true,
                dotColor: defaultColor
            };
        });

        if (selectedDate) {
            marks[selectedDate] = {
                ...marks[selectedDate],
                selected: true,
                disableTouchEvent: true,
                selectedColor: '#1DA299',
                selectedTextColor: '#FFFFFF'
            };
        }

        return marks;
    }

    // Função para buscar datas disponíveis
    async function fetchAvailableDates() {
        try {
            const response = await apiFetch('/scheduling/getAllDatesAvailable');
            if (response.ok) {
                const data = await response.json();
                setAvailableDates(Array.isArray(data) ? data : []);
            } else {
                console.error('Falha ao buscar datas disponíveis');
            }
        } catch (error) {
            console.error('Erro de requisição: ', error);
        }
    }

    // Função para buscar agendamentos do cliente logado
    async function fetchMyAppointments() {
        try {
            const response = await apiFetch('/scheduling/mySchedulings');
            if (response.ok) {
                const data = await response.json();
                setMyAppointments(Array.isArray(data) ? data : []);
            } else {
                console.error('Falha ao buscar agendamentos do cliente');
            }
        } catch (error) {
            console.error('Erro de requisição: ', error);
        }
    }

    async function refreshBookingData() {
        await Promise.all([fetchAvailableDates(), fetchMyAppointments()]);
    }

    useFocusEffect(
        useCallback(() => {
            refreshBookingData();
        }, [])
    );

    useEffect(() => {
        refreshBookingData();
    }, []);

    // Função para agendar consulta
    async function appointmentScheduling(selectedItem) {
        if (!selectedItem?.date_available) {
            Alert.alert('Erro', 'Horário inválido.');
            return;
        }

        try {
            const response = await apiFetch('/scheduling/scheduleAppointment', {
                method: 'POST',
                body: JSON.stringify({
                    scheduling_type: selectedServiceType,
                    schedulingDate: selectedItem.date_available,
                    status: 'PENDENTE'
                })
            });

            if (response.ok) {
                Alert.alert('Sucesso', 'Agendamento confirmado!');
                setIsModalVisible(false);
                refreshBookingData();
            } else {
                let message = 'O agendamento não foi confirmado.';
                try {
                    const errorData = await response.json();
                    if (errorData?.message) message = errorData.message;
                } catch {
                    // ignore
                }
                Alert.alert('Erro', message);
            }
        } catch (error) {
            console.error('Erro de requisição: ', error);
            Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
        }
    }

    // Função para cancelar agendamento
    async function cancelAppointment(schedulingID) {
        try {
            const response = await apiFetch('/scheduling/cancelAppointment', {
                method: 'POST',
                body: JSON.stringify(schedulingID)
            });

            if (response.ok) {
                Alert.alert('Sucesso', 'O agendamento foi cancelado com sucesso!');
                refreshBookingData();
            } else {
                Alert.alert('Erro', 'Falha ao cancelar agendamento.');
            }
        } catch (error) {
            console.error('Erro de requisição: ', error);
            Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
        }
    }

    const activeAppointments = myAppointments.filter((item) => item.status !== 'CANCELADO');

    return (
        <>
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
                {/* 1: Header */}
                <Header />

                <View style={styles.inner}>
                    {/* 2: Guia de uso */}
                    <View style={styles.userGuideContainer}>
                        <Button title='Guia de uso' style={styles.userGuideButton} textStyle={styles.userGuideButtonText} onPress={() => setIsGuideVisible(true)} />
                    </View>

                    {/* 3: Texto */}
                    <Text style={styles.textContainer}>
                        <Text style={styles.text}>Selecione um dia</Text> <Text style={styles.textSpan}>disponível</Text> <Text style={styles.text}>:</Text>
                    </Text>

                    {/* 4: Calendário */}
                    <View style={styles.calendarContainer}>
                        <Calendar
                            onDayPress={handlePressedDay}
                            markedDates={getMarkedDates()}
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
                        <View style={styles.legend}>
                            <Image style={styles.legendDot} source={require('../assets/img/green-dot.png')} />
                            <Text style={styles.legendText}>Consulta</Text>
                        </View>
                        <View style={styles.legend}>
                            <Image style={styles.legendDot} source={require('../assets/img/blue-dot.png')} />
                            <Text style={styles.legendText}>Manutenção</Text>
                        </View>
                        <View style={styles.legend}>
                            <Image style={styles.legendDot} source={require('../assets/img/purple-dot.png')} />
                            <Text style={styles.legendText}>Limpeza</Text>
                        </View>
                    </View>

                    {/* 6: Texto */}
                    <Text style={styles.bookingText}>Meus agendamentos:</Text>

                    {/* 7: Renderização dos agendamentos do cliente */}
                    {activeAppointments.length > 0 ? (
                        activeAppointments.map((item) => {
                            const itemDotColor = colorsByType[item.scheduling_type] || defaultColor;
                            const typeLabel = TYPE_LABELS[item.scheduling_type] || item.scheduling_type;

                            return (
                                <List_Item
                                    key={item.id}
                                    title={`${typeLabel}\n${formatDateTimeLabel(item.schedulingDate)}\n${item.status || ''}`}
                                    dotColor={itemDotColor}
                                    rightElement={
                                        item.status === 'PENDENTE' ? (
                                            <Button
                                                title="X"
                                                style={styles.cancelButton}
                                                textStyle={styles.cancelButtonText}
                                                onPress={() => {
                                                    Alert.alert(
                                                        "Confirmar Cancelamento",
                                                        "Tem certeza que deseja cancelar este agendamento?",
                                                        [
                                                            { text: "Não", style: "cancel" },
                                                            { text: "Sim", onPress: () => cancelAppointment(item.id) }
                                                        ]
                                                    );
                                                }}
                                            />
                                        ) : null
                                    }
                                />
                            );
                        })
                    ) : (
                        <Text style={styles.emptyText}>Você ainda não possui agendamentos.</Text>
                    )}
                </View>
            </ScrollView>

            {/* 9: Card do guia de uso */}
            {isGuideVisible && (
                <User_Guide_Card onClose={() => setIsGuideVisible(false)} />
            )}

            {/* 10: Pop-up de Horários Disponíveis */}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Horários para {selectedDate.split('-').reverse().join('/')}</Text>

                        <Text style={styles.typeLabel}>Tipo de serviço:</Text>
                        <View style={styles.typeRow}>
                            {SERVICE_TYPES.map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    style={[
                                        styles.typeChip,
                                        selectedServiceType === type && styles.typeChipSelected
                                    ]}
                                    onPress={() => setSelectedServiceType(type)}
                                >
                                    <Text
                                        style={[
                                            styles.typeChipText,
                                            selectedServiceType === type && styles.typeChipTextSelected
                                        ]}
                                    >
                                        {TYPE_LABELS[type]}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <ScrollView style={styles.hoursList}>
                            {hoursForSelectedDay.length > 0 ? (
                                hoursForSelectedDay.map((item, index) => {
                                    const raw = normalizeDateTime(item.date_available);
                                    const timeString = raw.includes('T') ? raw.split('T')[1].substring(0, 5) : 'Horário';

                                    return (
                                        <TouchableOpacity
                                            key={`${raw}-${index}`}
                                            style={styles.hourCard}
                                            onPress={() => appointmentScheduling(item)}
                                        >
                                            <Text style={styles.hourText}>{timeString}</Text>
                                        </TouchableOpacity>
                                    );
                                })
                            ) : (
                                <Text style={styles.noHoursText}>Não há horários disponíveis para este dia.</Text>
                            )}
                        </ScrollView>

                        {/* 11: Botão para fechar o pop-up */}
                        <Button
                            title="Fechar"
                            style={styles.closeModalButton}
                            textStyle={styles.closeModalButtonText}
                            onPress={() => setIsModalVisible(false)}
                        />
                    </View>
                </View>
            </Modal>
        </>
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
    bookingText: {
        fontFamily: 'PoppinsRegular',
        fontSize: 22,
        textAlign: "center",
        marginTop: 14,
        marginBottom: 18,
        color: '#1DA299'
    },
    emptyText: {
        fontFamily: 'PoppinsRegular',
        fontSize: 14,
        color: '#8C8C8C',
        textAlign: 'center',
        marginBottom: 10
    },
    cancelButton: {
        width: 45,
        height: 45,
        backgroundColor: '#c92e2c',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cancelButtonText: {
        color: '#FFF',
        fontSize: 14
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        maxHeight: '70%',
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 22,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    modalTitle: {
        fontFamily: 'PoppinsSemiBold',
        fontSize: 18,
        color: '#1DA299',
        marginBottom: 16,
    },
    typeLabel: {
        fontFamily: 'PoppinsRegular',
        fontSize: 14,
        color: '#666',
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    typeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
        width: '100%',
        justifyContent: 'center',
    },
    typeChip: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: '#EEEDED',
    },
    typeChipSelected: {
        backgroundColor: '#1DA299',
    },
    typeChipText: {
        fontFamily: 'PoppinsRegular',
        fontSize: 13,
        color: '#6E6E6E',
    },
    typeChipTextSelected: {
        color: '#FFFFFF',
    },
    hoursList: {
        width: '100%',
        marginBottom: 16,
    },
    hourCard: {
        width: '100%',
        backgroundColor: '#EEEDED',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    hourText: {
        fontFamily: 'PoppinsRegular',
        fontSize: 16,
        color: '#6E6E6E',
    },
    noHoursText: {
        fontFamily: 'PoppinsRegular',
        fontSize: 14,
        color: '#8C8C8C',
        textAlign: 'center',
        marginVertical: 20,
    },
    closeModalButton: {
        width: '100%',
        height: 48,
        backgroundColor: '#D9D9D9',
        borderRadius: 10,
    },
    closeModalButtonText: {
        color: '#1DA299',
        fontSize: 16,
        fontFamily: 'PoppinsSemiBold',
    }
})
