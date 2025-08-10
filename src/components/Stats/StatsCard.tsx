import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  label: string;
  value: string;
  unit: string;
  iconName: React.ComponentProps<typeof Ionicons>["name"];
  iconColor?: string;
}

const StatsCard: React.FC<Props> = ({
  label,
  value,
  unit,
  iconName,
  iconColor = "#2563eb",
}) => {
  return (
    <View style={styles.card}>
      <View
        style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}
      >
        <Ionicons name={iconName} size={22} color={iconColor} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
            {value}
          </Text>
          <Text style={styles.unit}> {unit}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#1f2937",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    flexBasis: "48.5%", // for 2-column layout with space
    marginBottom: 12,
  },
  iconContainer: {
    marginBottom: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 4,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  value: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f2937",
    flexShrink: 1,
  },
  unit: {
    fontSize: 14,
    color: "#4b5563",
    fontWeight: "600",
  },
});

export default StatsCard;
