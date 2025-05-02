import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { scheduleNotification } from '../../utils/notifications';
import { format } from 'date-fns';

interface Appointment {
  scheduleTime: string | number | Date;
  doctor: string;
  specialty: string;
  time: Date;
  location: string;
  address: string;
}

export default function AppointmentsScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [doctor, setDoctor] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [appointmentTime, setAppointmentTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Add previous month's days
    const firstDayOfWeek = firstDay.getDay();
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonthLastDay - i,
        currentMonth: false
      });
    }
    
    // Add current month's days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: i,
        currentMonth: true
      });
    }
    
    // Add next month's days
    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        days.push({
          date: i,
          currentMonth: false
        });
      }
    }
    
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const days = getDaysInMonth(currentDate);
  
//   const todaysMedicines = appointments.filter(med => {
//     const scheduleTime = new Date(med.scheduleTime);
//     return format(scheduleTime, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
//   });
//   useEffect(() => {
//     const checkMedicineReminder = setInterval(async () => {
//       const now = new Date();
//       const currentHours = now.getHours();
//       const currentMinutes = now.getMinutes();

//       todaysMedicines.forEach(async (medicine) => {
//         const scheduledTime = new Date(medicine.scheduleTime);
//         const scheduledHours = scheduledTime.getHours();
//         const scheduledMinutes = scheduledTime.getMinutes();

//         if (scheduledHours === currentHours && scheduledMinutes === currentMinutes) {
//           await scheduleNotification({
//             title: 'Appointment Reminder',
//             body: `Appointment with ${doctor} at ${location}`,
//             trigger: appointmentTime,
//           });
      
//         }
//       })

//     },60000)
//  return () => clearInterval(checkMedicineReminder);

//   }, [todaysMedicines])

