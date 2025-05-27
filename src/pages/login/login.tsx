import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/auth/login';
import { login as loginService, loginByGoogle } from '../../services/auth/AuthService';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { GoogleButton } from '../../components/common/GoogleButton';
import styles from './login.module.css';
import { message } from 'antd';
import { HeartOutlined } from '@ant-design/icons';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const redirect = (isAdmin:boolean)=>{
    if(isAdmin){
      navigate('/adm');
    } else{
      navigate('/profile');
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await loginService({ email, password });
      login(result.token);
      redirect(!!result.user.isAdmin);
    } catch (err) {
      message.error('Erro ao fazer login. Verifique suas credenciais. :' + err);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${response.access_token}` }
        }).then(res => res.json());

        const result = await loginByGoogle({ 
          googleToken: response.access_token,
          email: userInfo.email,
          password:"123GOOGLEPASSWORD**"
        });
        login(result.token);
        redirect(!!result.user.isAdmin);
      } catch (err) {
        message.error('Erro ao fazer login com Google.' + err);
      }
    },
    onError: (error) => {
      message.error('Erro ao fazer login com Google.' + error);
    },
    flow: 'implicit',
    scope: 'email profile',
  });

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.logoContainer}>
          <HeartOutlined className={styles.logo} />
          <h1 className={styles.appName}>NutriS</h1>
        </div>
        
        <h2 className={styles.title}>Bem-vindo(a)</h2>
        <p className={styles.subtitle}>Faça login para acessar sua conta</p>

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

        <div className={styles.divider}>
          <span>ou</span>
        </div>

        <GoogleButton onClick={() => handleGoogleLogin()} />
      </form>
    </div>
  );
};
