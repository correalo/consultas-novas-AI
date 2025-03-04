export async function handleResponse(response: Response) {
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Não autorizado');
    }
    
    const error = await response.json().catch(() => ({ message: 'Erro na requisição' }));
    console.error('Erro na resposta:', error);
    throw new Error(error.message || `Erro ${response.status}: ${response.statusText}`);
  }
  
  // Para respostas vazias (como em DELETE)
  if (response.status === 204) {
    return null;
  }
  
  try {
    return await response.json();
  } catch (error) {
    console.error('Erro ao parsear JSON:', error);
    throw new Error('Erro ao processar resposta do servidor');
  }
}
