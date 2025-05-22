import { TextInput, TextInputProps, StyleSheet } from "react-native";
import { Colors } from "../tokens";

export function Input(props: TextInputProps & { isPassword?: boolean }) {
    return (
        <TextInput
            style={styles.input}
            placeholderTextColor={Colors.gray}
            {...props}
        />
    )
}

const styles = StyleSheet.create({
    input: {
        height: 58,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 24,
        backgroundColor: Colors.violetDark,
        fontSize: 16,
    }
});