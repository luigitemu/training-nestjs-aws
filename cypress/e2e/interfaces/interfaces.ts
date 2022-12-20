export interface CreateUserResponse {
  status: number;
  body: {
    token: string;
    fullName: string;
    email: string;
    roles: string[];
    id: number;
  };
}
