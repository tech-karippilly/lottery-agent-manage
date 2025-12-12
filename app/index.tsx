import { Link } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>

      <Link href="/login" style={styles.loginLink}>
        Go to Login
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  loginLink: {
    fontSize: 18,
    color: "blue",
    padding: 10,
  },
});
