import { useEffect, useState } from 'react';
import { getUserProfile, UserProfile } from '../../services/profile/profileService';
import { schoolService, EscolaDTO } from '../../services/school/schoolService';
import styles from './Admin.module.css';
import SchoolListModal from '../../components/SchoolListModal';
import SchoolForm from '../../components/SchoolForm';
import { message } from 'antd';

export const Admin = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSchoolListOpen, setIsSchoolListOpen] = useState(false);
  const [isSchoolFormOpen, setIsSchoolFormOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<EscolaDTO | undefined>(undefined);

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

  const handleAddSchool = async (values: Omit<EscolaDTO, 'id' | 'dataCriacao'>) => {
    try {
      await schoolService.create(values);
      message.success('Escola adicionada com sucesso!');
      setIsSchoolFormOpen(false);
      if (isSchoolListOpen) {
        const event = new Event('schoolListRefresh');
        window.dispatchEvent(event);
      }
    } catch (error) {
      message.error('Erro ao adicionar escola');
    }
  };

  const handleEditSchool = async (values: Omit<EscolaDTO, 'id' | 'dataCriacao'>) => {
    if (!selectedSchool) return;
    
    try {
      await schoolService.update(selectedSchool.id, values);
      message.success('Escola atualizada com sucesso!');
      setIsSchoolFormOpen(false);
      setSelectedSchool(undefined);
      if (isSchoolListOpen) {
        const event = new Event('schoolListRefresh');
        window.dispatchEvent(event);
      }
    } catch (error) {
      message.error('Erro ao atualizar escola');
    }
  };

  const handleEdit = (school: EscolaDTO) => {
    setSelectedSchool(school);
    setIsSchoolFormOpen(true);
  };

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
          <button 
            className={styles.actionButton}
            onClick={() => {
              setSelectedSchool(undefined);
              setIsSchoolFormOpen(true);
            }}
          >
            Adicionar Nova Escola
          </button>
          <button 
            className={styles.actionButton}
            onClick={() => setIsSchoolListOpen(true)}
          >
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

      <SchoolListModal
        isOpen={isSchoolListOpen}
        onClose={() => setIsSchoolListOpen(false)}
        onEdit={handleEdit}
      />

      <SchoolForm
        isOpen={isSchoolFormOpen}
        onClose={() => {
          setIsSchoolFormOpen(false);
          setSelectedSchool(undefined);
        }}
        onSubmit={selectedSchool ? handleEditSchool : handleAddSchool}
        initialValues={selectedSchool}
      />
    </div>
  );
}; 