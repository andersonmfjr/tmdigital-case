export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    username: string;
    name: string;
    hasCompletedOnboarding: boolean;
  };
}
