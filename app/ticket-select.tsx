import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { STRINGS } from "@/constants/strings";
import { Ticket } from "@/src/types/ticket";
import { getTickets } from "@/services/ticketService";
import { ROUTES } from "@/constants/routes";

// Color palette for ticket buttons
const TICKET_COLORS = [
  "#007AFF", // Blue
  "#34C759", // Green
  "#FF9500", // Orange
  "#FF3B30", // Red
  "#AF52DE", // Purple
  "#FF2D55", // Pink
  "#5AC8FA", // Light Blue
  "#FFCC00", // Yellow
  "#5856D6", // Indigo
  "#FF9500", // Orange
];

export default function TicketSelectScreen() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const ticketsData = await getTickets();
      setTickets(ticketsData);
    } catch (error) {
      Alert.alert("Error", "Failed to load tickets");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadTickets();
  };

  const handleTicketSelect = (ticket: Ticket, index: number) => {
    const backgroundColor = getTicketColor(index);
    router.push({
      pathname: ROUTES.ADD_NUMBER as any,
      params: {
        ticketName: ticket.label,
        backgroundColor: backgroundColor,
        ticketId: ticket.id || "",
      },
    });
  };

  const getTicketColor = (index: number): string => {
    return TICKET_COLORS[index % TICKET_COLORS.length];
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.centerContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Text style={styles.title}>{STRINGS.TICKET_SELECT.TITLE}</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Ticket Buttons in Columns */}
        <View style={styles.ticketsContainer}>
          {tickets.length === 0 ? (
            <Text style={styles.emptyText}>{STRINGS.TICKET_SELECT.NO_TICKETS}</Text>
          ) : (
            tickets.map((ticket, index) => (
              <TouchableOpacity
                key={ticket.id || index}
                style={[
                  styles.ticketButton,
                  {
                    backgroundColor: getTicketColor(index),
                  },
                ]}
                onPress={() => handleTicketSelect(ticket, index)}
                activeOpacity={0.8}
              >
                <Text style={styles.ticketButtonText}>{ticket.label}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ticketsContainer: {
    flexDirection: "column",
    gap: 12,
    marginBottom: 24,
  },
  ticketButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  ticketButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
    padding: 20,
  },
});

