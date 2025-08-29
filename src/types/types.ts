export interface Track {
	url: string;
	title: string;
	artist?: string;
	artwork?: string;
	rating?: number;
	playlist?: Array<string>;
}

export interface AudioPlayerState {
	currentTrack: Track | null;
	currentTrackIndex: number;

	isPlaying: boolean;
	isLoading: boolean;
	isBuffering: boolean;

	duration: number;
	currentTime: number;
	playbackRate: number;
	volume: number;

	queue: Array<Track>;
	shuffleMode: boolean;
	repeatMode: "off" | "track" | "queue";

	playbackHistory: Array<Track>;

	seekTarget: number | null;

	initializeAudio: () => Promise<void>;
	loadTrack: (track: Track, autoPlay?: boolean) => void;
	setIsPlaying: (playing: boolean) => void;
	setSeekTarget: (seconds: number) => void;
	clearSeekTarget: () => void;
	skipToNext: () => void;
	skipToPrevious: () => void;

	setQueue: (tracks: Array<Track>) => void;
	addToQueue: (track: Track) => void;
	removeFromQueue: (index: number) => void;
	clearQueue: () => void;
	playTrackAtIndex: (index: number) => void;

	setVolume: (volume: number) => void;
	setPlaybackRate: (rate: number) => void;
	toggleShuffle: () => void;
	cycleRepeatMode: () => void;

	updatePlaybackProgress: (currentTime: number, duration: number) => void;
	setIsBuffering: (buffering: boolean) => void;
	setIsLoading: (loading: boolean) => void;
	handleTrackEnd: () => void;

	reset: () => void;
}
