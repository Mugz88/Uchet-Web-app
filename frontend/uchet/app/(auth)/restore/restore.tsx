import { Link } from 'expo-router';
import { View, Text } from 'react-native';
import { Colors } from '../../../shared/tokens';

export default function Restore() {
	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.black }}>
			<Link href={'/'}>
				<Text style={{ color: Colors.white }}>Вернуться</Text>
			</Link>
		</View>
	);
}
