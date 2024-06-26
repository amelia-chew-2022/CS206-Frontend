import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MeetingService from "../meetingService";
import Service from "../service";
import {
  handleNotifyPingPress,
  notifyTeamOfNewMeeting,
  notifyUsersAboutTeamCreation,
  notifyUsersOfScheduledMeeting,
} from "../notification";
import { useUserIdContext } from "../UserIdContext";
import { MaterialIcons } from "@expo/vector-icons";

const MemberItem = ({ name, hasVoted, onPingPress, userId }) => (
  <View style={styles.memberItem}>
    <Ionicons name="person-circle-outline" size={24} color="black" />
    <Text style={styles.memberName}>{name}</Text>
    {!hasVoted && (
      <TouchableOpacity
        onPress={() => onPingPress(userId)}
        style={styles.pingButton}
      >
        <Text style={styles.pingButtonText}>Ping</Text>
      </TouchableOpacity>
    )}
  </View>
);

const MeetingProgressScreen = ({ navigation, route }) => {
  const { meetingId } = route.params;
  const [members, setMembers] = useState([]);
  const [meetingName, setMeetingName] = useState(""); // State to store meeting name
  const { addUserId } = useUserIdContext();
  const [memberIDs, setMemberIds] = useState([]);
  const extractUserIds = (memberData) => {
    const userIds = memberData.map((member) => member.id);
    return userIds;
  };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const meetingData = await MeetingService.getMeeting(meetingId);
        setMeetingName(meetingData.meetingName); // Assuming the meeting data has a 'name' field

        const entries = Object.entries(meetingData.hasUserVoted);
        // Fetch user names based on their IDs and update the state
        const memberDataPromises = entries.map(async ([userId, hasVoted]) => {
          const userData = await Service.getUserById(userId);
          addUserId(userId);
          return { id: userId, name: userData.userName, hasVoted };
        });
        const memberData = await Promise.all(memberDataPromises);
        setMembers(memberData);
        const memberIDs = extractUserIds(memberData);
        setMemberIds(memberIDs);
        // Check if all members have voted
        const isMeetingSet = meetingData.isMeetingSet;
        if (isMeetingSet) {
          console.log(memberIDs);
          notifyUsersOfScheduledMeeting(memberIDs, meetingName);
          setTimeout(() => {
            console.log(memberIDs);
            // Navigate to MeetingSuccessScreen
            navigation.navigate("MeetingSuccessScreen", {
              meetingId: meetingId,
            });
          }, 3000); // Adjust delay as needed
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Something went wrong");
      }
    };
    fetchUsers();
  }, []);

  const handlePingPress = (userId, userName) => {
    handleNotifyPingPress(userId, meetingName);
    Alert.alert("You have pinged " + userName);
    //navigation.navigate("MeetingSuccessScreen", { meetingId: meetingId });
    console.log(`Ping ${userId}`);
  };

  return (
    <View style={styles.container}>
   <TouchableOpacity
    style={styles.backButton}
    onPress={() => {
      // Adjust this navigation call to match your homepage route name
      navigation.navigate('HomePage');
    }}
  >
    <MaterialIcons name="arrow-back" size={24} color="black" />
  </TouchableOpacity>

      {/* Display the meeting name */}
      <Text style={styles.meetingName}>
        {meetingName || "Loading Meeting..."}
      </Text>

      <Text style={styles.header}>Meeting Generation In Progress:</Text>
      <Text style={styles.subHeader}>Members Voted</Text>
      <FlatList
        data={members.filter((member) => member.hasVoted)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MemberItem
            name={item.name}
            hasVoted={item.hasVoted}
            onPingPress={() => handlePingPress(item.name)}
          />
        )}
      />
      <Text style={styles.subHeader}>Members Yet To Vote</Text>
      <FlatList
        data={members.filter((member) => !member.hasVoted)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MemberItem
            name={item.name}
            hasVoted={item.hasVoted}
            onPingPress={() => handlePingPress(item.id, item.name)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  meetingName: {
    // Style for the meeting name
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    marginTop: 15,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 10,
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  memberName: {
    marginLeft: 10,
    flex: 1,
  },
  pingButton: {
    backgroundColor: "#007bff",
    borderRadius: 20,
    padding: 10,
  },
  pingButtonText: {
    color: "#ffffff",
  },
  // Add additional styles as necessary
  backButton: {
    position: 'absolute',
    top: 72,  // Adjust the top position as needed, based on your container's paddingTop
    left: 20,  // Keep it near the left edge
    zIndex: 10
  },
  
});

export default MeetingProgressScreen;
