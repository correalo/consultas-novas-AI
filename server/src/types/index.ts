export interface UserRequest extends Express.Request {
  user?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface ErrorResponse {
  message: string;
  error?: string;
}
