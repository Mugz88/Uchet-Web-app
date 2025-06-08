import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { View, StyleSheet, Image, processColor } from 'react-native';
import { Colors } from '../../../../shared/tokens';
import { CustomLink } from '../../../../shared/CustomLink/CustomLink';
import { CloseDrawer } from '../../../../features/layout/ui/CloseDrawer/CloseDrawer.android';
import StorageIcon from '../../../../assets/menu/storage';
import HomeIcon from '../../../../assets/menu/home';
import HistoryIcon from '../../../../assets/menu/history';
import DocsIcon from '../../../../assets/menu/norms';
import { MenuItem } from '../../../../entities/layout/ui/MenuItem/MenuItem';
import { useAuth } from '../../../../entities/auth/AuthContext';
import { getBackgroundColorAsync } from 'expo-system-ui';
const MENU = [
	{ text: 'Главная', icon: <HomeIcon />, path: 'home' },
	{ text: 'Хранилища', icon: <StorageIcon />, path: 'storage' },
	{ text: 'История', icon: <HistoryIcon />, path: 'history' },
	{ text: 'Нормативы', icon: <DocsIcon />, path: 'norms' },
];

export function CustomDrawer(props: DrawerContentComponentProps) {
	const { user, logout } = useAuth();
	return (
		<DrawerContentScrollView {...props} contentContainerStyle={styles.scrollView}>
			<View style={styles.content}>
				<CloseDrawer />
				{MENU.map((menu) => (
					<MenuItem key={menu.path} {...menu} drawer={props} />
				))}
			</View>
			<View style={styles.footer}>
				<CustomLink text="Выход" onPress={() => logout()} href={'/'} />
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
		height: 160,
		marginBottom: 300,
	},
});
