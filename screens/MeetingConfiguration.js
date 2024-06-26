import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  View,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import MeetingService from "../meetingService";
import DateTimePicker from "@react-native-community/datetimepicker";
import Service from "../service";
import { useUserTeamIdContext } from "../UserTeamIdContext";
import { useUserIdContext } from "../UserIdContext";
import { notifyTeamOfNewMeeting } from "../notification";
import { MaterialIcons } from "@expo/vector-icons"; // Make sure to import MaterialIcons


const MeetingConfigurationScreen = ({ navigation }) => {
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [meetingName, setMeetingName] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedFrequency, setSelectedFrequency] = useState("");
  const [isTeamPickerModalVisible, setTeamPickerModalVisible] = useState(false);
  const [teams, setTeamNames] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState({
    start: false,
    end: false,
  });
  const { userTeamIds } = useUserTeamIdContext();

  const [showDatePicker, setShowDatePicker] = useState({
    start: false,
    end: false,
  });

  const getIsoStringWithLocalTimezone = (date) => {
    const timezoneOffsetInMinutes = date.getTimezoneOffset();
    const timezoneOffsetInMs = timezoneOffsetInMinutes * 60000;
    // Subtract timezoneOffset to get local time in UTC format
    const localTime = new Date(date.getTime() - timezoneOffsetInMs);
    return localTime.toISOString().split(".")[0] + "Z"; // Removing milliseconds
  };

  const getDurationInSeconds = (duration) => {
    switch (duration) {
      case "1 hour":
        return 3600;
      case "2 hours":
        return 7200;
      case "4 hours":
        return 14400;
      case "Custom":
        return parseInt(customDuration) * 3600; // Custom duration in hours to seconds
      default:
        return 3600; // Default to 1 hour
    }
  };
  useEffect(() => {
    const fetchTeamNames = async () => {
      try {
        // Fetching both team names and their IDs
        const teamsDataPromises = userTeamIds.map(async (teamId) => {
          const teamInfo = await Service.getTeamById(teamId);
          return {
            teamName: teamInfo.teamName, // Assuming the response has a teamName field
            teamId: teamId, // Or teamInfo.teamId if the ID is part of the response
          };
        });

        const resolvedTeamsData = await Promise.all(teamsDataPromises);
        setTeamNames(resolvedTeamsData); // Stores objects with teamName and teamId
      } catch (error) {
        console.error("Failed to fetch team names", error);
      }
    };

    if (userTeamIds.length > 0) {
      fetchTeamNames();
    }
  }, [userTeamIds]);

  // createMeeting
  const handleCreateMeeting = async () => {
    const durationInSeconds = getDurationInSeconds(selectedDuration);
    const teamId = selectedTeamId;
    const frequency = selectedFrequency;
    const startDateTime = (
      startDate.toISOString().split("T")[0] +
      "T" +
      getIsoStringWithLocalTimezone(startTime).split("T")[1]
    ).split("Z")[0];
    const endDateTime = (
      endDate.toISOString().split("T")[0] +
      "T" +
      getIsoStringWithLocalTimezone(endTime).split("T")[1]
    ).split("Z")[0];

    try {
      const response = await MeetingService.createMeeting(
        teamId,
        meetingName,
        startDateTime,
        endDateTime,
        durationInSeconds,
        frequency
      );
      const team = await Service.getTeamById(teamId);
      notifyTeamOfNewMeeting(team.teamUserIds, team.teamName);
      console.log(team.teamName);
      console.log(team.teamUserIds);

      if (response) {
        Alert.alert("Meeting successfully created!");
        setTimeout(() => {
          navigation.navigate("CommonSlots", {
            meetingId: response.id,
          });
        }, 3000);
      } else {
        console.error("Failed to create meeting:", response.data);
      }
    } catch (error) {
      Alert.alert("There was a problem creating the meeting");
    }
  };
  const handleEndDateChange = (event, selectedDate) => {
    if (selectedDate < startDate) {
      Alert.alert("Invalid Date", "End date cannot be before start date.");
    } else {
      setEndDate(selectedDate || endDate);
    }
  };

  // Adjust your time picker's onChange handler for start time
  const handleStartTimeChange = (event, selectedTime) => {
    if (
      startDate.toDateString() === endDate.toDateString() &&
      selectedTime > endTime
    ) {
      Alert.alert(
        "Invalid Time",
        "Start time cannot be after end time on the same day."
      );
    } else {
      setStartTime(selectedTime || startTime);
    }
  };

  // Adjust your time picker's onChange handler for end time
  const handleEndTimeChange = (event, selectedTime) => {
    if (
      startDate.toDateString() === endDate.toDateString() &&
      selectedTime < startTime
    ) {
      Alert.alert(
        "Invalid Time",
        "End time cannot be before start time on the same day."
      );
    } else {
      setEndTime(selectedTime || endTime);
    }
  };

  const renderTeamItem = ({ item }) => (
    <TouchableOpacity
      style={styles.teamItem}
      onPress={() => {
        setSelectedTeam(item.teamName); // Update to show the team name
        setSelectedTeamId(item.teamId); // Store the selected team's ID
        setTeamPickerModalVisible(false);
      }}
    >
      <Text style={styles.teamItemText}>{item.teamName}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => navigation.goBack()}
    >
      <MaterialIcons name="arrow-back" size={24} color="black" />
    </TouchableOpacity>
      <Text style={styles.header}>Meeting Configuration</Text>

      <Text style={styles.label}>Team</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setTeamPickerModalVisible(true)}
      >
        <Text style={styles.inputText}>{selectedTeam || "Select Team"}</Text>
      </TouchableOpacity>

      <Modal
        isVisible={isTeamPickerModalVisible}
        onBackdropPress={() => setTeamPickerModalVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <FlatList
            data={teams}
            renderItem={renderTeamItem}
            keyExtractor={(item) => item.teamId}
          />
        </View>
      </Modal>

      <Text style={styles.label}>Meeting Name</Text>
      <TextInput
        style={styles.input}
        value={meetingName}
        onChangeText={setMeetingName}
        placeholder="Enter Meeting Name"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Duration of Meeting</Text>
      <View style={styles.buttonGroup}>
        {["1 hour", "2 hours", "4 hours", "Custom"].map((duration) => (
          <TouchableOpacity
            key={duration}
            style={[
              styles.button,
              selectedDuration === duration && styles.selectedButton,
            ]}
            onPress={() => setSelectedDuration(duration)}
          >
            <Text style={styles.buttonText}>{duration}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Frequency</Text>
      <View style={styles.buttonGroup}>
        {["Once", "Weekly", "Fortnight", "Monthly"].map((frequency) => (
          <TouchableOpacity
            key={frequency}
            style={[
              styles.button,
              selectedFrequency === frequency && styles.selectedButton,
            ]}
            onPress={() => setSelectedFrequency(frequency)}
          >
            <Text style={styles.buttonText}>{frequency}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Start Date Picker */}
      <Text style={styles.label}>Start Date</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowDatePicker({ ...showDatePicker, start: true })}
      >
        <Text>Select Start Date</Text>
      </TouchableOpacity>
      {showDatePicker.start && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) =>
            setStartDate(selectedDate || startDate)
          }
        />
      )}

      {/* End Date Picker */}
      <Text style={styles.label}>End Date</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowDatePicker({ ...showDatePicker, end: true })}
      >
        <Text>Select End Date</Text>
      </TouchableOpacity>
      {showDatePicker.end && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          minimumDate={new Date()} // Prevents past dates from being selected
          onChange={handleEndDateChange}
        />
      )}

      {/* Start Time Picker */}
      <Text style={styles.label}>Start Time</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowTimePicker({ ...showTimePicker, start: true })}
      >
        <Text>Select Start Time</Text>
      </TouchableOpacity>
      {showTimePicker.start && (
        <DateTimePicker
          value={startTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleStartTimeChange}
        />
      )}

      {/* End Time Picker */}
      <Text style={styles.label}>End Time</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowTimePicker({ ...showTimePicker, end: true })}
      >
        <Text>Select End Time</Text>
      </TouchableOpacity>
      {showTimePicker.end && (
        <DateTimePicker
          value={endTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleEndTimeChange}
        />
      )}

      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateMeeting}
      >
        <Text style={styles.createButtonText}>Create Meeting</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 22,
  },
  teamItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  teamItemText: {
    textAlign: "center",
    fontSize: 18,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  checkboxLabel: {
    fontSize: 18,
  },
  checkbox: {
    fontSize: 18,
    color: "black",
  },
  inputText: {
    fontSize: 16,
    color: "#333",
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
    paddingTop: 50, // Increase padding at the top to push content down
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center", // Center-align the header text
    marginTop: 20, // Push the header down a bit
  },
  backButton: {
    position: 'absolute',
    top: 72,  // Adjust the top position as needed, based on your container's paddingTop
    left: 20,  // Keep it near the left edge
    zIndex: 10,  // Ensure the button is clickable over other elements
  },
  label: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#d0d0d0",
    fontSize: 16,
    marginTop: 5,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d0d0d0",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    marginTop: 5,
    backgroundColor: "#fff",
  },
  selectedButton: {
    backgroundColor: "#add8e6", // Light blue color
    borderColor: "#77b3d4", // Optional: slightly darker shade for border if needed
  },
  buttonText: {
    color: "black",
    textAlign: "center",
  },
  createButton: {
    backgroundColor: "black",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default MeetingConfigurationScreen;
