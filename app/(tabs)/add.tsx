import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../firebaseConfig";

export default function AddScreen() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const saveExpense = async () => {
    if (!amount || !category) {
      Alert.alert("Wait! ⚠️", "Please fill Amount and Category!");
      return;
    }
    try {
      setLoading(true);
      const user = auth.currentUser;
      await addDoc(collection(db, "expenses"), {
        userId: user?.uid,
        amount: parseFloat(amount),
        category,
        note,
        date: Timestamp.now(),
      });
      Alert.alert("Success! ✅", "Expense saved successfully!");
      setAmount("");
      setCategory("");
      setNote("");
    } catch (error) {
      Alert.alert("Error! ❌", "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Expense ➕</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Amount (₹) *</Text>
        <TextInput
          style={styles.input}
          placeholder="How much did you spend?"
          keyboardType="numeric"
          placeholderTextColor="#999"
          value={amount}
          onChangeText={setAmount}
        />

        <Text style={styles.label}>Category *</Text>
        <View style={styles.categoryRow}>
          {["🍔 Food", "🚗 Travel", "🛍️ Shopping", "💊 Health"].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryBtn,
                category === cat && styles.categoryBtnActive,
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === cat && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Note</Text>
        <TextInput
          style={styles.input}
          placeholder="Add a note..."
          placeholderTextColor="#999"
          value={note}
          onChangeText={setNote}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={saveExpense}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Saving..." : "Save Expense 💾"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.scanButton}>
          <Text style={styles.scanText}>📷 Scan Receipt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  categoryBtn: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryBtnActive: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },
  categoryText: {
    color: "#666",
    fontSize: 13,
  },
  categoryTextActive: {
    color: "white",
  },
  button: {
    backgroundColor: "#4F46E5",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  buttonDisabled: {
    backgroundColor: "#A5A3E8",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  scanButton: {
    borderWidth: 2,
    borderColor: "#4F46E5",
    borderStyle: "dashed",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  scanText: {
    color: "#4F46E5",
    fontSize: 16,
    fontWeight: "600",
  },
});
