import { Stack } from "expo-router";
import { View } from "react-native";

const PlaylistsScreenLayout = () => {
	return (
		<View style={{ flex: 1, backgroundColor: "#eeeeee" }}>
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						headerTransparent: true,
						headerTitle: "Playlists",
						headerShown: false,
					}}
				/>

				<Stack.Screen
					name="[name]"
					options={{
						headerTitle: "",
						headerBackVisible: true,
						headerStyle: {
							backgroundColor: "#eeeeee",
						},
						headerTintColor: "#171f21",
					}}
				/>
			</Stack>
		</View>
	);
};

export default PlaylistsScreenLayout;
