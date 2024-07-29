export const SERVICE_URLS = {
	AUTH_SERVICE: "http://localhost:4001",
	ACCOUNT_SERVICE: "http://localhost:4002",
};

export type SERVICE = keyof typeof SERVICE_URLS;
