import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth/login';
import { login as loginService } from '../../services/auth/AuthService';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import styles from './login.module.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await loginService({ email, password }); // Backend deve retornar { token }
      login(result.token);
      navigate('/profile');
    } catch (err) {
      alert('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Login</h2>

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

        <Button label="Entrar" type="submit" />

        <p className={styles.registerLink}>
          Não possui uma conta? <a href="/register" className={styles.link}>Crie aqui</a>
        </p>
      </form>
    </div>
  );
};
