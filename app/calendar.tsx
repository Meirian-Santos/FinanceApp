import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal } from 'react-native';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [dateNames, setDateNames] = useState<{ [key: string]: string }>({});
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');

  // Função para adicionar ou atualizar o nome de uma data
  const saveDateName = () => {
    setDateNames((prev) => ({ ...prev, [selectedDate]: newName }));
    setNewName('');
    setIsModalVisible(false);
  };

  // Função para obter os dias do mês
  const getDaysInMonth = (month: number, year: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  // Função para selecionar uma data
  const handleDateSelect = (day: number) => {
    const selected = `${currentYear}-${currentMonth + 1}-${day}`;
    setSelectedDate(selected);
    setIsModalVisible(true);
  };

  // Funções de navegação entre os meses
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const days = getDaysInMonth(currentMonth, currentYear);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
      </Text>

      <View style={styles.navigation}>
        <Button title="Previous" onPress={handlePreviousMonth} />
        <Button title="Next" onPress={handleNextMonth} />
      </View>

      <FlatList
        data={days}
        numColumns={7}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.dayContainer}
            onPress={() => item && handleDateSelect(item)}>
            <Text style={styles.dayText}>{item}</Text>
          </TouchableOpacity>
        )}
        style={styles.calendarGrid}
      />

      {selectedDate && dateNames[selectedDate] && (
        <Text style={styles.selectedDate}>Nome para esta data: {dateNames[selectedDate]}</Text>
      )}

      {/* Modal para adicionar nome à data */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nomear Data</Text>

            <TextInput
              style={styles.input}
              placeholder="Digite o nome para esta data"
              value={newName}
              onChangeText={setNewName}
            />

            <Button title="Salvar" onPress={saveDateName} />
            <Button title="Cancelar" onPress={() => setIsModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  navigation: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  calendarGrid: {
    width: '100%',
  },
  dayContainer: {
    width: '14%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dayText: {
    fontSize: 18,
  },
  selectedDate: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    width: '80%',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    marginBottom: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
});

export default Calendar;
