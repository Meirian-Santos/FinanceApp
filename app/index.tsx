import { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Animated, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

export default function HomeScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    loadTransactions();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadTransactions = async () => {
    const stored = await AsyncStorage.getItem('transactions');
    const data = stored ? JSON.parse(stored) : [];
    setTransactions(data);
    calculateBalance(data);
    updateChartData(data);
  };

  const calculateBalance = (data: Transaction[]) => {
    const total = data.reduce((acc, t) =>
      t.type === 'income' ? acc + t.amount : acc - t.amount, 0);
    setBalance(total);
  };

  const updateChartData = (data: Transaction[]) => {
    const incomeTotal = data.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenseTotal = data.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    setChartData([
      { name: 'Income', amount: incomeTotal, color: '#27AE60', legendFontColor: '#2D3E50', legendFontSize: 14 },
      { name: 'Expense', amount: expenseTotal, color: '#E74C3C', legendFontColor: '#2D3E50', legendFontSize: 14 }
    ]);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Finance App</Text>
        <Text style={styles.balance}>Balance: ${balance.toFixed(2)}</Text>
      </Animated.View>

      <Link href="/add-transaction" asChild>
        <Pressable style={styles.addButton}>
          <Ionicons name="add-circle" size={28} color="white" />
          <Text style={styles.buttonText}>Add Transaction</Text>
        </Pressable>
      </Link>

      <Text style={styles.sectionTitle}>Spending Overview</Text>
      {chartData.some(data => data.amount > 0) ? (
        <PieChart
          data={chartData}
          width={Dimensions.get('window').width - 40}
          height={200}
          chartConfig={{
            backgroundColor: '#F5F7FA',
            backgroundGradientFrom: '#F5F7FA',
            backgroundGradientTo: '#F5F7FA',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      ) : (
        <Text style={styles.noTransactions}>No spending data available</Text>
      )}

      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      {transactions.length === 0 ? (
        <Text style={styles.noTransactions}>No recent transactions</Text>
      ) : (
        <FlatList
          data={transactions.slice(-3).reverse()}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.transaction}>
              <View>
                <Text style={styles.transactionTitle}>{item.title}</Text>
                <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
              </View>
              <Text style={[styles.amount, item.type === 'income' ? styles.income : styles.expense]}>
                ${item.amount.toFixed(2)}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F7FA',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2D3E50',
  },
  balance: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#27AE60',
    marginTop: 5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3E50',
    marginBottom: 10,
    marginTop: 10,
  },
  noTransactions: {
    fontSize: 16,
    color: '#7D8C9D',
    textAlign: 'center',
    marginBottom: 10,
  },
  transaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
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
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  income: {
    color: '#27AE60',
  },
  expense: {
    color: '#E74C3C',
  },
});
