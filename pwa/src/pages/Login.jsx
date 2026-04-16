import { useState } from 'react';
import { login, register } from '../api';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(username, password);
      } else {
        await register(username, password);
        await login(username, password);
      }
      onLogin();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Wystąpił błąd podczas logowania / rejestracji.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel auth-box">
        <div className="auth-header">
          <h1>{isLogin ? 'Zaloguj się' : 'Stwórz konto'}</h1>
          <p style={{color: 'var(--text-secondary)'}}>
            Wyśmienita pogoda na wyciągnięcie ręki.
          </p>
        </div>
        
        {error && <div className="error-msg">{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Nazwa użytkownika" 
            value={username}
            onChange={e => setUsername(e.target.value)}
            required 
          />
          <input 
            type="password" 
            className="input-field" 
            placeholder="Hasło" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            required 
          />
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Przetwarzanie...' : (isLogin ? 'Zaloguj się' : 'Zarejestruj się')}
          </button>
        </form>
        
        <div style={{textAlign: 'center', marginTop: '1rem'}}>
          <button 
            type="button" 
            className="btn" 
            style={{background: 'transparent', color: 'var(--accent)', padding: 0}}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Nie masz konta? Zarejestruj się.' : 'Masz już konto? Zaloguj się.'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
