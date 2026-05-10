import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { auth, db } from "../../firebaseConfig";

export default function HomeScreen() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((user) => {
      if (!user) return;

      const q = query(
        collection(db, "expenses"),
        where("userId", "==", user.uid),
        orderBy("date", "desc"),
      );

      const unsubSnapshot = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setExpenses(data);
        const sum = data.reduce((acc: number, e: any) => acc + e.amount, 0);
        setTotal(sum);
      });

      return unsubSnapshot;
    });

    return unsubAuth;
  }, []);

  const renderItem = ({ item }: any) => (
    <View style={styles.expenseItem}>
      <View style={styles.expenseLeft}>
        <Text style={styles.expenseCategory}>{item.category}</Text>
        <Text style={styles.expenseNote}>{item.note || "No note"}</Text>
      </View>
      <Text style={styles.expenseAmount}>₹ {item.amount}</Text>
    </View>
  );

  const budget = 10000;
  const percentage = Math.min((total / budget) * 100, 100);
  const remaining = budget - total;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello! 👋</Text>
        <Text style={styles.name}>
          {auth.currentUser?.displayName || "User"}
        </Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>This Month's Expenses</Text>
        <Text style={styles.balanceAmount}>₹ {total}</Text>
        <Text style={styles.balanceSub}>Budget Remaining: ₹ {remaining}</Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${percentage}%` as any,
                backgroundColor: percentage > 80 ? "#FF4444" : "#4F46E5",
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {Math.round(percentage)}% of budget used
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Expenses</Text>
        {expenses.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.empty}>No expenses yet 😊</Text>
            <Text style={styles.emptySub}>
              Tap ➕ to add your first expense!
            </Text>
          </View>
        ) : (
          <FlatList
            data={expenses}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            scrollEnabled={false}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#4F46E5",
    padding: 30,
    paddingTop: 60,
  },
  greeting: {
    color: "white",
    fontSize: 16,
    opacity: 0.8,
  },
  name: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 4,
  },
  balanceCard: {
    backgroundColor: "white",
    margin: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  balanceLabel: {
    fontSize: 14,
    color: "#666",
  },
  balanceAmount: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#4F46E5",
    marginTop: 8,
  },
  balanceSub: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    marginTop: 16,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#999",
    marginTop: 6,
  },
  section: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  expenseItem: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    elevation: 2,
  },
  expenseLeft: {
    flex: 1,
  },
  expenseCategory: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  expenseNote: {
    fontSize: 13,
    color: "#999",
    marginTop: 2,
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4F46E5",
  },
  emptyCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 30,
    elevation: 2,
    alignItems: "center",
  },
  empty: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  emptySub: {
    textAlign: "center",
    color: "#999",
    fontSize: 14,
    marginTop: 6,
  },
});
