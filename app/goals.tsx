import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';

export default function GoalsScreen() {
  const [goals, setGoals] = useState({
    emergencia: 'Reserva de Emergência',
    economia: 'Economia de 20% da Renda',
    viagem: 'Viagem',
    educacao: 'Educação',
    alimentacao: 'Alimento',
    gastoPessoal: 'Gasto Pessoal',
  });

  const [editing, setEditing] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  const startEditing = (key: string, currentName: string) => {
    setEditing(key);
    setNewName(currentName);
  };

  const saveNewName = (key: string) => {
    setGoals(prev => ({ ...prev, [key]: newName }));
    setEditing(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Metas Financeiras</Text>

      {Object.entries(goals).map(([key, label]) => (
        <View key={key} style={styles.goal}>
          {editing === key ? (
            <>
              <TextInput
                style={styles.input}
                value={newName}
                onChangeText={setNewName}
                autoFocus
              />
              <TouchableOpacity onPress={() => saveNewName(key)} style={styles.saveButton}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.goalText}>{label}</Text>
              <TouchableOpacity onPress={() => startEditing(key, label)}>
                <Text style={styles.editText}>✏️ Editar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      ))}
    </View>
  );
}

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
    marginBottom: 20,
  },
  goal: {
    backgroundColor: '#e0f7fa',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalText: {
    fontSize: 18,
  },
  editText: {
    color: '#007bff',
  },
  input: {
    borderBottomWidth: 1,
    width: '60%',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#4caf50',
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },
});
