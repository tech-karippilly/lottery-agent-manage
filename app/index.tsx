import { StyleSheet } from 'react-native';
import TicketSelectScreen from './ticket-select';

export default function Index() {
  return (
    <TicketSelectScreen />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", 
    alignItems: "center",     
  },
  loginLink: {
    fontSize: 18,
    color: "blue",
    padding: 10,
    marginBottom: 20,
  },
});
