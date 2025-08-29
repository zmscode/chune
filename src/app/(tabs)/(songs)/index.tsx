import { View, Text, ScrollView } from "react-native";

const SongsScreen = () => {
	return (
		<View
			style={{
				flex: 1,
				backgroundColor: "#eeeeee",
			}}
		>
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				style={{ paddingHorizontal: 24 }}
			>
				<Text></Text>
			</ScrollView>
		</View>
	);
};

export default SongsScreen;
