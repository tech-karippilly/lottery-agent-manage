import { StyleSheet } from 'react-native';
import SettingsScreen from "./settings";

export default function Index() {
  return (
    <SettingsScreen/>
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
