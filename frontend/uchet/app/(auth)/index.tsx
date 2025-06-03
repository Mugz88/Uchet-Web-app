import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Dimensions, ScrollView } from 'react-native';
import { Input } from '../../shared/input/input';
import { Colors, Gaps } from '../../shared/tokens';
import { Button } from '../../shared/Button/Button';
import { IUsersData, IUser } from '../../src/types/user';
import { CustomLink } from '../../shared/CustomLink/CustomLink';
import { useEffect, useState } from 'react';
import { useAuth } from '../../entities/auth/AuthContext';


const usersData: IUsersData = require('../../assets/users.json');
export default function App() {
    const [localError, setLocalError] = useState<string | undefined>();
    const [Login, setLogin] = useState<string>();
	const [password, setPassword] = useState<string>();
    const {login, isLoading } = useAuth();

    const submit = () => {
		if (!Login) {
			setLocalError('Не введён логин');
			return;
		}
		if (!password) {
			setLocalError('Не введён пароль');
			return;
		}
		login( Login, password );
	};

    return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image 
          style={{width: 200, height: 200}}
          source={require('../../assets/Logo.png')}
          resizeMode="contain"
        />
        <Text style={{fontSize: 24, color: '#fff'}}>Авторизация</Text>
          <View style={styles.form}>
            <Input
                placeholder="Логин"
                onChangeText={setLogin}
            />
            <Input 
                isPassword 
                placeholder='Пароль'
                onChangeText={setPassword}
            />
            <Button text='Войти' onPress={submit} isLoading={isLoading} />
          </View>
        <CustomLink href={'(auth)/restore/restore'} text="Тех. поддержка" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    padding: 55,
    backgroundColor: Colors.black
  },
  content: {
    alignItems: 'center',
    flex: 1,
    gap: Gaps.g50
  },
  form: {
    alignSelf: 'stretch',
    gap: Gaps.g16
  },
});
