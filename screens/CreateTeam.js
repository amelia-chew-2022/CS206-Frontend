import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, FlatList, Alert } from 'react-native';
import Service from '../service'; // Make sure this path is correct

const NewTeamScreen = () => {
  const [teamName, setTeamName] = useState('');
  const [email, setEmail] = useState('');
  const [teamEmails, setTeamEmails] = useState([]);

  const handleAddEmail = () => {
    if (email && !teamEmails.includes(email)) {
      setTeamEmails(prevEmails => [...prevEmails, email]);
      setEmail(''); // Reset the email input after adding
    } else {
      Alert.alert('Duplicate or Empty Email', 'Each email must be unique and non-empty.');
    }
  };

  const handleDeleteEmail = (emailToDelete) => {
    setTeamEmails(prevEmails => prevEmails.filter(email => email !== emailToDelete));
  };

  const handleCreateTeam = () => {
    if (teamName.trim() && teamEmails.length > 0) {
      Service.createTeam(teamName.trim(), teamEmails)
        .then(() => {
          Alert.alert('Success', 'Your team has been created successfully!');
          // Reset the form or navigate to another screen as needed
          setTeamName('');
          setTeamEmails([]);
        })
        .catch((error) => {
          console.error('Error creating team:', error);
          // Here you could extract and show more detailed error messages if your API provides them
          Alert.alert('Error', 'There was a problem creating your team. Please try again.');
        });
    } else {
      Alert.alert('Invalid Input', 'Please enter a team name and at least one team member email.');
    }
  };


  const renderEmailItem = ({ item }) => (
    <View style={styles.emailListItem}>
      <Text style={styles.emailText}>{item}</Text>
      <TouchableOpacity onPress={() => handleDeleteEmail(item)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Create a New Team</Text>
      <Text style={styles.label}>Team Name</Text>
      <TextInput
        style={styles.input}
        value={teamName}
        onChangeText={setTeamName}
        placeholder="Enter team name"
      />

      <Text style={styles.label}>Add Team Members</Text>
      <View style={styles.emailInputContainer}>
        <TextInput
          style={styles.emailInput}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter teammate's email"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddEmail}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={teamEmails}
        renderItem={renderEmailItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.emailList}
      />

<TouchableOpacity style={styles.button} onPress={handleCreateTeam}>
        <Text style={styles.buttonText}>Create Team</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 30,
    fontWeight: 'bold',
    fontSize: 50,
    color: 'black',
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: '10%', // Adjusted for consistency with the margin from the SignUpScreen
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginVertical: 10,
    width: '80%', // Assuming the SignUpScreen has inputs of 80% width
  },
  emailInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%', // Match the width with the SignUpScreen inputs
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  emailInput: {
    // Inherits the styling of `input` but adjusts the width to allow space for the add button
    height: 50,
    flex: 1,
    marginRight: 10,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  addButton: {
    // Adjusted to resemble the loginButton style
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
  },
  emailList: {
    marginTop: 20,
    width: '80%', // Match the width with the SignUpScreen inputs
  },
  emailListItem: {
    flexDirection: 'row',
    backgroundColor: '#e1e1e1',
    borderRadius: 25,
    padding: 15,
    marginTop: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emailText: {
    color: 'black',
    flex: 1,
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 25,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    // Adapted from the loginButton style
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10,
  },
  buttonText: {
    // Adapted from the loginButtonText style
    color: 'white',
    fontSize: 18,
  },
});

export default NewTeamScreen;