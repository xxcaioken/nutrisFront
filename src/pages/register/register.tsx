import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register as registerService } from '../../services/register/register';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerService({ email, password, nome });
      navigate('/login');
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={{ marginBottom: '1rem' }}>Criar Conta</h2>

        <Input
          label="Nome"
          type="text"
          value={nome}
          onChange={e => setNome(e.target.value)}
          required
        />

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <Input
          label="Senha"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <Button label="Registrar" type="submit" />

        <p style={styles.loginLink}>
          Já possui uma conta? <a href="/" style={styles.link}>Faça login aqui</a>
        </p>
      </form>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
  },
  form: {
    width: '100%',
    maxWidth: '400px',
    padding: '2rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  loginLink: {
    marginTop: '1rem',
    textAlign: 'center',
    fontSize: '0.9rem',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  },
};