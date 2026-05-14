import * as ImagePicker from "expo-image-picker";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
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
  const [scanning, setScanning] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const recognizeText = async (imageUri: string) => {
    try {
      console.log("Starting OCR...");

      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: "receipt.jpg",
      } as any);
      formData.append("apikey", "e10634509888957");
      formData.append("language", "eng");
      formData.append("isOverlayRequired", "false");

      const response = await fetch("https://api.ocr.space/parse/image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("OCR Response:", JSON.stringify(data));

      const text = data?.ParsedResults?.[0]?.ParsedText || "";
      console.log("Scanned text:", text);

      const text = data?.ParsedResults?.[0]?.ParsedText || '';
console.log('Scanned text:', text);

// Priority 1 — TOTAL PAYABLE/PAYBLE dhundho
const payableMatch = text.match(
  /TOTAL\s*PAY(?:ABLE|BLE)\s*:?\s*(?:RS\.?|₹|INR)?\s*(\d+(?:[.,]\d{1,2})?)/i
);

// Priority 2 — TOTAL PAID dhundho
const paidMatch = text.match(
  /TOTAL\s*PAID\s*:?\s*(?:RS\.?|₹|INR)?\s*(\d+(?:[.,]\d{1,2})?)/i
);

// Priority 3 — Grand Total dhundho
const grandMatch = text.match(
  /(?:Grand\s*Total|GRAND\s*TOTAL|Net\s*Total|NET\s*TOTAL)\s*:?\s*(?:RS\.?|₹|INR)?\s*(\d+(?:[.,]\d{1,2})?)/i
);

// Priority 4 — Simple TOTAL dhundho
const totalMatch = text.match(
  /(?:^|\n)TOTAL\s*:?\s*(?:RS\.?|₹|INR)?\s*(\d+(?:[.,]\d{1,2})?)/im
);

if (payableMatch) {
  setAmount(payableMatch[1].replace(',', ''));
  Alert.alert('Success! 🎉', `Total Payable: ₹${payableMatch[1]}`);
} else if (paidMatch) {
  setAmount(paidMatch[1].replace(',', ''));
  Alert.alert('Success! 🎉', `Total Paid: ₹${paidMatch[1]}`);
} else if (grandMatch) {
  setAmount(grandMatch[1].replace(',', ''));
  Alert.alert('Success! 🎉', `Grand Total: ₹${grandMatch[1]}`);
} else if (totalMatch) {
  setAmount(totalMatch[1].replace(',', ''));
  Alert.alert('Success! 🎉', `Total: ₹${totalMatch[1]}`);
} else {
  // Sabse bada number dhundho
  const allNumbers = text.match(/\d+(?:\.\d{1,2})?/g);
  const biggestNumber = allNumbers
    ? Math.max(...allNumbers.map(Number)).toString()
    : null;
  if (biggestNumber) {
    setAmount(biggestNumber);
    Alert.alert('Amount Found! 💡', `Found: ₹${biggestNumber}\nPlease verify!`);
  } else {
    Alert.alert('Not Found ⚠️', 'Could not find amount. Enter manually!');
  }
}

  const scanReceipt = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission needed", "Please allow gallery access!");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      if (!result.canceled) {
        setScanning(true);
        setImage(result.assets[0].uri);
        await recognizeText(result.assets[0].uri);
      }
    } catch (error) {
      setScanning(false);
      Alert.alert("Error", "Could not open gallery!");
    }
  };

  const takePhoto = async () => {
    try {
      console.log("Take photo pressed!");
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission needed", "Please allow camera access!");
        return;
      }
      const result = await ImagePicker.launchCameraAsync({ quality: 1 });
      console.log('Result:', JSON.stringify(result));
      if (!result.canceled) {
        console.log("Photo liya!"); // ADD KARO
        console.log("URI:", result.assets[0].uri); // ADD KARO
        setScanning(true);
        setImage(result.assets[0].uri);
        await recognizeText(result.assets[0].uri);
      }
    } catch (error) {
      setScanning(false);
      Alert.alert("Error", "Could not open camera!");
    }
  };

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
      setImage(null);
    } catch (error) {
      Alert.alert("Error! ❌", "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Expense ➕</Text>

      <View style={styles.card}>
        <View style={styles.scanRow}>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={takePhoto}
            disabled={scanning}
          >
            {scanning ? (
              <ActivityIndicator color="#4F46E5" />
            ) : (
              <Text style={styles.scanText}>📷 Take Photo</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.scanButton}
            onPress={scanReceipt}
            disabled={scanning}
          >
            {scanning ? (
              <ActivityIndicator color="#4F46E5" />
            ) : (
              <Text style={styles.scanText}>🖼️ Gallery</Text>
            )}
          </TouchableOpacity>
        </View>

        {image && (
          <Image
            source={{ uri: image }}
            style={styles.imagePreview}
            resizeMode="cover"
          />
        )}

        {scanning && (
          <Text style={styles.scanningText}>🔍 Scanning receipt...</Text>
        )}

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
          style={[styles.saveButton, loading && styles.buttonDisabled]}
          onPress={saveExpense}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? "Saving..." : "Save Expense 💾"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    marginBottom: 30,
  },
  scanRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  scanButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#4F46E5",
    borderStyle: "dashed",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  scanText: {
    color: "#4F46E5",
    fontSize: 14,
    fontWeight: "600",
  },
  imagePreview: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    marginBottom: 12,
  },
  scanningText: {
    textAlign: "center",
    color: "#4F46E5",
    fontSize: 14,
    marginBottom: 8,
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
  saveButton: {
    backgroundColor: "#4F46E5",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  buttonDisabled: {
    backgroundColor: "#A5A3E8",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
