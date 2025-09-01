import { ArtistListItemProps } from "@/props";
import { Image } from "expo-image";
import { UserCircleIcon } from "phosphor-react-native";
import { Text, TouchableHighlight, View } from "react-native";

export const ArtistListItem = ({
	artist,
	onArtistSelect,
	showSongCount = true,
}: ArtistListItemProps) => {
	const renderArtworkImage = () => {
		if (artist.artwork) {
			return (
				<Image
					source={{ uri: artist.artwork }}
					style={{
						borderRadius: 20,
						width: 40,
						height: 40,
					}}
				/>
			);
		}

		return (
			<View
				style={{
					width: 40,
					height: 40,
					borderRadius: 20,
					backgroundColor: "#d9d9d9",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<UserCircleIcon size={24} color="#2d3538" />
			</View>
		);
	};

	return (
		<TouchableHighlight
			onPress={() => onArtistSelect(artist)}
			underlayColor="#f5f5f5"
			activeOpacity={0.8}
		>
			<View
				style={{
					flexDirection: "row",
					columnGap: 14,
					alignItems: "center",
				}}
			>
				{renderArtworkImage()}

				<View style={{ flex: 1 }}>
					<Text
						numberOfLines={1}
						style={{
							fontSize: 17,
							fontWeight: "600",
							color: "#171f21",
							maxWidth: "80%",
						}}
					>
						{artist.name}
					</Text>

					{showSongCount && (
						<Text
							style={{
								color: "#2d3538",
								fontSize: 13,
								marginTop: 2,
								opacity: 0.7,
							}}
						>
							{artist.songCount}{" "}
							{artist.songCount === 1 ? "song" : "songs"}
						</Text>
					)}
				</View>
			</View>
		</TouchableHighlight>
	);
};
