import { Stack } from "expo-router";
import { View } from "react-native";

const FavouritesScreenLayout = () => {
	return (
		<View style={{ flex: 1, backgroundColor: "#eeeeee" }}>
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						headerTransparent: true,
						headerTitle: "Favourites",
					}}
				/>
			</Stack>
		</View>
	);
};

export default FavouritesScreenLayout;
