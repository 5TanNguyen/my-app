import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, Button, FlatList, Animated } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

// Thiết lập LocaleConfig cho tiếng Anh
LocaleConfig.locales['en'] = {
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  today: "Today"
};

LocaleConfig.defaultLocale = 'en';

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
  const [selected, setSelected] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [eventInfo, setEventInfo] = useState({ title: '', description: '' });
  const fadeAnim = useRef(new Animated.Value(0)).current; // Khởi tạo giá trị hoạt hình cho fade
  const [eventData , setEventData] = useState({ title: '', description: '' });
  const [todoList , setTodoList] = useState({ id: '', task: '' });

  const onDayPress = (day) => {
    if (eventData[day.dateString]) {
      setEventInfo(eventData[day.dateString]);
      setModalVisible(true);
    } else {
      setSelected(day.dateString);
    }
  };

  useEffect(() => {
    axios.get(`http://10.10.4.43/CodeIgniter-3.1.13/api/getAllTodoCalendar`)
    .then(response => {
      setEventData(response.data.data);
      console.log(response.data.data);
    })
    .catch(error => {
      console.error("Error fetching student info:", error);
    });

    axios.get(`http://10.10.4.43/CodeIgniter-3.1.13/api/getAllTodoName`)
    .then(response => {
      setTodoList(response.data.data);
      console.log(response.data.data);
    })
    .catch(error => {
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
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#00adf5',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#00adf5',
          dayTextColor: '#2d4150',
          textDisabledColor: '#dd99ee'
        }}
        onDayPress={onDayPress}
        markedDates={{
          ...Object.keys(eventData).reduce((acc, date) => {
            acc[date] = { marked: true, dotColor: 'red' };
            return acc;
          }, {}),
          [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' }
        }}
      />

      <View style={styles.todoContainer}>
        <Text style={styles.todoTitle}>Todo List</Text>
        <FlatList
          data={todoList}
          keyExtractor={item => item.id}
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
    borderColor: 'gray',
    height: '50%', // Chiếm 50% chiều cao màn hình
  },
  todoContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  todoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  todoItem: {
    padding: 10,
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền mờ cho modal
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%', // Chiều rộng của modal
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalDescription: {
    marginVertical: 15,
    textAlign: 'center',
  },
});

export default App;
