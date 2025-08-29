import { Stack } from "expo-router";
import { View } from "react-native";

const FavouritesScreenLayout = () => {
	return (
		<View style={{ flex: 1, backgroundColor: themeColours.background }}>
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						headerLargeTitle: true,
						headerLargeStyle: {
							backgroundColor: themeColours.background,
						},
						headerLargeTitleStyle: {
							color: textColours.text,
						},
						headerTintColor: textColours.text,
						headerTransparent: true,
						headerBlurEffect: "prominent",
						headerShadowVisible: false,
						headerTitle: "Favourites",
					}}
				/>
			</Stack>
		</View>
	);
};

export default FavouritesScreenLayout;
