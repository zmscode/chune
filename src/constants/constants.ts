import { Image } from "react-native";
import UNKNOWN_SONG_IMAGE from "@/assets/unknown_song.png";
import UNKNOWN_ARTIST_IMAGE from "@/assets/unknown_artist.png";

export const UNKNOWN_SONG_IMAGE_URI =
	Image.resolveAssetSource(UNKNOWN_SONG_IMAGE).uri;

export const UNKNOWN_ARTIST_IMAGE_URI =
	Image.resolveAssetSource(UNKNOWN_ARTIST_IMAGE).uri;
