import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { STRINGS } from "@/constants/strings";
import { Ticket, TicketInput } from "@/src/types/ticket";
import {
  getTickets,
  createTicket,
  updateTicket,
  deleteTicket,
} from "@/services/ticketService";
import TicketForm from "@/components/TicketForm";

export default function TicketSettingsScreen() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

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

  const handleAddTicket = () => {
    setEditingTicket(null);
    setFormVisible(true);
  };

  const handleEditTicket = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setFormVisible(true);
  };

  const handleDeleteTicket = (ticket: Ticket) => {
    Alert.alert(
      STRINGS.TICKET_SETTINGS.DELETE_TICKET,
      STRINGS.TICKET_SETTINGS.DELETE_CONFIRM,
      [
        { text: STRINGS.TICKET_SETTINGS.CANCEL, style: "cancel" },
        {
          text: STRINGS.TICKET_SETTINGS.DELETE,
          style: "destructive",
          onPress: async () => {
            if (!ticket.id) return;
            try {
              await deleteTicket(ticket.id);
              await loadTickets();
            } catch (error) {
              Alert.alert("Error", "Failed to delete ticket");
            }
          },
        },
      ]
    );
  };

  const handleFormSubmit = async (ticketInput: TicketInput) => {
    try {
      if (editingTicket?.id) {
        await updateTicket(editingTicket.id, ticketInput);
      } else {
        await createTicket(ticketInput);
      }
      await loadTickets();
    } catch (error) {
      throw error;
    }
  };

  const renderTicketItem = ({ item }: { item: Ticket }) => (
    <View style={styles.ticketItem}>
      <View style={styles.ticketInfo}>
        <Text style={styles.ticketName}>{item.ticketName}</Text>
        <Text style={styles.ticketLabel}>{item.label}</Text>
      </View>
      <View style={styles.ticketActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditTicket(item)}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteTicket(item)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>{STRINGS.TICKET_SETTINGS.NO_TICKETS}</Text>
      <TouchableOpacity style={styles.createButton} onPress={handleAddTicket}>
        <Text style={styles.createButtonText}>{STRINGS.TICKET_SETTINGS.CREATE_TICKET}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Text style={styles.title}>{STRINGS.TICKET_SETTINGS.TITLE}</Text>
        {tickets.length > 0 && (
          <TouchableOpacity style={styles.addButton} onPress={handleAddTicket}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <Text>Loading...</Text>
        </View>
      ) : tickets.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={tickets}
          renderItem={renderTicketItem}
          keyExtractor={(item) => item.id || Math.random().toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={styles.listContent}
        />
      )}

      <TicketForm
        visible={formVisible}
        onClose={() => {
          setFormVisible(false);
          setEditingTicket(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={
          editingTicket
            ? {
                ticketName: editingTicket.ticketName,
                timeSlot: editingTicket.timeSlot,
              }
            : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  ticketItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ticketInfo: {
    marginBottom: 12,
  },
  ticketName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  ticketLabel: {
    fontSize: 14,
    color: "#666",
  },
  ticketActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#f0f0f0",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
  },
  editButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  createButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
