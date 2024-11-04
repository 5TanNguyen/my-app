import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";

// Dữ liệu mẫu
const courseData = {
  "2024-1": [
    {
      id: "1",
      name: "Giải tích 1",
      credits: 3,
      status: "Tích lũy",
      grade: 8.5,
    },
    {
      id: "2",
      name: "Lập trình cơ sở",
      credits: 3,
      status: "Tích lũy",
      grade: 9.0,
    },
    {
      id: "3",
      name: "Vật lý đại cương",
      credits: 4,
      status: "Chưa tích lũy",
      grade: 7.0,
    },
  ],
  "2024-2": [
    {
      id: "4",
      name: "Giải tích 2",
      credits: 3,
      status: "Chưa tích lũy",
      grade: 7.5,
    },
    {
      id: "5",
      name: "Cấu trúc dữ liệu",
      credits: 3,
      status: "Tích lũy",
      grade: 8.0,
    },
    {
      id: "6",
      name: "Lý thuyết đồ thị",
      credits: 3,
      status: "Chưa tích lũy",
      grade: 6.5,
    },
  ],
  "2025-1": [
    {
      id: "7",
      name: "Hệ điều hành",
      credits: 3,
      status: "Tích lũy",
      grade: 8.0,
    },
    {
      id: "8",
      name: "Cơ sở dữ liệu",
      credits: 3,
      status: "Chưa tích lũy",
      grade: 9.0,
    },
    {
      id: "9",
      name: "Mạng máy tính",
      credits: 4,
      status: "Tích lũy",
      grade: 7.5,
    },
  ],
};

const App = () => {
  const [expandedTerm, setExpandedTerm] = useState(null);

  const handleTermPress = (term) => {
    setExpandedTerm(expandedTerm === term ? null : term);
  };

  const renderTermItem = ({ item }) => (
    <View>
      <TouchableOpacity
        style={styles.termItem}
        onPress={() => handleTermPress(item)}
      >
        <Text style={styles.termText}>{item}</Text>
      </TouchableOpacity>
      {expandedTerm === item && (
        <View style={styles.coursesContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.courseTextIndex}>STT</Text>
            <Text style={styles.headerText}>Tên học phần</Text>
            <Text style={styles.headerText}>Số tín chỉ</Text>
            <Text style={styles.headerText}>Trạng thái tích lũy</Text>
            <Text style={styles.headerText}>Điểm</Text>
          </View>
          {courseData[item].map((course, index) => (
            <View key={course.id} style={styles.courseItem}>
              <Text style={styles.courseTextIndex}>{index + 1}</Text>
              <Text style={styles.courseText}>{course.name}</Text>
              <Text style={styles.courseTextt}>{course.credits}</Text>
              <Text style={styles.courseText}>{course.status}</Text>
              <Text style={styles.courseTextGrade}>{course.grade}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Điểm số</Text>
      <FlatList
        data={Object.keys(courseData)}
        keyExtractor={(item) => item}
        renderItem={renderTermItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  termItem: {
    padding: 15,
    backgroundColor: "#ffffff",
    marginBottom: 10,
    borderRadius: 5,
    elevation: 2,
  },
  termText: {
    fontSize: 18,
  },
  coursesContainer: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    elevation: 1,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
    marginBottom: 5,
  },
  headerText: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
  },
  courseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  courseText: {
    flex: 1,
    textAlign: "left",
  },
  courseTextt: {
    flex: 1,
    textAlign: "center",
  },
  courseTextIndex: {
    width: 40,
    fontWeight: "bold",
  },
  courseTextGrade: {
    flex: 1,
    textAlign: "left",
    left: 20,
  },
});

export default App;
