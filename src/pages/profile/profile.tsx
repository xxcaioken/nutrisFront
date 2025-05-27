import { useEffect, useState } from 'react';
import { getUserProfile, UserProfile, getUserSchools, UserSchool } from '../../services/profile/profileService';
import { Modal } from '../../components/common/Modal';
import { SpreadsheetModal } from '../../components/SpreadsheetModal/SpreadsheetModal';
import styles from './profile.module.css';

export const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [schools, setSchools] = useState<UserSchool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSpreadsheet, setSelectedSpreadsheet] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const profile = await getUserProfile();
        setUser(profile);
        
        const userSchools = await getUserSchools(profile.id);
        setSchools(userSchools);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Erro ao carregar dados do perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSpreadsheetClick = (link: string) => {
    setSelectedSpreadsheet(link);
  };

  const handleCloseModal = () => {
    setSelectedSpreadsheet(null);
  };

  if (loading) return <div className={styles.loading}>Carregando...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!user) return <div className={styles.error}>Usuário não encontrado</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Perfil</h2>
      
      <div className={styles.profileInfo}>
        <p><strong>Nome:</strong> {user.nome}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <div className={styles.schoolsSection}>
        <h3>Rotas</h3>
        {schools.length === 0 ? (
          <p>Nenhuma escola encontrada</p>
        ) : (
          <ul className={styles.schoolsList}>
            {schools.map(school => (
              <li key={school.id} className={styles.schoolItem}>
                <div className={styles.schoolHeader}>
                  <h4>{school.escola?.nome}</h4>
                  <span className={styles.schoolDate}>
                    Criado em: {formatDate(school.dataCriacao)}
                  </span>
                </div>
                <div className={styles.schoolDetails}>
                  <p>
                    <strong>Link das Planilhas:</strong>{' '}
                    <button 
                      className={styles.spreadsheetLink}
                      onClick={() => handleSpreadsheetClick(school.linkPlanilha)}
                    >
                      {school.linkPlanilha}
                    </button>
                  </p>
                  {school.dataAtualizacao && (
                    <p><strong>Última atualização:</strong> {formatDate(school.dataAtualizacao)}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal 
        isOpen={!!selectedSpreadsheet} 
        onClose={handleCloseModal}
        title="Planilha"
      >
        {selectedSpreadsheet && (
          <SpreadsheetModal spreadsheetUrl={selectedSpreadsheet} />
        )}
      </Modal>
    </div>
  );
};
