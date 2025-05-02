import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useMedicineStore } from '../../stores/medicineStore';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import { scheduleNotification } from '../../utils/notifications';

export default function HomeScreen() {
  const { medicines, addMedicine, removeMedicine } = useMedicineStore();
  const today = new Date();
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [scheduleTime, setScheduleTime] = useState(new Date());

  const todaysMedicines = medicines.filter(med => {
    const scheduleTime = new Date(med.scheduleTime);
    return format(scheduleTime, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  });


  // Function to check and send notifications
  useEffect(() => {
    const checkMedicineReminder = setInterval(async () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();

      todaysMedicines.forEach(async (medicine) => {
        const scheduledTime = new Date(medicine.scheduleTime);
        const scheduledHours = scheduledTime.getHours();
        const scheduledMinutes = scheduledTime.getMinutes();

        if (scheduledHours === currentHours && scheduledMinutes === currentMinutes) {
          await scheduleNotification({
            title: 'Medicine Reminder',
            body: `Time to take ${name} -${dosage}`,
            trigger: scheduleTime,
          });
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(checkMedicineReminder);
  }, [todaysMedicines]);

  const [errors, setErrors] = useState({
    name: '',
    dosage: '',
    scheduleTime: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      dosage: '',
      scheduleTime: ''
    };

    if (!name.trim()) {
      newErrors.name = 'Medicine name is required';
      isValid = false;
    }

    if (!dosage.trim()) {
      newErrors.dosage = 'Dosage is required';
      isValid = false;
    }

    if (!scheduleTime) {
      newErrors.scheduleTime = 'Schedule time is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddMedicine = async () => {
    if (!validateForm()) return;

    const medicine = {
      name: name.trim(),
      dosage: dosage.trim(),
      scheduleTime: scheduleTime.toISOString(),
    };

    await scheduleNotification({
      title: '💊Medicine Reminder:',
      body: `${name} -${dosage} dosage has been scheduled`,
      trigger: scheduleTime,
    });
  
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    
    // Ensure scheduleTime is a Date object
    const scheduledTime = new Date(scheduleTime);
    
    const scheduledHours = scheduledTime.getHours();
    const scheduledMinutes = scheduledTime.getMinutes();
    

  // Extract hours and minutes from scheduleTime (expected format "HH:mm")

  if (scheduledHours === currentHours && scheduledMinutes === currentMinutes) {
  
    await scheduleNotification({
      title: '💊Medicine Reminder:',
      body: `Time to take ${name} - ${dosage}`,
      trigger: scheduleTime,
    });
  }
    addMedicine(medicine);
    setModalVisible(false);
    setName('');
    setDosage('');
    setScheduleTime(new Date());
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Today's Medicines</Text>
          <Text style={styles.date}>{format(today, 'MMMM d, yyyy')}</Text>
        </View>

        {todaysMedicines.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No medicines scheduled for today</Text>
          </View>
        ) : (
          todaysMedicines.map((medicine, index) => (
            <TouchableOpacity
              key={index}
              style={styles.medicineCard}
              onLongPress={() => {
                Alert.alert(
                  'Delete Medicine',
                  `Are you sure you want to delete ${medicine.name}?`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Delete', 
                      style: 'destructive',
                      onPress: () => removeMedicine(index)
                    }
                  ]
                );
              }}
            >
              <Text style={styles.medicineName}>{medicine.name}</Text>
              <Text style={styles.medicineTime}>
                {format(new Date(medicine.scheduleTime), 'h:mm a')}
              </Text>
              <Text style={styles.medicineDosage}>{medicine.dosage}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

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
              style={[styles.input, { marginBottom: 4, padding: 12, borderWidth: 1, borderColor: errors.dosage ? '#ef4444' : '#e2e8f0', borderRadius: 8, marginTop: 12 }]}
              placeholder="Dosage (e.g., 1 tablet)"
              value={dosage}
              onChangeText={(text) => {
                setDosage(text);
                setErrors(prev => ({ ...prev, dosage: '' }));
              }}
            />
            {errors.dosage ? <Text style={styles.errorText}>{errors.dosage}</Text> : null}

            <TouchableOpacity
              style={[styles.timeButton, { backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, marginBottom: 16 }]}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={[styles.timeButtonText, { color: '#0ea5e9', textAlign: 'center' }]}>
                Set Time: {scheduleTime.toLocaleTimeString()}
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

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.addButton]}
                onPress={handleAddMedicine}
              >
                <Text style={styles.addButtonText}>Add Medicine</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  date: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  medicineCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  medicineName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  medicineTime: {
    fontSize: 16,
    color: '#2563eb',
    marginTop: 4,
  },
  medicineDosage: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
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
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
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
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginLeft: 4,
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
    fontSize: 15,
    fontWeight: '600',
  },
});