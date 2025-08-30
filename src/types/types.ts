import { SongRating } from "@/enums";
import { SheetDefinition } from "react-native-actions-sheet";

export type ColourScheme = "light" | "dark" | null;

export type RepeatMode = "off" | "song" | "queue";

export type QueueType = "playlist" | "album" | "artist" | "search" | "custom";

export type SheetData = {
	title: string;
	onOpen: () => void;
};

export interface Sheets {
	player: SheetDefinition;
}

export interface Song {
	uri: string;
	title: string;
	artist?: string;
	id?: string;
	album?: string;
	artwork?: string;
	duration?: number;
	description?: string;
	genre?: string;
	date?: string;
	rating?: SongRating;
	playlist?: Array<string>;
}

export interface PlaybackStatus {
	isLoading?: boolean;
	isPlaying?: boolean;
	isBuffering?: boolean;
	durationMillis?: number;
	positionMillis?: number;
	volume?: number;
	isMuted?: boolean;
	isLooping?: boolean;
	didJustFinish?: boolean;
}

export interface AudioState {
	currentSong: Song | null;
	queue: Array<Song>;
	isPlaying: boolean;
	position: number;
	duration: number;
	isLoading: boolean;
	repeatMode: RepeatMode;
	isShuffled: boolean;
	volume: number;

	setCurrentSong: (song: Song) => void;
	setQueue: (songs: Array<Song>) => void;
	setPlaybackStatus: (status: PlaybackStatus) => void;
	setRepeatMode: (mode: RepeatMode) => void;
	toggleShuffle: () => void;
	setVolume: (volume: number) => void;
}

export interface QueueMetadata {
	id: string;
	type: QueueType;
	name: string;
	source?: string;
}

export interface QueueStore {
	activeQueue: QueueMetadata | null;
	queueHistory: Array<QueueMetadata>;
	originalQueue: Array<Song> | null;
	upNext: Array<Song>;

	setActiveQueue: (metadata: QueueMetadata, songs: Song[]) => void;
	clearActiveQueue: () => void;
	addToUpNext: (song: Song) => void;
	removeFromUpNext: (songId: string) => void;
	clearUpNext: () => void;
	saveOriginalQueue: (songs: Song[]) => void;
	restoreOriginalQueue: () => Song[] | null;
	addToHistory: (metadata: QueueMetadata) => void;
	getPreviousQueue: () => QueueMetadata | null;
}

export interface DeviceState {
	os: string;
	isMobile: boolean;
	width: number;
	height: number;
	isPortrait: boolean;
}
