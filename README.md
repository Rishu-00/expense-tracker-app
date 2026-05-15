# 💰 Expense Tracker

A cross-platform mobile app where you just scan a receipt and the app automatically reads the total amount — no manual entry needed.

---

## ✨ Features

- 📷 Scan any bill or receipt — OCR reads the total amount automatically
- 🔐 Secure login and signup with Firebase Authentication
- ☁️ Real-time cloud sync via Firestore — data available across devices
- 📊 Monthly spending charts — pie chart + bar chart, category-wise breakdown
- 💸 Budget tracker with live progress bar — turns red near the limit
- 🗑️ Add, view and delete expenses anytime
- 🌙 Clean minimal UI with smooth navigation

---

## 🛠️ Tech Stack

| Layer               | Technology                                |
| ------------------- | ----------------------------------------- |
| Mobile Framework    | React Native (Expo)                       |
| Navigation          | Expo Router + React Navigation            |
| Authentication      | Firebase Auth (Email/Password)            |
| Database            | Cloud Firestore (NoSQL, Real-time)        |
| OCR Engine          | OCR Space API                             |
| Charts              | react-native-chart-kit + react-native-svg |
| State Management    | React Hooks (useState, useEffect)         |
| Session Persistence | AsyncStorage                              |
| Version Control     | Git + GitHub                              |

---

## ⚙️ How It Works

```
User scans a receipt with camera
         ↓
Image sent to OCR Space API
         ↓
API extracts text from the bill
         ↓
App finds the total amount using pattern matching
         ↓
Expense saved to Firestore with category + date
         ↓
Home screen and charts update in real-time
```

---

## 💡 Design Decisions

- Used **OCR Space API** because it's free, reliable, and works well with mobile image formats
- Used **Firebase Firestore** for real-time updates — no manual refresh needed anywhere in the app
- Used **Expo Router** for file-based navigation — cleaner folder structure and easier to scale
- **Pattern matching on OCR output** looks for keywords like "Total Payable", "Grand Total", "PAID" before falling back to the largest number — makes amount detection more accurate

---

## 🔮 Future Improvements

- [ ] UPI SMS auto-detection for instant expense logging
- [ ] AI-based spending insights and suggestions
- [ ] Multi-currency support
- [ ] Export expenses as PDF or Excel

---

## 📱 Screenshots

| Home Screen | Add Expense | Charts      |
| ----------- | ----------- | ----------- |
| coming soon | coming soon | coming soon |

---

## 👨‍💻 Author

Rishanshu Tripathi — B.Tech CSE Student
