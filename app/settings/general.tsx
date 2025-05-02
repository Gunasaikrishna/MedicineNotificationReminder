import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

export default function GeneralSettings() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [useMetricSystem, setUseMetricSystem] = React.useState(true);
  const [use24HourTime, setUse24HourTime] = React.useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>General Settings</Text>

      <View style={styles.section}>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
            thumbColor={isDarkMode ? '#2563eb' : '#f1f5f9'}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Use Metric System</Text>
          <Switch
            value={useMetricSystem}
            onValueChange={setUseMetricSystem}
            trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
            thumbColor={useMetricSystem ? '#2563eb' : '#f1f5f9'}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>24-Hour Time</Text>
          <Switch
            value={use24HourTime}
            onValueChange={setUse24HourTime}
            trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
            thumbColor={use24HourTime ? '#2563eb' : '#f1f5f9'}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 24,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingLabel: {
    fontSize: 16,
    color: '#334155',
  },
});