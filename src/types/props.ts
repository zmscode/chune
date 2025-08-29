import { Song } from "@/types";
import { StyleProps } from "react-native-reanimated";
import { FlatListProps, ViewStyle } from "react-native";

export type SideScrollingTextProps = {
	text: string;
	animationThreshold: number;
	style?: StyleProps;
};

export type PlayerControlsProps = {
	style?: ViewStyle;
	iconSize?: number;
};

export type SongListProps = Partial<FlatListProps<Song>> & {
	id: string;
	songs: Array<Song>;
	hideQueueControls?: boolean;
};

export type SongListItemProps = {
	song: Song;
	onSongSelect: (song: Song) => void;
};
