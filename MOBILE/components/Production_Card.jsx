import { View, Text, Pressable, Image, StyleSheet } from 'react-native';

export function Production_Card({ title, timeline, isExpanded, onToggle }) {
    return (
        // 1: Container principal (que envolve tudo do card)
        <View style={styles.container}>

            {/* 2: Card clicável */}
            <Pressable
                style={[styles.header, isExpanded && styles.headerExpanded]} onPress={onToggle}
            >
                {/* 3: Título do card */}
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {title}
                </Text>
            </Pressable>

            {/* 4: Corpo interno do card expandido */}
            {isExpanded && (
                <View style={styles.body}>

                    {/* 5: Caixa branca interna */}
                    <View style={styles.innerCard}>

                        {/* 6: Status possíveis dentro do card */}
                        {timeline.map((item, index) => (
                            <View key={index} style={styles.timelineItem}>

                                {/* 7: Divisória da data */}
                                <View style={styles.dateDivider}>
                                    <View style={styles.line} />
                                    <View style={styles.dot} />
                                    <Text style={styles.dateText}>{item.date}</Text>
                                    <View style={styles.dot} />
                                    <View style={styles.line} />
                                </View>

                                {/* 8: O Ícone e o Status */}
                                <View style={styles.statusRow}>
                                    <Image source={item.icon} style={styles.iconImage} resizeMode='contain' />
                                    <Text style={styles.statusText}>{item.status}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 8,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2
    },
    header: {
        backgroundColor: '#74C0B9',
        paddingVertical: 22,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12
    },
    headerExpanded: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
    },
    headerTitle: {
        fontFamily: 'PoppinsSemiBold',
        fontSize: 16,
        color: '#FFFFFF',
        includeFontPadding: false
    },
    body: {
        backgroundColor: '#D9D9D9',
        padding: 16,
        alignItems: 'center',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12
    },
    innerCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        paddingVertical: 24,
        paddingHorizontal: 16,
        width: '100%'
    },
    timelineItem: {
        marginTop: 14,
        marginBottom: 14
    },
    dateDivider: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#74C0B9'
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#74C0B9',
        marginHorizontal: 4
    },
    dateText: {
        fontFamily: 'PoppinsRegular',
        fontSize: 14,
        color: '#74C0B9',
        marginHorizontal: 8,
        includeFontPadding: false
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8
    },
    iconImage: {
        width: 22,
        height: 22,
    },
    statusText: {
        fontFamily: 'PoppinsRegular',
        fontSize: 14,
        color: '#6E6E6E',
        includeFontPadding: false
    }
})