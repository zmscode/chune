import { Stack } from "expo-router";
import { View } from "react-native";

const SongsScreenLayout = () => {
	return (
		<View style={{ flex: 1, backgroundColor: "#eeeeee" }}>
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						headerLargeTitle: true,
						headerLargeStyle: {
							backgroundColor: "#eeeeee",
						},
						headerLargeTitleStyle: {
							color: "#171f21",
						},
						headerTintColor: "#171f21",
						headerTransparent: true,
						headerBlurEffect: "prominent",
						headerShadowVisible: false,
						headerTitle: "Songs",
					}}
				/>
			</Stack>
		</View>
	);
};

export default SongsScreenLayout;
