import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { STRINGS } from "@/constants/strings";
import { Ticket } from "@/src/types/ticket";
import { getTickets } from "@/services/ticketService";

export type TicketOption = "all" | string;

interface TicketSelectorProps {
  /**
   * Currently selected ticket label or "all"
   */
  selectedValue: TicketOption;

  /**
   * Callback when ticket is selected
   */
  onSelect: (value: TicketOption) => void;

  /**
   * Whether to show "All" option
   * Default: true
   */
  showAll?: boolean;

  /**
   * Optional label for the selector
   */
  label?: string;
}

export default function TicketSelector({
  selectedValue,
  onSelect,
  showAll = true,
  label,
}: TicketSelectorProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const ticketsData = await getTickets();
      setTickets(ticketsData);
    } catch (error) {
      console.error("Error loading tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const options: TicketOption[] = showAll
    ? ["all", ...tickets.map((t) => t.label)]
    : tickets.map((t) => t.label);

  const getDisplayText = (value: TicketOption): string => {
    if (value === "all") return STRINGS.COMPONENTS.ALL;
    return value;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        <Text style={styles.loadingText}>Loading tickets...</Text>
      </View>
    );
  }

  if (tickets.length === 0) {
    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        <Text style={styles.emptyText}>No tickets available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={`${option}-${index}`}
            style={[
              styles.option,
              selectedValue === option && styles.optionSelected,
            ]}
            onPress={() => onSelect(option)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.optionText,
                selectedValue === option && styles.optionTextSelected,
              ]}
            >
              {getDisplayText(option)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
  },
  optionSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  optionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  optionTextSelected: {
    color: "#fff",
  },
  loadingText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
});

