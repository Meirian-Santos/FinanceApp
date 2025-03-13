import { useState, useEffect } from 'react';
import { View, TextInput, Pressable, Text, FlatList, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

export default function AddTransaction() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    const stored = await AsyncStorage.getItem('transactions');
    const data = stored ? JSON.parse(stored) : [];
    setTransactions(data);
  };

  const handleSave = async () => {
    if (!title || !amount) return;

    if (editingTransaction) {
      // Editar transação existente
      const updatedTransactions = transactions.map(t =>
        t.id === editingTransaction.id ? { ...t, title, amount: parseFloat(amount), type } : t
      );
      await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      setTransactions(updatedTransactions);
      setEditingTransaction(null);
    } else {
      // Criar nova transação
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        title,
        amount: parseFloat(amount),
        type,
        date: new Date().toISOString(),
      };

      const updatedTransactions = [...transactions, newTransaction];
      await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      setTransactions(updatedTransactions);
    }
    setTitle('');
    setAmount('');
    setType('income');
  };

  const handleEdit = (transaction: Transaction) => {
    setTitle(transaction.title);
    setAmount(transaction.amount.toString());
    setType(transaction.type);
    setEditingTransaction(transaction);
  };

  const handleDelete = async (id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    setTransactions(updatedTransactions);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Transaction title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />

      <View style={styles.typeContainer}>
        <Pressable
          style={[styles.typeButton, type === 'income' ? styles.activeType : null]}
          onPress={() => setType('income')}
        >
          <Text style={[styles.typeText, type === 'income' ? styles.activeTypeText : null]}>Income</Text>
        </Pressable>

        <Pressable
          style={[styles.typeButton, type === 'expense' ? styles.activeType : null]}
          onPress={() => setType('expense')}
        >
          <Text style={[styles.typeText, type === 'expense' ? styles.activeTypeText : null]}>Expense</Text>
        </Pressable>
      </View>

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>{editingTransaction ? 'Update Transaction' : 'Save Transaction'}</Text>
      </Pressable>

      <Link href="/" asChild>
        <Pressable style={styles.viewTransactionsButton}>
          <Ionicons name="list" size={20} color="white" />
          <Text style={styles.buttonText}>View Transactions</Text>
        </Pressable>
      </Link>

      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.transaction}>
            <View>
              <Text style={styles.transactionTitle}>{item.title}</Text>
              <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
            </View>
            <View style={styles.transactionActions}>
              <Pressable onPress={() => handleEdit(item)}>
                <Ionicons name="pencil" size={20} color="#007AFF" />
              </Pressable>
              <Pressable onPress={() => handleDelete(item.id)}>
                <Ionicons name="trash" size={20} color="#E74C3C" />
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F7FA',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  typeButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  activeType: {
    backgroundColor: '#007AFF',
  },
  activeTypeText: {
    color: 'white',
  },
  typeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  viewTransactionsButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  transactionActions: {
    flexDirection: 'row',
    gap: 10,
  },
  transactionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3E50',
  },
  date: {
    fontSize: 14,
    color: '#7D8C9D',
  },
  income: {
    color: '#27AE60',
  },
  expense: {
    color: '#E74C3C',
  },
});
