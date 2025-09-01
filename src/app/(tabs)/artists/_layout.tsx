import { Stack } from "expo-router";
import { View } from "react-native";

const ArtistsScreenLayout = () => {
	return (
		<View style={{ flex: 1, backgroundColor: "#eeeeee" }}>
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						headerTransparent: true,
						headerTitle: "Artists",
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

export default ArtistsScreenLayout;
