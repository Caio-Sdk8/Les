import api from "../requests/api";

export interface LoginResponse {
  token: string;
  expiresAt: string;
  user: {
    uuid: string;
    email: string;
    roles: string[];
  };
}

const TOKEN_KEY = "pharma_token";
const USER_KEY = "pharma_user";

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      "/api/auth/login",
      {
        email,
        password,
      },
      {
        skipGlobalErrorHandler: true,
      },
    );
    authService.saveSession(response.data);
    return response.data;
  },

  saveSession(data: LoginResponse) {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser(): LoginResponse["user"] | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  isAuthenticated(): boolean {
    return !!authService.getToken();
  },

  hasRole(role: string): boolean {
    const user = authService.getUser();
    return user?.roles?.includes(role) ?? false;
  },

  hasAnyRole(...roles: string[]): boolean {
    const user = authService.getUser();
    return roles.some((r) => user?.roles?.includes(r)) ?? false;
  },
};
