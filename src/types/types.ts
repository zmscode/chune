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
	rating?: number;
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

export interface Artist {
	name: string;
	songCount: number;
	songs: Array<Song>;
	artwork?: string;
}

export interface AudioState {
	currentSong: any | null;
	queue: Array<any>;
	isPlaying: boolean;
	position: number;
	duration: number;
	isLoading: boolean;
	repeatMode: "off" | "song" | "queue";
	isShuffled: boolean;
	volume: number;
	isSeeking: boolean;

	setCurrentSong: (song: any) => void;
	setQueue: (songs: Array<any>) => void;
	setPlaybackStatus: (status: any) => void;
	setRepeatMode: (mode: "off" | "song" | "queue") => void;
	toggleShuffle: () => void;
	setVolume: (volume: number) => void;
	setIsSeeking: (isSeeking: boolean) => void;
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

	setActiveQueue: (metadata: QueueMetadata, songs: Array<Song>) => void;
	clearActiveQueue: () => void;
	addToUpNext: (song: Song) => void;
	removeFromUpNext: (songId: string) => void;
	clearUpNext: () => void;
	saveOriginalQueue: (songs: Array<Song>) => void;
	restoreOriginalQueue: () => Array<Song> | null;
	addToHistory: (metadata: QueueMetadata) => void;
	getPreviousQueue: () => QueueMetadata | null;
}

export interface FavouritesState {
	favouriteIds: Set<string>;
	isInitialised: boolean;
	initialiseFromLibrary: () => void;
	addFavourite: (songId: string) => void;
	removeFavourite: (songId: string) => void;
	toggleFavourite: (songId: string) => boolean;
	isFavourite: (songId: string) => boolean;
	clearFavourites: () => void;
	getFavouriteCount: () => number;
}

export interface DeviceState {
	os: string;
	isMobile: boolean;
	width: number;
	height: number;
	isPortrait: boolean;
}
