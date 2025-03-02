const API_URL = '';  // Usando caminho relativo para o proxy do Vite

async function handleResponse(response: Response) {
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Não autorizado');
    }
    const error = await response.json().catch(() => ({ message: 'Erro na requisição' }));
    throw new Error(error.message || 'Erro na requisição');
  }
  return response.json();
}

const api = {
  async get<T>(endpoint: string): Promise<T> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Erro na requisição GET:', error);
      throw error;
    }
  },

  async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Erro na requisição POST:', error);
      throw error;
    }
  },

  async put<T>(endpoint: string, data: any): Promise<T> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Erro na requisição PUT:', error);
      throw error;
    }
  },

  async delete(endpoint: string): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Erro na requisição DELETE:', error);
      throw error;
    }
  }
};

export default api;
