import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { STRINGS } from "@/constants/strings";
import { TicketAmount, WinningAmount } from "@/src/types/amounts";
import { getTicketAmounts, getWinningAmounts } from "@/services/amountsService";

type TabType = "ticket" | "winning";

interface TicketAmountListItem {
  digit: 3 | 2 | 1;
  amount?: TicketAmount;
}

interface WinningAmountListItem {
  digit: 3 | 2 | 1;
  position: 1 | 2 | 3 | 4 | 5 | 6;
  label?: "super" | "box";
  amount?: WinningAmount;
}

export default function AmountsSettingsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("ticket");
  const [ticketAmounts, setTicketAmounts] = useState<TicketAmount[]>([]);
  const [winningAmounts, setWinningAmounts] = useState<WinningAmount[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAmounts();
  }, []);

  const loadAmounts = async () => {
    try {
      const [ticketData, winningData] = await Promise.all([
        getTicketAmounts(),
        getWinningAmounts(),
      ]);
      setTicketAmounts(ticketData);
      setWinningAmounts(winningData);
    } catch (error) {
      Alert.alert("Error", "Failed to load amounts");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadAmounts();
  };

  const getTicketAmount = (digit: number): TicketAmount | undefined => {
    return ticketAmounts.find((a) => a.digit === digit);
  };

  const getWinningAmount = (
    digit: number,
    position: number,
    label?: "super" | "box"
  ): WinningAmount | undefined => {
    return winningAmounts.find((a) => {
      const matchesDigit = a.digit === digit;
      const matchesPosition = a.position === position;
      // For digits 1 and 2, label should be null/undefined; for digit 3, match the label
      const matchesLabel = digit === 3 
        ? a.label === label
        : (a.label === null || a.label === undefined);
      return matchesDigit && matchesPosition && matchesLabel;
    });
  };

  const handleTicketAmountPress = (digit: 3 | 2 | 1) => {
    router.push(`/settings/amounts/ticket/${digit}` as any);
  };

  const handleWinningAmountPress = (
    digit: 3 | 2 | 1,
    position: 1 | 2 | 3 | 4 | 5 | 6,
    label?: "super" | "box"
  ) => {
    const params: any = { digit: digit.toString(), position: position.toString() };
    if (label) {
      params.label = label;
    }
    router.push({
      pathname: `/settings/amounts/winning/[digit]/[position]` as any,
      params,
    });
  };

  // Prepare ticket amounts list
  const ticketAmountsList: TicketAmountListItem[] = [
    { digit: 3, amount: getTicketAmount(3) },
    { digit: 2, amount: getTicketAmount(2) },
    { digit: 1, amount: getTicketAmount(1) },
  ];

  // Prepare winning amounts list
  const winningAmountsList: WinningAmountListItem[] = [
    // Digit 1
    { digit: 1, position: 1, amount: getWinningAmount(1, 1) },
    // Digit 2
    { digit: 2, position: 1, amount: getWinningAmount(2, 1) },
    // Digit 3 - Super
    ...([1, 2, 3, 4, 5, 6] as const).map((position) => ({
      digit: 3 as const,
      position: position as 1 | 2 | 3 | 4 | 5 | 6,
      label: "super" as const,
      amount: getWinningAmount(3, position, "super"),
    })),
    // Digit 3 - Box
    ...([1, 2, 3, 4, 5, 6] as const).map((position) => ({
      digit: 3 as const,
      position: position as 1 | 2 | 3 | 4 | 5 | 6,
      label: "box" as const,
      amount: getWinningAmount(3, position, "box"),
    })),
  ];

  const renderTicketAmountItem = ({ item }: { item: TicketAmountListItem }) => {
    const hasAmount = !!item.amount;
    const displayText = `${STRINGS.AMOUNTS_SETTINGS.DIGIT} ${item.digit}`;
    const subText = hasAmount
      ? `DC: ${item.amount.dcAmount} | Amount: ${item.amount.amount}`
      : "Not configured";

    return (
      <TouchableOpacity
        style={styles.listItem}
        onPress={() => handleTicketAmountPress(item.digit)}
        activeOpacity={0.7}
      >
        <View style={styles.listItemContent}>
          <Text style={styles.listItemTitle}>{displayText}</Text>
          <Text style={[styles.listItemSubtitle, !hasAmount && styles.listItemSubtitleEmpty]}>
            {subText}
          </Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
    );
  };

  const renderWinningAmountItem = ({ item }: { item: WinningAmountListItem }) => {
    const hasAmount = !!item.amount;
    let displayText = `${STRINGS.AMOUNTS_SETTINGS.DIGIT} ${item.digit}`;
    if (item.digit === 3) {
      displayText += ` - ${item.label?.toUpperCase()} - ${STRINGS.AMOUNTS_SETTINGS.POSITION} ${item.position}`;
    } else {
      displayText += ` - ${STRINGS.AMOUNTS_SETTINGS.POSITION} ${item.position}`;
    }
    const subText = hasAmount
      ? `DC: ${item.amount.dcAmount} | Amount: ${item.amount.amount}`
      : "Not configured";

    return (
      <TouchableOpacity
        style={styles.listItem}
        onPress={() => handleWinningAmountPress(item.digit, item.position, item.label)}
        activeOpacity={0.7}
      >
        <View style={styles.listItemContent}>
          <Text style={styles.listItemTitle}>{displayText}</Text>
          <Text style={[styles.listItemSubtitle, !hasAmount && styles.listItemSubtitleEmpty]}>
            {subText}
          </Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
    );
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
        <Text style={styles.title}>{STRINGS.AMOUNTS_SETTINGS.TITLE}</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "ticket" && styles.activeTab]}
          onPress={() => setActiveTab("ticket")}
        >
          <Text style={[styles.tabText, activeTab === "ticket" && styles.activeTabText]}>
            {STRINGS.AMOUNTS_SETTINGS.TICKET_AMOUNTS}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "winning" && styles.activeTab]}
          onPress={() => setActiveTab("winning")}
        >
          <Text style={[styles.tabText, activeTab === "winning" && styles.activeTabText]}>
            {STRINGS.AMOUNTS_SETTINGS.WINNING_AMOUNTS}
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "ticket" ? (
        <FlatList
          data={ticketAmountsList}
          renderItem={renderTicketAmountItem}
          keyExtractor={(item) => `ticket-${item.digit}`}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <FlatList
          data={winningAmountsList}
          renderItem={renderWinningAmountItem}
          keyExtractor={(item, index) =>
            `winning-${item.digit}-${item.position}-${item.label || "none"}-${index}`
          }
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          contentContainerStyle={styles.listContent}
        />
      )}
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
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#007AFF",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  activeTabText: {
    color: "#fff",
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  listItemSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  listItemSubtitleEmpty: {
    color: "#999",
    fontStyle: "italic",
  },
  arrow: {
    fontSize: 24,
    color: "#999",
    marginLeft: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
