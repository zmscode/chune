import { StyleSheet } from "react-native";

export const floatingPlayerStyles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#b8b8b8",
		padding: 8,
		borderRadius: 12,
		paddingVertical: 10,
	},
	trackArtworkImage: {
		width: 40,
		height: 40,
		borderRadius: 8,
	},
	trackTitleContainer: {
		flex: 1,
		overflow: "hidden",
		marginLeft: 10,
	},
	trackTitle: {
		fontSize: 18,
		color: "#171f21",
		fontWeight: "600",
		paddingLeft: 10,
	},
	trackControlsContainer: {
		flexDirection: "row",
		alignItems: "center",
		columnGap: 20,
		marginRight: 16,
		paddingLeft: 16,
	},
});
