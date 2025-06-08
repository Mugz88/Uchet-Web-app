import { View, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import CloseIcon from '../../../../assets/icons/close';

export function CloseDrawer() {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <Pressable onPress={() => navigation.closeDrawer()}>
      <View style={styles.button}>
        <CloseIcon />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    right: 20,
  },
});
