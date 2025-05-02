import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView, Alert } from 'react-native';
import { CircleAlert as AlertCircle, Plus } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { scheduleNotification } from '../../utils/notifications';

interface InventoryItem {
  name: string;
  remaining: number;
  total: number;
  expiryDate: string;
  lowStock: boolean;
  dosage?: string;
  scheduleTime?: string;
}

export default function InventoryScreen() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [name, setName] = useState('');
  const [total, setTotal] = useState('');
  const [remaining, setRemaining] = useState('');
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [dosage, setDosage] = useState('');
  const [scheduleTime, setScheduleTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [includeReminder, setIncludeReminder] = useState(false);

  const stats = {
    lowStock: inventory.filter(item => item.lowStock).length,
    expiringSoon: inventory.filter(item => {
      const expiry = new Date(item.expiryDate);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return expiry <= thirtyDaysFromNow;
    }).length,
    totalItems: inventory.length,
  };

  const [errors, setErrors] = useState({
    name: '',
    total: '',
    remaining: '',
    expiryDate: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      total: '',
      remaining: '',
      expiryDate: ''
    };

    if (!name.trim()) {
      newErrors.name = 'Medicine name is required';
      isValid = false;
    }

    if (!total.trim()) {
      newErrors.total = 'Total quantity is required';
      isValid = false;
    } else if (isNaN(parseInt(total))) {
      newErrors.total = 'Total must be a valid number';
      isValid = false;
    }

    if (!remaining.trim()) {
      newErrors.remaining = 'Remaining quantity is required';
      isValid = false;
    } else if (isNaN(parseInt(remaining))) {
      newErrors.remaining = 'Remaining must be a valid number';
      isValid = false;
    } else if (parseInt(remaining) > parseInt(total)) {
      newErrors.remaining = 'Remaining cannot be greater than total';
      isValid = false;
    }

    if (!expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
      isValid = false;
    } else {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const selectedDate = new Date(expiryDate);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate < currentDate) {
        newErrors.expiryDate = 'Expiry date cannot be in the past';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddItem = async () => {
    if (!validateForm()) return;

    const newItem: InventoryItem = {
      name,
      total: parseInt(total),
      remaining: parseInt(remaining),
      expiryDate: expiryDate.toISOString(),
      lowStock: parseInt(remaining) <= 2,
      ...(includeReminder && {
        dosage,
        scheduleTime: scheduleTime.toISOString(),
      }),
    };

    if (includeReminder && dosage) {
      await scheduleNotification({
        title: 'Medicine Reminder',
        body: `Time to take ${name} - ${dosage}`,
        trigger: scheduleTime,
      });
    }

    setInventory([...inventory, newItem]);
    setModalVisible(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setTotal('');
    setRemaining('');
    setExpiryDate(new Date());
    setDosage('');
    setScheduleTime(new Date());
    setIncludeReminder(false);
  };

  const handleDeleteItem = () => {
    if (selectedItem) {
      const updatedInventory = inventory.filter(item => item !== selectedItem);
      setInventory(updatedInventory);
      setDeleteModalVisible(false);
      setSelectedItem(null);
    }
  };

  const handleLongPress = (item: InventoryItem) => {
    setSelectedItem(item);
    setDeleteModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.lowStock}</Text>
          <Text style={styles.statLabel}>Low Stock</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.expiringSoon}</Text>
          <Text style={styles.statLabel}>Expiring Soon</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalItems}</Text>
          <Text style={styles.statLabel}>Total Items</Text>
        </View>
      </View>

      <ScrollView style={styles.inventoryList}>
        {inventory.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.inventoryItem}
            onLongPress={() => handleLongPress(item)}
            delayLongPress={500}>
            <View style={styles.medicineIcon}>
              <Text style={styles.medicineIconText}>💊</Text>
            </View>
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <View style={styles.progressContainer}>
                <View 
                  style={[
                    styles.progressBar,
                    { width: `${(item.remaining / item.total) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.itemCount}>
                {item.remaining} of {item.total} remaining
              </Text>
              {item.dosage && (
                <Text style={styles.dosageText}>
                  Dosage: {item.dosage}
                </Text>
              )}
            </View>
            {item.lowStock && (
              <AlertCircle size={20} color="#ef4444" style={styles.alertIcon} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: 'white', borderRadius: 20, width: '80%', maxWidth: 400, alignSelf: 'center', padding: 24 }]}>
            <Text style={[styles.modalTitle, { fontSize: 20, fontWeight: '600', color: '#1e293b', marginBottom: 12, textAlign: 'center' }]}>Delete Item</Text>
            <Text style={[styles.deleteModalText, { fontSize: 16, color: '#4b5563', textAlign: 'center', marginBottom: 24 }]}>
              Are you sure you want to delete {selectedItem?.name}?
            </Text>
            <View style={[styles.modalButtons, { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }]}>
              <TouchableOpacity
                style={[styles.button, { flex: 1, padding: 12, borderRadius: 8, marginHorizontal: 8, backgroundColor: '#f3f4f6' }]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={[styles.cancelButtonText, { color: '#1f2937', textAlign: 'center', fontSize: 16, fontWeight: '600' }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { flex: 1, padding: 12, borderRadius: 8, marginHorizontal: 8, backgroundColor: '#ef4444' }]}
                onPress={handleDeleteItem}
              >
                <Text style={[styles.addButtonText, { color: 'white', textAlign: 'center', fontSize: 16, fontWeight: '600' }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Plus color="white" size={24} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={styles.modalScroll}>
            <View style={[styles.modalContent, { backgroundColor: 'white', borderRadius: 20, width: '80%', maxWidth: 400, alignSelf: 'center', padding: 24 }]}>
              <Text style={[styles.modalTitle, { fontSize: 20, fontWeight: '600', color: '#1e293b', marginBottom: 12, textAlign: 'center' }]}>Add New Medicine</Text>
              
              <TextInput
                style={[styles.input, { marginBottom: 4, padding: 12, borderWidth: 1, borderColor: errors.name ? '#ef4444' : '#e2e8f0', borderRadius: 8 }]}
                placeholder="Medicine Name"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setErrors(prev => ({ ...prev, name: '' }));
                }}
              />
              {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

              <TextInput
                style={[styles.input, { marginBottom: 4, padding: 12, borderWidth: 1, borderColor: errors.total ? '#ef4444' : '#e2e8f0', borderRadius: 8, marginTop: 12 }]}
                placeholder="Total Quantity"
                value={total}
                onChangeText={(text) => {
                  setTotal(text);
                  setErrors(prev => ({ ...prev, total: '' }));
                }}
                keyboardType="numeric"
              />
              {errors.total ? <Text style={styles.errorText}>{errors.total}</Text> : null}

              <TextInput
                style={[styles.input, { marginBottom: 4, padding: 12, borderWidth: 1, borderColor: errors.remaining ? '#ef4444' : '#e2e8f0', borderRadius: 8, marginTop: 12 }]}
                placeholder="Remaining Quantity"
                value={remaining}
                onChangeText={(text) => {
                  setRemaining(text);
                  setErrors(prev => ({ ...prev, remaining: '' }));
                }}
                keyboardType="numeric"
              />
              {errors.remaining ? <Text style={styles.errorText}>{errors.remaining}</Text> : null}

              <TouchableOpacity
                style={[styles.timeButton, { backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, marginBottom: 16 }]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={[styles.timeButtonText, { color: '#0ea5e9', textAlign: 'center' }]}>
                  Set Expiry Date: {expiryDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={expiryDate}
                  mode="date"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      setExpiryDate(selectedDate);
                    }
                  }}
                />
              )}

              <TouchableOpacity
                style={styles.reminderToggle}
                onPress={() => setIncludeReminder(!includeReminder)}
              >
                <View style={[styles.checkbox, includeReminder && styles.checkboxChecked]} />
                <Text style={styles.reminderToggleText}>Add Reminder</Text>
              </TouchableOpacity>

              {includeReminder && (
                <>
                  <TextInput
                    style={[styles.input, { marginBottom: 16, padding: 12, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8 }]}
                    placeholder="Dosage (e.g., 1 tablet)"
                    value={dosage}
                    onChangeText={setDosage}
                  />

                  <TouchableOpacity
                    style={[styles.timeButton, { backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, marginBottom: 16 }]}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Text style={[styles.timeButtonText, { color: '#0ea5e9', textAlign: 'center' }]}>
                      Set Reminder Time: {scheduleTime.toLocaleTimeString()}
                    </Text>
                  </TouchableOpacity>

                  {showTimePicker && (
                    <DateTimePicker
                      value={scheduleTime}
                      mode="time"
                      is24Hour={false}
                      onChange={(event, selectedTime) => {
                        setShowTimePicker(false);
                        if (selectedTime) {
                          setScheduleTime(selectedTime);
                        }
                      }}
                    />
                  )}
                </>
              )}

            <View style={[styles.modalButtons, { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }]}>
              <TouchableOpacity
                style={[styles.button, { flex: 1, padding: 12, borderRadius: 8, marginHorizontal: 8, backgroundColor: '#f3f4f6' }]}
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
              >
                <Text style={[styles.cancelButtonText, { color: '#1f2937', textAlign: 'center', fontSize: 16, fontWeight: '600' }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { flex: 1, padding: 12, borderRadius: 8, marginHorizontal: 8, backgroundColor: '#2563eb' }]}
                onPress={handleAddItem}
              >
                <Text style={[styles.addButtonText, { color: 'white', textAlign: 'center', fontSize: 16, fontWeight: '600' }]}>Add Item</Text>
              </TouchableOpacity>
            </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginLeft: 4,
  },
  deleteModalContent: {
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 20,
    width: '80%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
  },
  deleteModalText: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 24,
    textAlign: 'center',
  },
  deleteModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  inventoryList: {
    flex: 1,
  },
  inventoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  medicineIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  medicineIconText: {
    fontSize: 24,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 8,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 2,
  },
  itemCount: {
    fontSize: 12,
    color: '#64748b',
  },
  dosageText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  alertIcon: {
    marginLeft: 12,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#2563eb',
    width: 56,
    height: 56,
    borderRadius: 28,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: '33%',
  },
  modalScroll: {
    width: '100%',
    maxHeight: '80%',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignSelf: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  timeButton: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  timeButtonText: {
    fontSize: 16,
    color: '#1f2937',
    textAlign: 'center',
  },
  reminderToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#2563eb',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#2563eb',
  },
  reminderToggleText: {
    fontSize: 16,
    color: '#1f2937',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  addButton: {
    backgroundColor: '#2563eb',
  },
  cancelButtonText: {
    color: '#1f2937',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  addButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});