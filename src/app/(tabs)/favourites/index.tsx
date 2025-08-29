import { useMemo } from "react";
import { ScrollView, View } from "react-native";

const FavouritesScreen = () => {
	return (
		<View style={defaultStyles.container}>
			<ScrollView
				style={{ paddingHorizontal: { horizontal: 24 } }}
				contentInsetAdjustmentBehavior="automatic"
			></ScrollView>
		</View>
	);
};

export default FavouritesScreen;
