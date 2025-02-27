type BaseResponseFields = {
  status: 'success' | 'error';
};

type SuccessResponse<T> = BaseResponseFields & {
  status: 'success';
  data: T;
};

type ErrorResponse = BaseResponseFields & {
  status: 'error';
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
};

export type APIResponse<T> = SuccessResponse<T> | ErrorResponse;

function isErrorResponse<T>(
  response: APIResponse<T>
): response is ErrorResponse {
  return response.status === 'error';
}

export default function resp<T>(options: APIResponse<T>) {
  if (isErrorResponse(options)) {
    return {
      status: options.status,
      error: {
        code: options.error.code,
        message: options.error.message,
        details: options.error.details,
      },
    };
  }

  return {
    status: options.status,
    data: options.data,
  };
}
