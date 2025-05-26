import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth/login';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { message } from 'antd';
import styles from './register.module.css';
import { register } from '../../services/register/register';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await register({ email, password, nome });
      login(result.token);
      navigate('/profile');
    } catch (err) {
      message.error('Erro ao criar conta. Verifique os dados informados.');
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Criar Conta</h2>

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

        <p className={styles.loginLink}>
          Já possui uma conta? <a href="/" className={styles.link}>Faça login aqui</a>
        </p>
      </form>
    </div>
  );
};