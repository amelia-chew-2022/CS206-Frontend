import React from "react";
import registerNNPushToken from "native-notify";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import MeetingConfigurationScreen from "./screens/MeetingConfiguration";
import NewTeamScreen from "./screens/CreateTeam";
import TestPage from "./screens/Testpage";
import CommonTimeslots from "./screens/CommonTimeslots";
import SignUpScreen from "./screens/SignUpScreen";
import RescheduleMeetingScreen from "./screens/RescheduleMeetingScreen";
import MeetingList from "./screens/MeetingList";
import NotifTest from "./screens/NotifTest";
import { MeetingIdProvider } from "./MeetingIdContext";
import { UserIdProvider } from "./UserIdContext";
import ScheduleScreen from "./screens/ScheduleScreen";
import MeetingProgressScreen from "./screens/MeetingProgressScreen";
import MeetingSuccessScreen from "./screens/MeetingSuccessScreen";
import HomePage from "./screens/HomePage";
import GoogleCalendarScreen from "./screens/GoogleCalendarScreen"
import { UserTeamIdProvider } from "./UserTeamIdContext";
import PendingMeetings from "./screens/PendingMeetings";
import UserEvents from "./screens/UserEvents";

const Stack = createStackNavigator();

export default function App() {
  registerNNPushToken(20396, "dawozslCZUCVBogYZ1F3t4");
  return (
    <UserTeamIdProvider>
      <MeetingIdProvider>
        <UserIdProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
              <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="MeetingConfiguration"
                component={MeetingConfigurationScreen}
                options={{ headerShown: false, title: "Meeting Configuration" }}
              />
              <Stack.Screen
                name="CreateTeam"
                component={NewTeamScreen}
                options={{ headerShown: false, title: "CreateTeam" }}
              />
              <Stack.Screen
                name="Testpage"
                component={TestPage}
                options={{ headerShown: true, title: "Testpage" }}
              />
              <Stack.Screen
                name="CommonSlots"
                component={CommonTimeslots}
                options={{ headerShown: true, title: "Common Time Slots" }}
              />
              <Stack.Screen
                name="MeetingProgressScreen"
                component={MeetingProgressScreen}
                options={{ headerShown: false, title: "Meeting Progress" }}
              />
              <Stack.Screen
                name="RescheduleMeeting"
                component={RescheduleMeetingScreen}
                options={{ headerShown: true, title: "RescheduleMeeting" }}
              />
              <Stack.Screen
                name="MeetingSuccessScreen"
                component={MeetingSuccessScreen}
                options={{ headerShown: false, title: "Successful!" }}
              />
              <Stack.Screen
                name="ScheduleScreen"
                component={ScheduleScreen}
                options={{ headerShown: true, title: "Calendar" }}
              />
              <Stack.Screen
                name="NotifTest"
                component={NotifTest}
                options={{ headerShown: true, title: "NotifTest" }}
              />
              <Stack.Screen
                name="MeetingList"
                component={MeetingList}
                options={{ headerShown: true, title: "Meetings" }}
              />

              <Stack.Screen
                name="HomePage"
                component={HomePage}
                options={{ headerShown: true, title: "HomePage" }}
              />
              <Stack.Screen
                name="GoogleCalendar"
                component={GoogleCalendarScreen}
                options={{ headerShown: true, title: "Google Calendar" }}
              />

              <Stack.Screen
                name="PendingMeetings"
                component={PendingMeetings}
                options={{ headerShown: false, title: "PendingMeetings" }}
              />
              <Stack.Screen
                name="UserEvents"
                component={UserEvents}
                options={{ headerShown: true, title: "UserEvents" }}
              />

              {/* ...other screens if any */}
            </Stack.Navigator>
          </NavigationContainer>
        </UserIdProvider>
      </MeetingIdProvider>
    </UserTeamIdProvider>
  );
}
