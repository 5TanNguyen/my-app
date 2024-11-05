import React, { useEffect, useState } from "react";
import JSEncrypt from "jsencrypt";
import {
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Button,
  Platform,
  View,
  Text,
  Alert,
} from "react-native";
import axios, { AxiosError } from "axios";
import { launchImageLibrary } from "react-native-image-picker";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";

export default function StudentInfoScreen() {
  const [student, setStudent] = useState();
  //   {
  //   image: "",
  //   user_gender: "",
  //   lastname: "",
  //   firstname: "",
  //   user_birthday: "",
  //   email: "",
  //   user_phone: "",
  // }
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState("");

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
  };

  useEffect(() => {
    requestPermission();

    axios
      .get(`http://localhost/studentsdnc-api/api/v1/common/keys/getPublicKey`, {
        headers: {
          "Content-Type": "application/json", // Nếu cần thiết, bạn có thể thêm các header khác ở đây
          "DHNCT-API-KEY": "@cntt@dhnct@",
        },
      })
      .then((response) => {
        // setPublicKey(response.data?.publicKey);
        // console.log(response.data?.publicKey);
        const publicKey = response.data?.publicKey;
        // const encrypt = new JSEncrypt();
        // encrypt.setPublicKey(publicKey);
        // const encryptedPassword = encrypt.encrypt("12345");
        // console.log(encryptedPassword);
      })
      .catch((error) => {
        console.error("Error fetching student info:", error);
      });

    axios
      .get(
        `http://localhost/studentsdnc-api/api/v1/sinhvien/info/Thongtinsinhvien`,
        {
          // .get(`http://10.10.4.43/CodeIgniter-3.1.13/api/student`, {
          headers: {
            "Content-Type": "application/json", // Nếu cần thiết, bạn có thể thêm các header khác ở đây
            "DHNCT-API-KEY": "@cntt@dhnct@",
            "DHNCT-Authorization":
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJxbF9uZ3VvaV9kdW5nX2lkIjoiNTEwIiwicWxfbmd1b2lfZHVuZ19ob190ZW4iOiJUclx1MWVhN24gVGhcdTFlY2IgSFx1MDBlMCIsInFsX25ndW9pX2R1bmdfZW1haWwiOiJ0ZXN0MTNAZ21haWwuY29tIiwicWxfbmd1b2lfZHVuZ19hdmF0YXIiOm51bGwsInFsX25ndW9pX2R1bmdfdG9rZW4iOm51bGwsInFsX25ndW9pX2R1bmdfbG9haSI6IjEiLCJxbF9uZ3VvaV9kdW5nX25nYXlfdGFvIjoiMjAyNC0xMC0yMiAxNTowOToyMCIsInFsX25ndW9pX2R1bmdfbmdheV9jYXBfbmhhdCI6IjIwMjQtMTAtMjIgMTU6MDk6MjAiLCJhY3RpdmVfZmxhZyI6IjEiLCJjcmVhdGVkX2F0IjoiMjAyNC0xMC0yMiAxNTowOToyMCIsInVwZGF0ZWRfYXQiOiIyMDI0LTEwLTIyIDE1OjA5OjIwIiwicWxfbmd1b2lfZHVuZ19obyI6IlRyXHUxZWE3biBUaFx1MWVjYiIsInFsX25ndW9pX2R1bmdfdGVuIjoiSFx1MDBlMCIsInN0YXJ0X3RpbWUiOjE3MzA3NzkyNjEuNDg3MTM0fQ.Dlv2ibHcXer3KGYp4G0lj2HFQpq8srQr6ldv6PQMHR8",
          },
        }
      )
      .then((response) => {
        setStudent(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => {
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

  const avatarUri = selectedImage
    ? selectedImage
    : `http://10.10.4.43/CodeIgniter-3.1.13/${student.image}`;
  const gender = student.sv_sinh_vien_gioi_tinh === "2" ? "Male" : "Female";

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const uploadImage = async () => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async (event) => {
        const target = event.target as HTMLInputElement; // Chuyển đổi kiểu cho target
        const file = target.files?.[0];
        if (file) {
          const formData = new FormData();
          formData.append("image", file);

          try {
            const apiUrl =
              "http://localhost/CodeIgniter-3.1.13/api/update_profile_picture";
            const response = await axios.post(apiUrl, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            const tempuri =
              "http://localhost/CodeIgniter-3.1.13/" + response.data.data;
            setSelectedImage(tempuri);
            closeModal();
            Toast.show({
              type: "success",
              text1: "Upload successful!",
              text2: "Profile picture updated successfully.",
            });
            console.log("Upload web successful:", response.data);
          } catch (error) {
            console.error("Upload failed:", error);
          }
        }
      };
      input.click();
    } else {
      const options = {
        mediaType: "photo",
        includeBase64: false,
        quality: 1,
      };

      // Mở thư viện hình ảnh
      const response = await ImagePicker.launchImageLibraryAsync(options);

      if (response.canceled) {
        console.log("User cancelled image picker");
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const image = response.assets[0];
        console.log("Selected Image:", image); // Kiểm tra hình ảnh đã chọn

        const photo = {
          uri: image.uri,
          type: image.type || "image/jpeg", // Thay đổi từ 'image/jpg' thành 'image/jpeg'
          name: image.fileName || "avatar.jpg", // Thêm fileName từ image nếu có
        };
        const blob = await fetch(photo.uri).then((res) => res.blob());

        const formData = new FormData();
        formData.append("image", blob, photo.name);

        try {
          const apiUrl =
            "http://10.10.4.43:8081/CodeIgniter-3.1.13/api/update_profile_picture";
          const uploadResponse = await axios.post(apiUrl, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          const tempuri =
            "http://10.10.4.43:8081/CodeIgniter-3.1.13/" +
            uploadResponse.data.data;
          setSelectedImage(tempuri);
          closeModal();
          Toast.show({
            type: "success",
            text1: "Upload successful!",
            text2: "Profile picture updated successfully.",
          });
          console.log("Upload successful:", uploadResponse.data);
        } catch (error) {
          console.error("Upload failed:" + error);
        }
      } else {
        console.log("No image selected");
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
        <View style={styles.infoTextContainer}>
          <Text style={styles.name}>
            {student.sv_sinh_vien_ten} {student.sv_sinh_vien_ho}
          </Text>
          <Text style={styles.studentId}>
            Student ID: {student.sv_sinh_vien_ma}
          </Text>
          <TouchableOpacity style={styles.changeButton} onPress={openModal}>
            <Text style={styles.changeButtonText}>Change profile picture</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Class Name:</Text>
          <Text style={styles.value}>{student.sv_lop_ma}</Text>
        </View>
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
    backgroundColor: "#fff",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    backgroundColor: "#e0e0e0",
  },
  infoTextContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4b69c1",
  },
  studentId: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  changeButton: {
    backgroundColor: "#4b69c1",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  changeButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    width: 120,
  },
  value: {
    fontSize: 16,
    fontWeight: "400",
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
});
