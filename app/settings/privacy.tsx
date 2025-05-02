import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';

export default function PrivacySettings() {
  const [biometricAuth, setBiometricAuth] = React.useState(false);
  const [hideDetails, setHideDetails] = React.useState(false);
  const [locationTracking, setLocationTracking] = React.useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Privacy & Security</Text>

      <View style={styles.section}>
        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingLabel}>Biometric Authentication</Text>
            <Text style={styles.settingDescription}>
              Use fingerprint or face ID to access the app
            </Text>
          </View>
          <Switch
            value={biometricAuth}
            onValueChange={setBiometricAuth}
            trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
            thumbColor={biometricAuth ? '#2563eb' : '#f1f5f9'}
          />
        </View>

        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingLabel}>Hide Medicine Details</Text>
            <Text style={styles.settingDescription}>
              Hide sensitive information in notifications
            </Text>
          </View>
          <Switch
            value={hideDetails}
            onValueChange={setHideDetails}
            trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
            thumbColor={hideDetails ? '#2563eb' : '#f1f5f9'}
          />
        </View>

        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingLabel}>Location Services</Text>
            <Text style={styles.settingDescription}>
              Allow app to access location for nearby pharmacies
            </Text>
          </View>
          <Switch
            value={locationTracking}
            onValueChange={setLocationTracking}
            trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
            thumbColor={locationTracking ? '#2563eb' : '#f1f5f9'}
          />
        </View>
      </View>

      <View style={styles.dangerSection}>
        <TouchableOpacity style={styles.dangerButton}>
          <Text style={styles.dangerButtonText}>Delete All Data</Text>
        </TouchableOpacity>
        <Text style={styles.dangerDescription}>
          This action cannot be undone. All your data will be permanently deleted.
        </Text>
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
    marginBottom: 24,
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
  dangerSection: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
  },
  dangerButton: {
    backgroundColor: '#ef4444',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  dangerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  dangerDescription: {
    fontSize: 14,
    color: '#ef4444',
    textAlign: 'center',
  },
});