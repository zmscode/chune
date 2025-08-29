import { StyleSheet, View } from "react-native";

export const ItemDivider = () => {
	return (
		<View
			style={{
				borderColor: "#2d3538",
				borderWidth: StyleSheet.hairlineWidth,
				opacity: 0.3,
				marginVertical: 9,
				marginLeft: 60,
			}}
		/>
	);
};
