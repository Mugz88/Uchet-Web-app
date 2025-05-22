import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Input } from './shared/input/input';
import { Colors, Gaps } from './shared/tokens';
import { Button } from './shared/Button/Button';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image 
          style={{width: 200, height: 200}}
          source={require('./assets/Logo.png')}
          resizeMode="contain"
        />
        <Text style={{fontSize: 24, color: '#fff'}}>Авторизация</Text>
          <View style={styles.form}>
            <Input placeholder='Логин'/>
            <Input placeholder='Пароль'/>
            <Button text='Войти'/>
          </View>
        <Text style={{position: 'absolute',bottom: 50, color: Colors.link}}>Тех. поддержка</Text>
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
