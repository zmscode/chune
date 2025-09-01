import { useFavourites } from "@/hooks/audio/useFavourites";
import { FavouriteButtonProps } from "@/props";
import { HeartIcon } from "phosphor-react-native";
import { useRef } from "react";
import { Animated, TouchableOpacity } from "react-native";

export const FavouriteButton = ({
	song,
	size = 26,
	style,
}: FavouriteButtonProps) => {
	const { isFavourite, toggleFavourite } = useFavourites();
	const scaleAnim = useRef(new Animated.Value(1)).current;

	const isLiked = song ? isFavourite(song) : false;

	const handlePress = () => {
		if (!song) return;

		Animated.sequence([
			Animated.timing(scaleAnim, {
				toValue: 1.2,
				duration: 100,
				useNativeDriver: true,
			}),
			Animated.timing(scaleAnim, {
				toValue: 1,
				duration: 100,
				useNativeDriver: true,
			}),
		]).start();

		toggleFavourite(song);
	};

	return (
		<TouchableOpacity
			activeOpacity={0.7}
			onPress={handlePress}
			disabled={!song?.id}
			hitSlop={{
				top: 10,
				bottom: 10,
				left: 10,
				right: 10,
			}}
			style={style}
		>
			<Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
				<HeartIcon
					size={size}
					color={isLiked ? "#f86370" : "#2b2e2f"}
				/>
			</Animated.View>
		</TouchableOpacity>
	);
};
