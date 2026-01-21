import { 
  User, 
  AuthResponse, 
  RegisterRequest, 
  LoginRequest, 
  Pflanze, 
  Eigenschaft, 
  Standort, 
  Bestand,
  CreateBestandRequest 
} from '../types/api';

const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    
    this.token = localStorage.getItem('auth_token');
  }

  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

   
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }


  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(data),
    });

    const result = await this.handleResponse<AuthResponse>(response);
    this.setToken(result.token);
    return result;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(data),
    });

    

    const result = await this.handleResponse<AuthResponse>(response);
    this.setToken(result.token);
    return result;
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  async getProfile(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/mitglied/me`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse<User>(response);
  }

  async updateProfile(data: Partial<User>): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/mitglied/me`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<void>(response);
  }

  // Pflanzen
  async getPflanzen(): Promise<Pflanze[]> {
    const response = await fetch(`${API_BASE_URL}/pflanzen`, {
      headers: this.getHeaders(false),
    });

    return this.handleResponse<Pflanze[]>(response);
  }

  async getPflanze(id: number): Promise<Pflanze> {
    const response = await fetch(`${API_BASE_URL}/pflanzen/${id}`, {
      headers: this.getHeaders(false),
    });

    return this.handleResponse<Pflanze>(response);
  }

async createStandort(data: { bezeichnung: string; beschreibung?: string }) {
  const res = await fetch(`${API_BASE_URL}/standort`, {
    method : 'POST',
    headers: this.getHeaders(),
    body   : JSON.stringify(data),
  });
  return this.handleResponse<Standort>(res);
}


  // Eigenschaften
  async getEigenschaften(): Promise<Eigenschaft[]> {
    const response = await fetch(`${API_BASE_URL}/eigenschaften`, {
      headers: this.getHeaders(false),
    });

    return this.handleResponse<Eigenschaft[]>(response);
  }

  // Standorte
async getStandorte(): Promise<Standort[]> {
  const response = await fetch(`${API_BASE_URL}/standort`, {
    headers: this.getHeaders(),        
  });

  return this.handleResponse<Standort[]>(response);
}


  async getStandort(id: number): Promise<Standort> {
    const response = await fetch(`${API_BASE_URL}/standort/${id}`, {
      headers: this.getHeaders(false),
    });

    return this.handleResponse<Standort>(response);
  }

  // Bestand
  async getBestand(): Promise<Bestand[]> {
    const response = await fetch(`${API_BASE_URL}/bestand`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse<Bestand[]>(response);
  }

  async createBestand(data: CreateBestandRequest): Promise<Bestand> {
    const response = await fetch(`${API_BASE_URL}/bestand`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<Bestand>(response);
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`, {
      headers: this.getHeaders(false),
    });

    return this.handleResponse<{ status: string; message: string }>(response);
  }
}

export const apiService = new ApiService();