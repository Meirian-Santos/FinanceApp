import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Calculator() {
  const [display, setDisplay] = useState(''); // Exibe a expressão atual
  const [memory, setMemory] = useState(0); // Armazena o valor da memória
  const [isMemoryRecall, setIsMemoryRecall] = useState(false); // Para verificar se estamos usando a memória

  // Função para adicionar números e operadores ao display
  const handlePress = (value: string) => {
    setDisplay(prev => prev + value);
  };

  // Função para calcular o resultado
  const calculate = () => {
    try {
      setDisplay(eval(display).toString()); // Avalia a expressão
    } catch (error) {
      setDisplay('Erro');
    }
  };

  // Função para limpar o display
  const clearDisplay = () => {
    setDisplay('');
  };

  // Função para limpar a memória
  const clearMemory = () => {
    setMemory(0);
    setIsMemoryRecall(false);
  };

  // Função para armazenar o valor na memória
  const storeInMemory = () => {
    try {
      const result = eval(display);
      setMemory(result);
      setIsMemoryRecall(true);
      setDisplay(''); // Limpa o display após armazenar
    } catch (error) {
      setDisplay('Erro');
    }
  };

  // Função para recuperar o valor da memória
  const recallMemory = () => {
    setDisplay(memory.toString());
    setIsMemoryRecall(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.display}>{display || (isMemoryRecall ? `M: ${memory}` : '')}</Text>

      <View style={styles.row}>
        <Button title="1" onPress={() => handlePress('1')} />
        <Button title="2" onPress={() => handlePress('2')} />
        <Button title="3" onPress={() => handlePress('3')} />
        <Button title="/" onPress={() => handlePress('/')} />
      </View>
      <View style={styles.row}>
        <Button title="4" onPress={() => handlePress('4')} />
        <Button title="5" onPress={() => handlePress('5')} />
        <Button title="6" onPress={() => handlePress('6')} />
        <Button title="*" onPress={() => handlePress('*')} />
      </View>
      <View style={styles.row}>
        <Button title="7" onPress={() => handlePress('7')} />
        <Button title="8" onPress={() => handlePress('8')} />
        <Button title="9" onPress={() => handlePress('9')} />
        <Button title="-" onPress={() => handlePress('-')} />
      </View>
      <View style={styles.row}>
        <Button title="0" onPress={() => handlePress('0')} />
        <Button title="C" onPress={clearDisplay} />
        <Button title="=" onPress={calculate} />
        <Button title="+" onPress={() => handlePress('+')} />
      </View>

      <View style={styles.row}>
        <Button title="M+" onPress={storeInMemory} />
        <Button title="MR" onPress={recallMemory} />
        <Button title="MC" onPress={clearMemory} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  display: {
    fontSize: 40,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#ddd',
    width: '80%',
    textAlign: 'right',
    borderRadius: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
});
