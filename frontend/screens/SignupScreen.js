import 'react-native-gesture-handler';
import React , {useState} from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

export default function SignupScreen() {
  const navigation=useNavigation();
  
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
  return (
    <View style={styles.container}>
    <Text style={styles.header}>Sign up now</Text>
    <Text style={styles.subHeader}>Please fill the details and create account</Text>
    <TextInput
      style={styles.input}
      placeholder="Name"
      value={name}
      onChangeText={setName}
    />
    <TextInput
      style={styles.input}
      placeholder="Email"
      value={email}
      onChangeText={setEmail}
    />
    <TextInput
      style={styles.input}
      placeholder="Password"
      secureTextEntry
      value={password}
      onChangeText={setPassword}
    />
    <Text style={styles.passwordNote}>Password must be 8 characters</Text>
    
    <View style={styles.pickerContainer}>
        <Picker
          selectedValue={role}
          style={styles.picker}
          onValueChange={(itemValue) => setRole(itemValue)}
        >
          <Picker.Item label="Select Role" value="" />
          <Picker.Item label="Explorer" value="explorer" />
          <Picker.Item label="Business Owner" value="business_owner" />
        </Picker>
      </View>

    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>Sign Up</Text>
    </TouchableOpacity>
    <Text style={styles.loginText}>
      Already have an account?{' '}
      <Text style={styles.loginLink} onPress={() => navigation.navigate('LoginScreen')}>
        Login
      </Text>
    </Text>
  </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#fff',
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
    },
    subHeader: {
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 10,
      fontSize: 18,
      borderRadius: 6,
      marginBottom: 20,
    },
    passwordNote: {
      fontSize: 12,
      color: '#888',
      marginBottom: 20,
      textAlign: 'center',
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: '#00aacc', // Cyan color
      borderRadius: 6,
      marginBottom: 38,
      backgroundColor: '#fff', // Optional: Add background color if needed
    },
    picker: {
      height: 50,
      width: '100%',
      paddingHorizontal: 10,
    },
    button: {
      backgroundColor: '#00aacc',
      padding: 15,
      borderRadius: 6,
      alignItems: 'center',
      marginBottom: 20,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    loginText: {
      textAlign: 'center',
      marginBottom: 20,
      fontSize: 16,
  
    },
    loginLink: {
      color: '#007BFF',
     fontWeight: 'bold'
    },
    orConnectText: {
      textAlign: 'center',
      marginBottom: 20,
    },
    socialContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    socialIcon: {
      width: 40,
      height: 40,
      marginHorizontal: 10,
    },
  });
