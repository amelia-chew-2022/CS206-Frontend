import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import axios from "axios";
import { useUserIdContext } from "../UserIdContext";

const sendNotificationToUsers = (userIds, team) => {
  userIds.forEach((userId) => {
    axios
      .post(`https://app.nativenotify.com/api/indie/notification`, {
        subID: userId, // Use the current userId in the iteration
        appId: 20396,
        appToken: "dawozslCZUCVBogYZ1F3t4",
        title: "Rescheduled meeting",
        message: `Meeting for ${team} has been rescheduled.`,
      })
      .then((response) => {
        console.log(
          `Notification sent successfully to userId ${userId}:`,
          response.data
        );
      })
      .catch((error) => {
        console.error(`Error sending notification to userId ${userId}:`, error);
      });
  });
};

const NotifTest = () => {
  const { userIds } = useUserIdContext(); // Use the context to get userIds
  const team = "CS 301";

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => sendNotificationToUsers(userIds, team)}
      >
        <Text style={styles.buttonText}>
          Press here to send notification to your user.
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "black",
    padding: 25,
    borderRadius: 10,
  },
  button2: {
    backgroundColor: "pink",
    padding: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default NotifTest;
