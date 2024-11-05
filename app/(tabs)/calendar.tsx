import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Button,
  FlatList,
  Animated,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";

// Thiết lập LocaleConfig cho tiếng Anh
LocaleConfig.locales["en"] = {
  monthNames: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  monthNamesShort: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  dayNames: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  today: "Today",
};

LocaleConfig.defaultLocale = "en";

// Dữ liệu sự kiện
// const eventData = {
//   '2024-11-05': { title: 'Team Meeting', description: 'Meeting for Project A' },
//   '2024-11-10': { title: 'Friend\'s Birthday', description: 'Birthday of John' },
//   '2024-11-15': { title: 'Learn Programming', description: 'Join React Native Course' },
// };

// Dữ liệu danh sách công việc ngẫu nhiên
// const todoList = [
//   { id: '1', task: 'Prepare documents for the meeting' },
//   { id: '2', task: 'Send email to the client' },
//   { id: '3', task: 'Prepare project report' },
//   { id: '4', task: 'Go shopping for groceries' },
//   { id: '5', task: 'Exercise for 30 minutes' },
// ];

const App = () => {
  const [selected, setSelected] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [eventInfo, setEventInfo] = useState({ title: "", description: "" });
  const fadeAnim = useRef(new Animated.Value(0)).current; // Khởi tạo giá trị hoạt hình cho fade

  interface EventData {
    [key: string]: {
      title: string;
      description: string;
    };
  }
  interface Day {
    dateString: string;
  }
  interface MarkedDate {
    marked?: boolean;
    dotColor?: string;
    selected?: boolean;
    disableTouchEvent?: boolean;
    selectedDotColor?: string;
  }
  interface Todo {
    id: string;
    task: string;
  }

  const [eventData, setEventData] = useState<EventData>({});

  const [todoList, setTodoList] = useState<Todo[]>([]);

  const onDayPress = (day: Day) => {
    const key = day.dateString;

    if (key in eventData) {
      setEventInfo(eventData[key]);
      setModalVisible(true);
    } else {
      setSelected(key);
    }
  };

  const markedDates = Object.keys(eventData).reduce<Record<string, MarkedDate>>(
    (acc, date) => {
      acc[date] = { marked: true, dotColor: "red" };
      return acc;
    },
    {}
  );

  // Thêm thông tin cho ngày đã chọn
  markedDates[selected] = {
    selected: true,
    disableTouchEvent: true,
    selectedDotColor: "orange",
  };

  useEffect(() => {
    axios
      .get(`http://10.10.4.43/CodeIgniter-3.1.13/api/getAllTodoCalendar`)
      .then((response) => {
        setEventData(response.data.data);
        // console.log(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching student info:", error);
      });

    axios
      .get(`http://10.10.4.43/CodeIgniter-3.1.13/api/getAllTodoName`)
      .then((response) => {
        setTodoList(response.data.data);
        // console.log(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching student info:", error);
      });

    if (modalVisible) {
      // Hiệu ứng fadeIn khi modal mở
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Hiệu ứng fadeOut khi modal đóng
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible]);

  return (
    <View style={styles.container}>
      <Calendar
        style={styles.calendar}
        theme={{
          backgroundColor: "#ffffff",
          calendarBackground: "#ffffff",
          textSectionTitleColor: "#b6c1cd",
          selectedDayBackgroundColor: "#00adf5",
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#00adf5",
          dayTextColor: "#2d4150",
          textDisabledColor: "#dd99ee",
        }}
        onDayPress={onDayPress}
        markedDates={markedDates}
      />

      <View style={styles.todoContainer}>
        <Text style={styles.todoTitle}>Todo List</Text>
        <FlatList
          data={todoList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.todoItem}>
              <Text>{item.task}</Text>
            </View>
          )}
        />
      </View>

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <Animated.View style={[styles.modalView, { opacity: fadeAnim }]}>
            <Text style={styles.modalTitle}>{eventInfo.title}</Text>
            <Text style={styles.modalDescription}>{eventInfo.description}</Text>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendar: {
    borderWidth: 1,
    borderColor: "gray",
    height: "50%", // Chiếm 50% chiều cao màn hình
  },
  todoContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  todoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  todoItem: {
    padding: 10,
    backgroundColor: "#fff",
    marginVertical: 5,
    borderRadius: 5,
    elevation: 2,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu nền mờ cho modal
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    elevation: 5,
    width: "80%", // Chiều rộng của modal
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalDescription: {
    marginVertical: 15,
    textAlign: "center",
  },
});

export default App;
