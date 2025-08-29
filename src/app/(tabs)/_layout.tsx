import { Tabs } from "expo-router";
import { HeartIcon } from "phosphor-react-native";

const TabsNavigation = () => {
	return (
		<>
			<Tabs
				screenOptions={{
					tabBarActiveTintColor: "#91dc6e",
					tabBarLabelStyle: {
						fontSize: 12,
						fontWeight: "500",
					},
					headerShown: false,
					tabBarStyle: {
						position: "absolute",
						borderTopLeftRadius: 20,
						borderTopRightRadius: 20,
						borderTopWidth: 0,
						paddingTop: 0,
						paddingBottom: 4,
					},
				}}
			>
				<Tabs.Screen
					name="favourites"
					options={{
						title: "Favourites",
						tabBarIcon: ({ color }: { color: string }) => (
							<HeartIcon size={24} color={color} />
						),
					}}
				/>
			</Tabs>
		</>
	);
};

export default TabsNavigation;
