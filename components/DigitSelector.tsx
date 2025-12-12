import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { STRINGS } from "@/constants/strings";

export type DigitOption = "all" | 3 | 2 | 1;

interface DigitSelectorProps {
  /**
   * Currently selected digit value
   * "all" | 3 | 2 | 1
   */
  selectedValue: DigitOption;

  /**
   * Callback when digit is selected
   */
  onSelect: (value: DigitOption) => void;

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

export default function DigitSelector({
  selectedValue,
  onSelect,
  showAll = true,
  label,
}: DigitSelectorProps) {
  const options: DigitOption[] = showAll ? ["all", 3, 2, 1] : [3, 2, 1];

  const getDisplayText = (value: DigitOption): string => {
    if (value === "all") return STRINGS.COMPONENTS.ALL;
    return value.toString();
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
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
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    minWidth: 60,
    alignItems: "center",
  },
  optionSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  optionTextSelected: {
    color: "#fff",
  },
});

