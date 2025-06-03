import { Redirect } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Colors, Fonts } from '../../shared/tokens';
import { MenuButton } from '../../features/layout/ui/MenuButton/MenuButton';
import { CustomDrawer } from '../../widget/layout/ui/CustomDrawer/CustomDrawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../entities/auth/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';


export default function AppLayout() {
	const { user, isLoading } = useAuth();
	if (isLoading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }
	if (!user) {
		return <Redirect href="/" />; 
	}
	return (
		<GestureHandlerRootView style={styles.wrapper}>
			<Drawer
				drawerContent={(props: DrawerContentComponentProps) => <CustomDrawer {...props} />}
				screenOptions={({ navigation }) => ({
					headerStyle: {
						backgroundColor: Colors.blackLight,
						shadowColor: Colors.blackLight,
						shadowOpacity: 0,
					},
					headerLeft: () => {
						return <MenuButton navigation={navigation} />;
					},
					headerTitleStyle: {
						color: Colors.white,
						fontFamily: Fonts.regular,
						fontSize: Fonts.f20,
					},
					headerTitleAlign: 'center',
					sceneContainerStyle: {
						backgroundColor: Colors.black,
					},
				})}
			>
				<Drawer.Screen
					name="home"
					options={{
						title: 'Главная',
					}}
				/>
				<Drawer.Screen
					name="storage"
					options={{
						title: 'Хранилища',
					}}
				/>
				<Drawer.Screen
					name="stats"
					options={{
						title: 'Статистика',
					}}
				/>
			</Drawer>
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
	},
	loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.black,
    },
});

