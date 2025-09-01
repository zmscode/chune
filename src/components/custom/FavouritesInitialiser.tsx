import { useFavouritesStore } from "@/stores/favouritesStore";
import { ReactNode, useEffect } from "react";

export const FavouritesInitialiser = ({
	children,
}: {
	children: ReactNode;
}) => {
	const { isInitialised, initialiseFromLibrary } = useFavouritesStore();

	useEffect(() => {
		if (!isInitialised) {
			console.log("Initializing favourites from library.json...");
			initialiseFromLibrary();
		}
	}, [isInitialised, initialiseFromLibrary]);

	return <>{children}</>;
};
