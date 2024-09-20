// screens/Login.js
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import {Auth} from '../services';
import TextInputField from '../components/TextInputField';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await Auth.signIn(email, password);
      // Navigate on success
    } catch (error) {
      console.error(error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://plus.unsplash.com/premium_photo-1683910767532-3a25b821f7ae?q=80&w=2816&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      }}
      style={styles.background}
      resizeMode="cover">
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInputField
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInputField
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          isPassword={isPasswordSecure}
          onTogglePassword={() => setIsPasswordSecure(!isPasswordSecure)}
        />
        <TouchableOpacity
          onPress={handleSignIn}
          style={styles.button}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('SignUp')}
          style={styles.button}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    padding: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#0f6b4e',
    padding: 10,
    borderRadius: 10,
    marginVertical: 8,
    width: '100%',
    marginHorizontal: 8,
  },
  buttonText: {
    color: 'white',
  },
});

export default Login;
