import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

export default function HelpAndSupport() {
  const helpSections = [
    {
      title: 'Getting Started',
      items: [
        'How to add medicines',
        'Setting up reminders',
        'Managing appointments',
        'Tracking inventory',
      ],
    },
    {
      title: 'Frequently Asked Questions',
      items: [
        'How to change notification settings',
        'Updating medicine schedule',
        'Data backup and security',
        'Sharing data with healthcare providers',
      ],
    },
    {
      title: 'Contact Support',
      items: [
        'Email support',
        'Live chat',
        'Report a bug',
        'Feature request',
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {helpSections.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map((item, itemIndex) => (
            <TouchableOpacity key={itemIndex} style={styles.helpItem}>
              <Text style={styles.helpItemText}>{item}</Text>
              <ChevronRight size={20} color="#64748b" />
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <View style={styles.versionInfo}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
        <TouchableOpacity>
          <Text style={styles.updateText}>Check for Updates</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 24,
    paddingTop: 55,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  helpItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  helpItemText: {
    fontSize: 16,
    color: '#334155',
  },
  versionInfo: {
    alignItems: 'center',
    padding: 16,
    marginTop: 8,
  },
  versionText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  updateText: {
    fontSize: 14,
    color: '#2563eb',
    textDecorationLine: 'underline',
  },
});