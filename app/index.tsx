import { StyleSheet } from 'react-native';
import TicketSelectScreen from './ticket-select';



export default function Index() {
  return (
    <>
      <TicketSelectScreen/>
    </>
  );
}

const styles = StyleSheet.create({
  loginLink: {
    fontSize: 18,
    color: "blue",
    padding: 10,
  },
});
