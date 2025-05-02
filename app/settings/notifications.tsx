import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

export default function NotificationSettings() {
  const [medicineReminders, setMedicineReminders] = React.useState(true);
  const [appointmentReminders, setAppointmentReminders] = React.useState(true);
  const [lowStockAlerts, setLowStockAlerts] = React.useState(true);
  const [expiryAlerts, setExpiryAlerts] = React.useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Settings</Text>

      <View style={styles.section}>
        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingLabel}>Medicine Reminders</Text>
            <Text style={styles.settingDescription}>
              Get notified when it's time to take your medicine
            </Text>
          </View>
          <Switch
            value={medicineReminders}
            onValueChange={setMedicineReminders}
            trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
            thumbColor={medicineReminders ? '#2563eb' : '#f1f5f9'}
          />
        </View>

        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingLabel}>Appointment Reminders</Text>
            <Text style={styles.settingDescription}>
              Get notified about upcoming appointments
            </Text>
          </View>
          <Switch
            value={appointmentReminders}
            onValueChange={setAppointmentReminders}
            trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
            thumbColor={appointmentReminders ? '#2563eb' : '#f1f5f9'}
          />
        </View>

        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingLabel}>Low Stock Alerts</Text>
            <Text style={styles.settingDescription}>
              Get notified when medicine stock is running low
            </Text>
          </View>
          <Switch
            value={lowStockAlerts}
            onValueChange={setLowStockAlerts}
            trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
            thumbColor={lowStockAlerts ? '#2563eb' : '#f1f5f9'}
          />
        </View>

        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingLabel}>Expiry Alerts</Text>
            <Text style={styles.settingDescription}>
              Get notified when medicines are about to expire
            </Text>
          </View>
          <Switch
            value={expiryAlerts}
            onValueChange={setExpiryAlerts}
            trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
            thumbColor={expiryAlerts ? '#2563eb' : '#f1f5f9'}
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
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#64748b',
    maxWidth: '80%',
  },
});