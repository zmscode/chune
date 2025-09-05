import TrackPlayer, { Event, Position } from "react-native-track-player";

export async function PlaybackService() {
	TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
	TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
	TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.stop());
	TrackPlayer.addEventListener(Event.RemoteNext, () =>
		TrackPlayer.skipToNext()
	);
	TrackPlayer.addEventListener(Event.RemotePrevious, () =>
		TrackPlayer.skipToPrevious()
	);
	TrackPlayer.addEventListener(Event.RemoteSeek, ({ position }: Position) =>
		TrackPlayer.seekTo(position)
	);
	TrackPlayer.addEventListener(
		Event.RemoteJumpForward,
		async ({ interval }: Position) => {
			const progress = await TrackPlayer.getProgress();
			await TrackPlayer.seekTo(progress.position + interval);
		}
	);
	TrackPlayer.addEventListener(
		Event.RemoteJumpBackward,
		async ({ interval }: Position) => {
			const progress = await TrackPlayer.getProgress();
			await TrackPlayer.seekTo(progress.position - interval);
		}
	);
}
