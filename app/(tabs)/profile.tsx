import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth } from "../../firebaseConfig";

export default function ProfileScreen() {
  const user = auth.currentUser;

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await signOut(auth);
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Profile</Text>

      <View style={styles.card}>
        <Text style={styles.emoji}>👋</Text>
        <Text style={styles.name}>{user?.displayName || "User"}</Text>
        <Text style={styles.email}>{user?.email || ""}</Text>
      </View>

      <View style={styles.budgetCard}>
        <Text style={styles.budgetLabel}>Monthly Budget</Text>
        <Text style={styles.budgetAmount}>₹ 10,000</Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout 🚪</Text>
      </TouchableOpacity>
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
    padding: 30,
    elevation: 5,
    alignItems: "center",
    marginBottom: 16,
  },
  emoji: {
    fontSize: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  budgetCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    alignItems: "center",
    marginBottom: 16,
  },
  budgetLabel: {
    fontSize: 14,
    color: "#666",
  },
  budgetAmount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4F46E5",
    marginTop: 4,
  },
  logoutBtn: {
    backgroundColor: "#FF4444",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
