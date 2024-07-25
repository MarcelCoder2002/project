import { createContext, useContext } from "react";

export const NotificationContext = createContext(null);

export default function useNotification() {
	return useContext(NotificationContext);
}

export function show(options) {
	return useNotification().show(options);
}
