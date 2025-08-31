import { Song } from "@/types";
import { createAudioPlayer } from "expo-audio";
import { useEffect, useState } from "react";

export const usePlaylistDuration = (songs: Array<Song>) => {
	const [totalDuration, setTotalDuration] =
		useState<string>("Calculating...");

	useEffect(() => {
		const fetchDurations = async () => {
			let total = 0;

			for (const song of songs) {
				try {
					const tempPlayer = createAudioPlayer({ uri: song.uri });

					await new Promise<void>((resolve) => {
						const checkDuration = setInterval(() => {
							const status = tempPlayer.currentStatus;
							if (status && status.duration) {
								total += status.duration;
								clearInterval(checkDuration);
								tempPlayer.remove();
								resolve();
							}
						}, 100);

						setTimeout(() => {
							clearInterval(checkDuration);
							tempPlayer.remove();
							resolve();
						}, 10000);
					});
				} catch (error) {
					console.warn(`Error loading ${song.title}:`, error);
				}
			}

			const totalMinutes = Math.round(total / 60);

			if (totalMinutes < 60) {
				setTotalDuration(`${totalMinutes} min`);
			} else {
				const hours = Math.floor(totalMinutes / 60);
				const minutes = totalMinutes % 60;
				setTotalDuration(`${hours} hr ${minutes} min`);
			}
		};

		if (songs.length > 0) {
			fetchDurations();
		}
	}, [songs]);

	return totalDuration;
};
