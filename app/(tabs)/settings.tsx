import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Settings, Bell, Shield, CircleHelp as HelpCircle, LogOut, Camera } from 'lucide-react-native';
import { pickImage, takePhoto } from '../../utils/imagePicker';
import { Link, useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop');

  const handleChangeProfilePicture = () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            const result = await takePhoto();
            if (result) setProfileImage(result);
          },
        },
        {
          text: 'Choose from Library',
          onPress: async () => {
            const result = await pickImage();
            if (result) setProfileImage(result);
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };
  const menuItems = [
    {
      icon: Settings,
      title: 'Settings',
      route: '/settings/general',
    },
    {
      icon: Bell,
      title: 'Notifications',
      route: '/settings/notifications',
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      route: '/settings/privacy',
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      route: '/settings/help',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: profileImage }}
            style={styles.avatar}
          />
          <TouchableOpacity
            style={styles.changePhotoButton}
            onPress={handleChangeProfilePicture}
          >
            <Camera size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>User Name</Text>
        <Text style={styles.email}>user@example.com</Text>
      </View>

      <View style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <Link href={item.route as '/settings/general' | '/settings/notifications' | '/settings/privacy' | '/settings/help'} key={index} asChild>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemContent}>
                <item.icon size={24} color="#475569" />
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <Text style={styles.menuItemArrow}>›</Text>
            </TouchableOpacity>
          </Link>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={() => {
          // Navigate to signin screen
          router.replace('/auth/signin');
        }}
      >
        <LogOut size={20} color="#ef4444" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  profileSection: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  changePhotoButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#2563eb',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#64748b',
  },
  menuSection: {
    backgroundColor: '#ffffff',
    marginTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#334155',
    marginLeft: 12,
  },
  menuItemArrow: {
    fontSize: 20,
    color: '#94a3b8',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});