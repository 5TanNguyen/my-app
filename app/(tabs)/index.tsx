import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, ScrollView, TouchableOpacity, Modal, Button, Platform, View, Text, Alert } from 'react-native';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';

export default function StudentInfoScreen() {
  const [student, setStudent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
    }
};

  useEffect(() => {
    requestPermission();

    axios.get(`http://10.10.4.43/CodeIgniter-3.1.13/api/student`)
      .then(response => {
        setStudent(response.data);
      })
      .catch(error => {
        console.error("Error fetching student info:", error);
      });
  }, []);

  if (!student) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading student information...</Text>
      </View>
    );
  }

  const avatarUri = selectedImage ? selectedImage : `http://10.10.4.43/CodeIgniter-3.1.13/${student.image}`;
  const gender = student.user_gender === "1" ? "Male" : "Female";

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const uploadImage = async () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (event) => {
        const file = event.target.files[0];
        if (file) {
          const formData = new FormData();
          formData.append('image', file);

          try {
            const apiUrl = 'http://localhost/CodeIgniter-3.1.13/api/update_profile_picture';
            const response = await axios.post(apiUrl, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });

            const tempuri = 'http://localhost/CodeIgniter-3.1.13/' + response.data.data;
            setSelectedImage(tempuri);
            closeModal();
            Toast.show({
              type: 'success',
              text1: 'Upload successful!',
              text2: 'Profile picture updated successfully.',
            });
            console.log('Upload web successful:', response.data);
            
          } catch (error) {
            console.error('Upload failed:', error);
          }
        }
      };
      input.click();
    } else {
        const options = {
          mediaType: 'photo',
          includeBase64: false,
          quality: 1,
        };
    
        // Mở thư viện hình ảnh
        const response = await ImagePicker.launchImageLibraryAsync(options);
        
        if (response.cancelled) {
          console.log('User cancelled image picker');
          return;
        }
    
        if (response.error) {
          console.error('ImagePicker Error: ', response.error);
          return;
        }
    
        if (response.assets && response.assets.length > 0) {
          const image = response.assets[0];
          const formData = new FormData();
          const photo = { 
            uri: image.uri, 
            type: image.type || 'image/jpg', 
            name: 'avatar.jpg' };
          formData.append('image', photo);
    
          try {
            const apiUrl = 'http://10.10.4.43/CodeIgniter-3.1.13/api/update_profile_picture';
            const uploadResponse = await axios.post(apiUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        
            const tempuri = 'http://10.10.4.43/CodeIgniter-3.1.13/' + uploadResponse.data.data;
            setSelectedImage(tempuri); // Cập nhật trạng thái với hình ảnh đã chọn
            closeModal(); // Đóng modal
            Toast.show({
                type: 'success',
                text1: 'Upload successful!',
                text2: 'Profile picture updated successfully.',
            });
            console.log('Upload successful:', uploadResponse.data);
          } catch (error) {
              // Kiểm tra chi tiết lỗi
              console.error('Upload failed:', error.response ? error.response.data : error.message);
          }
        } else {
          console.log('No image selected');
        }
      };
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
        <View style={styles.infoTextContainer}>
          <Text style={styles.name}>{student.firstname} {student.lastname}</Text>
          <Text style={styles.studentId}>Student ID: Y240001</Text>
          <TouchableOpacity style={styles.changeButton} onPress={openModal}>
            <Text style={styles.changeButtonText}>Change profile picture</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Gender:</Text>
          <Text style={styles.value}>{gender}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Date of Birth:</Text>
          <Text style={styles.value}>{student.user_birthday}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{student.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{student.user_phone}</Text>
        </View>
      </View>

      {/* Modal để chọn ảnh đại diện */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Change Profile Picture</Text>
            <Button title="Select from gallery" onPress={uploadImage} />
            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={closeModal} color="#888" />
            </View>
          </View>
        </View>
      </Modal>

      <Toast />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    backgroundColor: '#e0e0e0',
  },
  infoTextContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4b69c1',
  },
  studentId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  changeButton: {
    backgroundColor: '#4b69c1',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  changeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    width: 120,
  },
  value: {
    fontSize: 16,
    fontWeight: '400',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
});
