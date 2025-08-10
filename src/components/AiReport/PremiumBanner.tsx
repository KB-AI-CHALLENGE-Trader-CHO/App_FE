import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PremiumBanner = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="diamond-outline" size={28} color="#FFCC00" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>프리미엄 플랜으로 업그레이드</Text>
        <Text style={styles.description}>
          일일/월간 상세 리포트와 고급 분석 기능을 모두 이용해보세요.
        </Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          /* 구독 화면으로 이동 */
        }}
      >
        <Text style={styles.buttonText}>자세히 보기</Text>
        <Ionicons name="arrow-forward" size={16} color="#000000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginVertical: 20,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    lineHeight: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFCC00",
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  buttonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PremiumBanner;
