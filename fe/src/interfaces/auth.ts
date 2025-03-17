export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthResponse {
  data: {
    statusCode: string;
    data: User;
    message: string;
    isAuthenticated?: boolean;
  };
}
