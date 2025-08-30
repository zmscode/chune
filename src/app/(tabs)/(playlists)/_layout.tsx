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
					}}
				/>
			</Stack>
		</View>
	);
};

export default PlaylistsScreenLayout;
