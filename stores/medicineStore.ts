import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Medicine {
  name: string;
  dosage: string;
  scheduleTime: string;
}

interface MedicineStore {
  medicines: Medicine[];
  addMedicine: (medicine: Medicine) => void;
  removeMedicine: (index: number) => void;
  loadMedicines: () => Promise<void>;
}

export const useMedicineStore = create<MedicineStore>((set) => ({
  medicines: [],
  addMedicine: (medicine) => {
    set((state) => {
      const newMedicines = [...state.medicines, medicine];
      AsyncStorage.setItem('medicines', JSON.stringify(newMedicines));
      return { medicines: newMedicines };
    });
  },
  removeMedicine: (index) => {
    set((state) => {
      const newMedicines = state.medicines.filter((_, i) => i !== index);
      AsyncStorage.setItem('medicines', JSON.stringify(newMedicines));
      return { medicines: newMedicines };
    });
  },
  loadMedicines: async () => {
    try {
      const stored = await AsyncStorage.getItem('medicines');
      if (stored) {
        set({ medicines: JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Error loading medicines:', error);
    }
  },
}));