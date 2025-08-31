import { Stack } from "expo-router";
import { View } from "react-native";

export const unstable_settings = {
	initialRouteName: "index",
};

const SongsScreenLayout = () => {
	return (
		<View style={{ flex: 1, backgroundColor: "#eeeeee" }}>
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						headerTransparent: true,
						headerTitle: "Songs",
					}}
				/>
			</Stack>
		</View>
	);
};

export default SongsScreenLayout;
