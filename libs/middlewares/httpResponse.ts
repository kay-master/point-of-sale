export function successResponse<T>(data: T, message?: string) {
	return {
		success: true,
		message: message || "Success",
		data,
	};
}

export function errorResponse(message: string, errors?: any) {
	return {
		success: false,
		message,
		errors,
	};
}
