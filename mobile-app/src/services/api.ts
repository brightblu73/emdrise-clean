import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  private async getAuthHeaders() {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };
    } catch (error) {
      return {
        'Content-Type': 'application/json'
      };
    }
  }

  async request(endpoint: string, options: RequestInit = {}) {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error(`API request failed:`, error);
      throw error;
    }
  }

  // Authentication
  async login(credentials: { email: string; password: string }) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      await AsyncStorage.setItem('authToken', response.token);
    }
    
    return response;
  }

  async logout() {
    await AsyncStorage.removeItem('authToken');
    return this.request('/auth/logout', { method: 'POST' });
  }

  async getCurrentUser() {
    return this.request('/auth/user');
  }

  // EMDR Sessions
  async createSession(data: any) {
    return this.request('/emdr/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSession(sessionId: string, data: any) {
    return this.request(`/emdr/sessions/${sessionId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async getSession(sessionId: string) {
    return this.request(`/emdr/sessions/${sessionId}`);
  }

  async getCurrentSession() {
    return this.request('/emdr/sessions/current');
  }

  // Session Notes
  async saveSessionNotes(sessionId: string, notes: string) {
    return this.request(`/emdr/sessions/${sessionId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  }

  async getSessionNotes(sessionId: string) {
    return this.request(`/emdr/sessions/${sessionId}/notes`);
  }
}

export const apiService = new ApiService();