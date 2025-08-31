import { StyleSheet } from "react-native";

export const floatingPlayerStyles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: "#b8b8b8",
		padding: 8,
		borderRadius: 12,
		paddingVertical: 10,
	},
	songArtworkImage: {
		width: 40,
		height: 40,
		borderRadius: 8,
	},
	songTitleContainer: {
		flex: 1,
		overflow: "hidden",
		marginLeft: 10,
		justifyContent: "center",
	},
	songTitle: {
		fontSize: 18,
		color: "#171f21",
		fontWeight: "600",
		paddingLeft: 10,
	},
	songControlsContainer: {
		flexDirection: "row",
		alignItems: "center",
		columnGap: 12,
		flexShrink: 0,
		paddingRight: 16,
	},
});
