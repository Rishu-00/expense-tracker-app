import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { auth, db } from "../../firebaseConfig";

const screenWidth = Dimensions.get("window").width;

export default function ChartsScreen() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [barData, setBarData] = useState<any>({
    labels: [],
    datasets: [{ data: [0] }],
  });

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((user) => {
      if (!user) return;

      const q = query(
        collection(db, "expenses"),
        where("userId", "==", user.uid),
      );

      const unsubSnapshot = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setExpenses(data);

        const grouped: any = {};
        data.forEach((e: any) => {
          const cat = e.category.split(" ")[1] || e.category;
          if (grouped[cat]) {
            grouped[cat] += e.amount;
          } else {
            grouped[cat] = e.amount;
          }
        });

        const COLORS = ["#4F46E5", "#7C3AED", "#EC4899", "#F59E0B"];

        const pie = Object.keys(grouped).map((key, index) => ({
          name: key,
          amount: grouped[key],
          color: COLORS[index % COLORS.length],
          legendFontColor: "#333",
          legendFontSize: 13,
        }));
        setCategoryData(pie);

        setBarData({
          labels: Object.keys(grouped),
          datasets: [{ data: Object.values(grouped) }],
        });
      });

      return unsubSnapshot;
    });

    return unsubAuth;
  }, []);

  const total = expenses.reduce((acc: number, e: any) => acc + e.amount, 0);

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.6,
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <Text style={styles.title}>📊 Monthly Report</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Spent</Text>
        <Text style={styles.totalAmount}>₹ {total}</Text>
        <Text style={styles.budgetText}>
          Budget Remaining: ₹ {10000 - total}
        </Text>
      </View>

      {categoryData.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.empty}>
            No data yet!{"\n"}Add some expenses first 😊
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Spending by Category</Text>
            <PieChart
              data={categoryData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Category Breakdown</Text>
            <BarChart
              data={barData}
              width={screenWidth - 60}
              height={220}
              chartConfig={chartConfig}
              verticalLabelRotation={0}
              yAxisLabel="₹"
              yAxisSuffix=""
              showValuesOnTopOfBars
            />
          </View>

          {/* Summary List */}
          <View style={styles.summaryCard}>
            <Text style={styles.cardTitle}>Category Summary</Text>
            {categoryData.map((item, index) => (
              <View key={index} style={styles.summaryRow}>
                <View style={styles.summaryLeft}>
                  <View style={[styles.dot, { backgroundColor: item.color }]} />
                  <Text style={styles.summaryCategory}>{item.name}</Text>
                </View>
                <Text style={styles.summaryAmount}>₹ {item.amount}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    marginBottom: 16,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#4F46E5",
    marginTop: 4,
  },
  budgetText: {
    fontSize: 14,
    color: "#999",
    marginTop: 6,
  },
  emptyCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 40,
    elevation: 5,
    alignItems: "center",
  },
  empty: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
    lineHeight: 28,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  summaryLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  summaryCategory: {
    fontSize: 14,
    color: "#333",
  },
  summaryAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4F46E5",
  },
});
