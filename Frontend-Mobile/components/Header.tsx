import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ApiService } from '../utils/api';

interface HeaderProps {
  apiUrl: string;
  onApiUrlChange: (url: string) => void;
}

export default function Header({ apiUrl, onApiUrlChange }: HeaderProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempUrl, setTempUrl] = useState(apiUrl);
  const [testing, setTesting] = useState(false);

  const testConnection = async () => {
    if (!tempUrl.trim()) {
      Alert.alert('Error', 'Please enter a valid API URL');
      return;
    }

    setTesting(true);
    try {
      const apiService = new ApiService(tempUrl);
      const isConnected = await apiService.testConnection();
      
      if (isConnected) {
        Alert.alert('Success', 'Connection successful!');
        onApiUrlChange(tempUrl);
        setModalVisible(false);
      } else {
        Alert.alert('Error', 'Failed to connect to the server. Please check the URL and try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Connection failed. Please check your network and try again.');
    } finally {
      setTesting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manga Colorizer</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => {
            setTempUrl(apiUrl);
            setModalVisible(true);
          }}
        >
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>API Settings</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>API URL:</Text>
              <TextInput
                style={styles.input}
                value={tempUrl}
                onChangeText={setTempUrl}
                placeholder="Enter API URL (e.g., https://127.0.0.1:5000)"
                placeholderTextColor="#999"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.testButton]}
                onPress={testConnection}
                disabled={testing}
              >
                <Text style={styles.buttonText}>
                  {testing ? 'Testing...' : 'Test Connection'}
                </Text>
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
    backgroundColor: '#1a1a1a',
    paddingTop: 50,
    paddingBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  settingsButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  testButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

