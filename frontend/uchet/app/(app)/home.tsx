import { View, Text, Button, ActivityIndicator } from 'react-native';
import { useAuth } from '../../entities/auth/AuthContext';
import { Colors } from '../../shared/tokens';
import { StyleSheet } from 'react-native';

export default function HomeScreen() {
  const { user, logout } = useAuth();

  return (
    <>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Добро пожаловать, {user?.loginUser}!</Text>
        <Text>Роль: {user?.role}</Text>
        <Button title="Выйти" onPress={logout} />
        </View>
    </>
  );
}

const styles = StyleSheet.create({
	activity: {
		marginTop: 30,
	}
});