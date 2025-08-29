import { SongRating } from "@/enums";

export type ColourScheme = "light" | "dark" | null;

export type RepeatMode = "off" | "song" | "queue";

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

	setCurrentSong: (song: Song) => void;
	setQueue: (songs: Array<Song>) => void;
	setPlaybackStatus: (status: PlaybackStatus) => void;
	setRepeatMode: (mode: RepeatMode) => void;
	toggleShuffle: () => void;
}

export interface DeviceState {
	os: string;
	width: number;
	height: number;
	isPortrait: boolean;
}

// export default interface AudioPlayer {
// 	setupPlayer(options: number): Promise<void>;
// 	updateOptions(options: number): Promise<void>;

// 	load(song: Song): Promise<number | void>;
// 	reset(): Promise<void>;
// 	play(): Promise<void>;
// 	pause(): Promise<void>;
// 	stop(): Promise<void>;
// 	setPlayWhenReady(playWhenReady: boolean): Promise<boolean>;
// 	getPlayWhenReady(): Promise<boolean>;
// 	seekTo(position: number): Promise<void>;
// 	seekBy(offset: number): Promise<void>;
// 	setVolume(level: number): Promise<void>;
// 	getVolume(): Promise<number>;
// 	setRate(rate: number): Promise<void>;
// 	getRate(): Promise<number>;
// 	getProgress(): Promise<number>;
// 	getPlaybackState(): Promise<number>;
// 	retry(): Promise<void>;

// 	add(songs: Array<Song>, insertBeforeIndex?: number): Promise<number | void>;
// 	move(fromIndex: number, toIndex: number): Promise<void>;
// 	remove(indexes: Array<number>): Promise<void>;
// 	removeUpcomingSongs(): Promise<void>;
// 	skip(index: number, initialPosition?: number): Promise<void>;
// 	skipToNext(initialPosition?: number): Promise<void>;
// 	skipToPrevious(initialPosition?: number): Promise<void>;
// 	updateMetadataForSong(songIndex: number, metadata: number): Promise<void>;
// 	updateNowPlayingMetadata(metadata: number): Promise<void>;
// 	setQueue(songs: Array<Song>): Promise<void>;
// 	getQueue(): Promise<Array<Song>>;
// 	setRepeatMode(mode: number): Promise<number>;
// 	getRepeatMode(): Promise<number>;
// 	getSong(index: number): Promise<Song | undefined>;
// 	getActiveSongIndex(): Promise<number | undefined>;
// 	getActiveSong(): Promise<Song | undefined>;

// 	addListener(eventName: string): void;
// 	removeListeners(count: number): void;

// 	acquireWakeLock(): Promise<void>;
// 	abandonWakeLock(): Promise<void>;
// 	validateOnStartCommandIntent(): Promise<boolean>;
// }
