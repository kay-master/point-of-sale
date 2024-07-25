interface SuccessResponse<Result> {
	success: true;
	statusCode: number;
	message: string;
	data: Result;
}

export interface ErrorResponse {
	success: false;
	statusCode: number;
	message: string;
	errors:
		| Record<string, string>[]
		| {
				code: number;
				message: string;
		  };
}

export type ResponseData<Result> = SuccessResponse<Result> | ErrorResponse;

export const ERROR_CODES = {
	RECREATE_ACCOUNT: 1001,
	CREATE_ORGANIZATION: 1002,
};
