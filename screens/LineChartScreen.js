import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { LineChart, Grid, YAxis, XAxis } from "react-native-svg-charts";
import * as shape from "d3-shape";

const FILTERS = ["12M", "6M", "30D", "7D"];

const dummyChartData = {
  "12M": [
    { month: "Jan", normal: 3, risky: 1 },
    { month: "Feb", normal: 4, risky: 2 },
    { month: "Mar", normal: 2, risky: 1 },
    { month: "Apr", normal: 5, risky: 2 },
    { month: "May", normal: 6, risky: 3 },
    { month: "Jun", normal: 4, risky: 2 },
    { month: "Jul", normal: 5, risky: 2 },
    { month: "Aug", normal: 6, risky: 3 },
    { month: "Sep", normal: 5, risky: 2 },
    { month: "Oct", normal: 6, risky: 2 },
    { month: "Nov", normal: 7, risky: 3 },
    { month: "Dec", normal: 8, risky: 2 },
  ],
  "6M": [
    { month: "Jul", normal: 5, risky: 2 },
    { month: "Aug", normal: 6, risky: 3 },
    { month: "Sep", normal: 5, risky: 2 },
    { month: "Oct", normal: 6, risky: 2 },
    { month: "Nov", normal: 7, risky: 3 },
    { month: "Dec", normal: 8, risky: 2 },
  ],
  "30D": [
    { month: "W1", normal: 5, risky: 2 },
    { month: "W2", normal: 6, risky: 3 },
    { month: "W3", normal: 5, risky: 2 },
    { month: "W4", normal: 6, risky: 1 },
  ],
  "7D": [
    { month: "Mon", normal: 1, risky: 0 },
    { month: "Tue", normal: 2, risky: 1 },
    { month: "Wed", normal: 3, risky: 0 },
    { month: "Thu", normal: 2, risky: 1 },
    { month: "Fri", normal: 4, risky: 2 },
    { month: "Sat", normal: 3, risky: 1 },
    { month: "Sun", normal: 5, risky: 1 },
  ],
};

export default function LineChartScreen() {
  const [selectedFilter, setSelectedFilter] = useState("12M");

  const data = dummyChartData[selectedFilter];
  const normalData = data.map(item => item.normal);
  const riskyData = data.map(item => item.risky);
  const months = data.map(item => item.month);

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <View style={styles.filterContainer}>
        {FILTERS.map(filter => (
          <TouchableOpacity
            key={filter}
            onPress={() => setSelectedFilter(filter)}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.selectedFilter,
            ]}
          >
            <Text style={{ color: selectedFilter === filter ? "#fff" : "#000" }}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 220, flexDirection: "row" }}>
        <YAxis
          data={[...normalData, ...riskyData]}
          contentInset={{ top: 20, bottom: 20 }}
          svg={{ fontSize: 10, fill: "grey" }}
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <LineChart
            style={{ flex: 1 }}
            data={normalData}
            svg={{ stroke: "blue" }}
            contentInset={{ top: 20, bottom: 20 }}
            curve={shape.curveNatural}
          >
            <Grid />
          </LineChart>

          <LineChart
            style={StyleSheet.absoluteFill}
            data={riskyData}
            svg={{ stroke: "red" }}
            contentInset={{ top: 20, bottom: 20 }}
            curve={shape.curveNatural}
          />

          <XAxis
            style={{ marginTop: 10 }}
            data={months}
            formatLabel={(value, index) => months[index]}
            contentInset={{ left: 20, right: 20 }}
            svg={{ fontSize: 10, fill: "grey" }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  selectedFilter: {
    backgroundColor: "#333",
  },
});
