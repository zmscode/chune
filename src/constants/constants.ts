import { Image } from "react-native";
import UNKNOWN_TRACK_IMAGE from "@/assets/unknown_track.png";
import UNKNOWN_ARTIST_IMAGE from "@/assets/unknown_artist.png";

export const UNKNOWN_TRACK_IMAGE_URI =
	Image.resolveAssetSource(UNKNOWN_TRACK_IMAGE).uri;

export const UNKNOWN_ARTIST_IMAGE_URI =
	Image.resolveAssetSource(UNKNOWN_ARTIST_IMAGE).uri;
