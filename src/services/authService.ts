
interface AuthResponse {
  success: boolean;
  data?: {
    nama: string;
    username: string;
    kelas: string;
    level: string;
  };
  message?: string;
}

export const authenticateUser = async (username: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbwz5mOYexwJvFj5dU27ZXGDeSsv2CcK0u2izWQpzUPqOzDE8UZFOAHOd7I6ON-uO7Fcuw/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'login',
        username,
        password
      })
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      message: 'Terjadi kesalahan saat menghubungi server'
    };
  }
};
