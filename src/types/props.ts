import { QueueType, Song } from "@/types";
import { ReactNode } from "react";
import { Easing, StyleProps } from "react-native-reanimated";
import {
	FlatListProps,
	ViewStyle,
	TextProps,
	StyleProp,
	TextStyle,
} from "react-native";

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
	queueName?: string;
	queueType?: QueueType;
};

export type SongListItemProps = {
	song: Song;
	onSongSelect: (song: Song) => void;
	isPlaying?: boolean;
	isActiveQueue?: boolean;
};

export type PlaylistListProps = Partial<FlatListProps<string>> & {
	onPlaylistSelect?: (playlistName: string) => void;
	hideEmptyPlaylists?: boolean;
};

export type PlaylistListItemProps = {
	playlistName: string;
	onPlaylistSelect: (playlistName: string) => void;
	showSongCount?: boolean;
};
