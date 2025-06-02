import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { View, StyleSheet, Image } from 'react-native';
import { Colors } from '../../../../shared/tokens';
import { CustomLink } from '../../../../shared/CustomLink/CustomLink';
import { CloseDrawer } from '../../../../features/layout/ui/CloseDrawer/CloseDrawer.android';
import CoursesIcon from '../../../../assets/menu/courses';
import ProfileIcon from '../../../../assets/menu/profile';
import { MenuItem } from '../../../../entities/layout/ui/MenuItem/MenuItem';
import { useAuth } from '../../../../entities/auth/AuthContext';
const MENU = [
	{ text: 'Главная', icon: <CoursesIcon />, path: 'home' },
	{ text: 'Хранилища', icon: <ProfileIcon />, path: 'profile' },
];

export function CustomDrawer(props: DrawerContentComponentProps) {
	const { user, logout } = useAuth();
	return (
		<DrawerContentScrollView {...props} contentContainerStyle={styles.scrollView}>
			<View style={styles.content}>
				<CloseDrawer {...props.navigation} />
				{MENU.map((menu) => (
					<MenuItem key={menu.path} {...menu} drawer={props} />
				))}
			</View>
			<View style={styles.footer}>
				<CustomLink text="Выход" onPress={() => logout()} href={'/login'} />
				<Image
					style={styles.logo}
					source={require('../../../../assets/Logo.png')}
					resizeMode="contain"
				/>
			</View>
		</DrawerContentScrollView>
	);
}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
		backgroundColor: Colors.black,
	},
	content: {
		flex: 1,
	},
	footer: {
		gap: 50,
		alignItems: 'center',
		marginBottom: 40,
	},
	logo: {
		width: 160,
	},
});
