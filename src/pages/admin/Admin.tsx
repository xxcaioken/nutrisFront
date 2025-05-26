import { useEffect, useState } from 'react';
import { getUserProfile, UserProfile } from '../../services/profile/profileService';
import styles from './Admin.module.css';

export const Admin = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const profile = await getUserProfile();
        setUser(profile);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Erro ao carregar dados do perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className={styles.loading}>Carregando...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!user) return <div className={styles.error}>Usuário não encontrado</div>;
  if (!user.isAdmin) return <div className={styles.error}>Acesso não autorizado</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Painel Administrativo</h2>
      
      <div className={styles.adminInfo}>
        <p><strong>Nome:</strong> {user.nome}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Função:</strong> Administrador</p>
      </div>

      <div className={styles.adminSection}>
        <h3>Gerenciamento de Escolas</h3>
        <div className={styles.actions}>
          <button className={styles.actionButton}>
            Adicionar Nova Escola
          </button>
          <button className={styles.actionButton}>
            Listar Escolas
          </button>
        </div>
      </div>

      <div className={styles.adminSection}>
        <h3>Gerenciamento de Usuários</h3>
        <div className={styles.actions}>
          <button className={styles.actionButton}>
            Listar Usuários
          </button>
          <button className={styles.actionButton}>
            Gerenciar Permissões
          </button>
        </div>
      </div>
    </div>
  );
}; 