import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

export default function TrackingScreen() {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
        strokeWidth: 2
      }
    ]
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Performance Tracking</Text>
      <View style={styles.chartContainer}>
        <LineChart
          data={data}
          width={Dimensions.get('window').width - 32}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>85%</Text>
          <Text style={styles.statLabel}>Efficiency</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>92%</Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>78%</Text>
          <Text style={styles.statLabel}>Progress</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 24
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  chart: {
    marginVertical: 8,
    borderRadius: 12
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24
  },
  statBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2563eb',
    marginBottom: 4
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b'
  }
});