useEffect(() => {
  const checkAndScheduleNotification = setInterval(async () => {
    if (appointments.length > 0) {
      const lastAppointment = appointments[appointments.length - 1];
      const appointmentTime = new Date(lastAppointment.time);
      const currentTime = new Date();

      const appointmentHours = appointmentTime.getHours();
      const appointmentMinutes = appointmentTime.getMinutes();
      const currentHours = currentTime.getHours();
      const currentMinutes = currentTime.getMinutes();

      console.log(
        `Checking: Appointment at ${appointmentHours}:${appointmentMinutes}, Current Time ${currentHours}:${currentMinutes}`
      );

      if (appointmentHours === currentHours && appointmentMinutes === currentMinutes) {
        await scheduleNotification({
          title: "🗓️Appointment Reminder:",
          body: `Appointment with ${lastAppointment.doctor} at ${lastAppointment.location}`,
          trigger: appointmentTime,
        });
        console.log("Notification Scheduled!");
      }
    }
  },60000);

  
  return () => clearInterval(checkAndScheduleNotification); // Cleanup on unmount
}, [appointments]);

  const [errors, setErrors] = useState({
    doctor: '',
    specialty: '',
    location: '',
    address: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      doctor: '',
      specialty: '',
      location: '',
      address: ''
    };

    if (!doctor.trim()) {
      newErrors.doctor = 'Doctor name is required';
      isValid = false;
    }

    if (!specialty.trim()) {
      newErrors.specialty = 'Specialty is required';
      isValid = false;
    }

    if (!location.trim()) {
      newErrors.location = 'Location is required';
      isValid = false;
    }

    if (!address.trim()) {
      newErrors.address = 'Address is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddAppointment = async () => {
    if (!validateForm()) return;

    const newAppointment: Appointment = {
      doctor,
      specialty,
      time: appointmentTime,
      location,
      address,
      scheduleTime: ''
    };

    await scheduleNotification({
      title: '🗓️Appointment Reminder:',
      body: `Appointment with ${doctor} has been scheduled at ${location}`,
      trigger: appointmentTime,
    });

    setAppointments([...appointments, newAppointment]);
    setModalVisible(false);
    resetForm();
  };

  const resetForm = () => {
    setDoctor('');
    setSpecialty('');
    setLocation('');
    setAddress('');
    setAppointmentTime(new Date());
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={handlePrevMonth}>
          <ChevronLeft size={24} color="#64748b" />
        </TouchableOpacity>
        <Text style={styles.monthText}>
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <ChevronRight size={24} color="#64748b" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysContainer}>
        {days.map((day, index) => {
          const isSelected = 
            day.currentMonth && 
            day.date === selectedDate.getDate() && 
            currentDate.getMonth() === selectedDate.getMonth() && 
            currentDate.getFullYear() === selectedDate.getFullYear();
          
          return (
            <TouchableOpacity 
              key={index} 
              style={[styles.dayItem, isSelected && styles.selectedDay]}
              onPress={() => {
                if (day.currentMonth) {
                  const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day.date);
                  setSelectedDate(newDate);
                }
              }}
            >
              <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][index % 7]}
              </Text>
              <Text 
                style={[
                  styles.dateText, 
                  isSelected && styles.selectedDayText,
                  !day.currentMonth && styles.inactiveText
                ]}
              >
                {day.date}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView style={styles.appointmentsList}>
        {appointments.map((appointment, index) => (
          <TouchableOpacity
            key={index}
            style={styles.appointmentCard}
            onLongPress={() => {
              setSelectedAppointment(appointment);
              setDeleteModalVisible(true);
            }}
          >
            <View style={styles.appointmentHeader}>
              <Text style={styles.doctorName}>{appointment.doctor}</Text>
              <Text style={styles.specialty}>{appointment.specialty}</Text>
            </View>
            <View style={styles.appointmentDetails}>
              <Text style={styles.time}>
                {appointment.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <Text style={styles.location}>{appointment.location}</Text>
              <Text style={styles.address}>{appointment.address}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
            <Text style={[styles.modalTitle, { fontSize: 20, fontWeight: '600', color: '#1e293b', marginBottom: 12, textAlign: 'center' }]}>Schedule Appointment</Text>
            
            <TextInput
              style={[styles.input, { marginBottom: 4, padding: 12, borderWidth: 1, borderColor: errors.doctor ? '#ef4444' : '#e2e8f0', borderRadius: 8 }]}
              placeholder="Doctor's Name"
              value={doctor}
              onChangeText={(text) => {
                setDoctor(text);
                setErrors(prev => ({ ...prev, doctor: '' }));
              }}
            />
            {errors.doctor ? <Text style={styles.errorText}>{errors.doctor}</Text> : null}

            <TextInput
              style={[styles.input, { marginBottom: 4, padding: 12, borderWidth: 1, borderColor: errors.specialty ? '#ef4444' : '#e2e8f0', borderRadius: 8, marginTop: 12 }]}
              placeholder="Specialty"
              value={specialty}
              onChangeText={(text) => {
                setSpecialty(text);
                setErrors(prev => ({ ...prev, specialty: '' }));
              }}
            />
            {errors.specialty ? <Text style={styles.errorText}>{errors.specialty}</Text> : null}

            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.timeButtonText}>
                Set Time: {appointmentTime.toLocaleTimeString()}
              </Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={appointmentTime}
                mode="time"
                is24Hour={false}
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);
                  if (selectedTime) {
                    setAppointmentTime(selectedTime);
                  }
                }}
              />
            )}

            <TextInput
              style={[styles.input, { marginBottom: 4, padding: 12, borderWidth: 1, borderColor: errors.location ? '#ef4444' : '#e2e8f0', borderRadius: 8, marginTop: 12 }]}
              placeholder="Location"
              value={location}
              onChangeText={(text) => {
                setLocation(text);
                setErrors(prev => ({ ...prev, location: '' }));
              }}
            />
            {errors.location ? <Text style={styles.errorText}>{errors.location}</Text> : null}

            <TextInput
              style={[styles.input, { marginBottom: 4, padding: 12, borderWidth: 1, borderColor: errors.address ? '#ef4444' : '#e2e8f0', borderRadius: 8, marginTop: 12 }]}
              placeholder="Address"
              value={address}
              onChangeText={(text) => {
                setAddress(text);
                setErrors(prev => ({ ...prev, address: '' }));
              }}
            />
            {errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.addButton]}
                onPress={handleAddAppointment}
              >
                <Text style={styles.addButtonText}>Schedule</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { padding: 24 }]}>
            <Text style={[styles.modalTitle, { marginBottom: 16 }]}>Delete Appointment</Text>
            <Text style={styles.deleteModalText}>
              Are you sure you want to delete this appointment with {selectedAppointment?.doctor}?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setDeleteModalVisible(false);
                  setSelectedAppointment(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#ef4444' }]}
                onPress={() => {
                  if (selectedAppointment) {
                    setAppointments(appointments.filter(apt => apt !== selectedAppointment));
                  }
                  setDeleteModalVisible(false);
                  setSelectedAppointment(null);
                }}
              >
                <Text style={styles.addButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  daysContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: '#e2e8f0',
  },
  dayItem: {
    width: 45,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    borderRadius: 12,
  },
  selectedDay: {
    backgroundColor: '#2563eb',
  },
  dayText: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  selectedDayText: {
    color: '#ffffff',
  },
  inactiveText: {
    color: '#94a3b8',
  },
  appointmentsList: {
    padding: 16,
  },
  appointmentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
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
  appointmentHeader: {
    marginBottom: 12,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    color: '#64748b',
  },
  appointmentDetails: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 12,
  },
  time: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2563eb',
    marginBottom: 4,
  },
  location: {
    fontSize: 15,
    color: '#334155',
    marginBottom: 2,
  },
  address: {
    fontSize: 14,
    color: '#64748b',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#0ea5e9',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
  deleteModalText: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 24,
  },
});