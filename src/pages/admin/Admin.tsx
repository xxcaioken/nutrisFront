import { useEffect, useState } from 'react';
import { getUserProfile, UserProfile } from '../../services/profile/profileService';
import { schoolService, EscolaDTO } from '../../services/school/schoolService';
import { userService, UserDTO } from '../../services/user/userService';
import { userSchoolService, UserSchoolDTO } from '../../services/userSchool/userSchoolService';
import styles from './Admin.module.css';
import SchoolListModal from '../../components/SchoolListModal';
import SchoolForm from '../../components/SchoolForm';
import UserListModal from '../../components/UserListModal';
import UserForm from '../../components/UserForm';
import UserSchoolListModal from '../../components/UserSchoolListModal';
import UserSchoolForm from '../../components/UserSchoolForm';
import { message } from 'antd';

export const Admin = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSchoolListOpen, setIsSchoolListOpen] = useState(false);
  const [isSchoolFormOpen, setIsSchoolFormOpen] = useState(false);
  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [isUserSchoolListOpen, setIsUserSchoolListOpen] = useState(false);
  const [isUserSchoolFormOpen, setIsUserSchoolFormOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<EscolaDTO | undefined>(undefined);
  const [selectedUser, setSelectedUser] = useState<UserDTO | undefined>(undefined);
  const [selectedUserSchool, setSelectedUserSchool] = useState<UserSchoolDTO | undefined>(undefined);

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

  const handleAddUser = async (values: Omit<UserDTO, 'id'>) => {
    try {
      await userService.create(values);
      message.success('Usuário adicionado com sucesso!');
      setIsUserFormOpen(false);
      if (isUserListOpen) {
        const event = new Event('userListRefresh');
        window.dispatchEvent(event);
      }
    } catch (error) {
      message.error('Erro ao adicionar usuário');
    }
  };

  const handleEditUser = async (values: Omit<UserDTO, 'id'>) => {
    if (!selectedUser) return;
    
    try {
      await userService.update(selectedUser.id, values);
      message.success('Usuário atualizado com sucesso!');
      setIsUserFormOpen(false);
      setSelectedUser(undefined);
      if (isUserListOpen) {
        const event = new Event('userListRefresh');
        window.dispatchEvent(event);
      }
    } catch (error) {
      message.error('Erro ao atualizar usuário');
    }
  };

  const handleEditUserClick = (user: UserDTO) => {
    setSelectedUser(user);
    setIsUserFormOpen(true);
  };

  const handleAddUserSchool = async (values: Omit<UserSchoolDTO, 'id' | 'dataCriacao' | 'dataAtualizacao'>) => {
    try {
      await userSchoolService.create(values);
      message.success('Vínculo adicionado com sucesso!');
      setIsUserSchoolFormOpen(false);
      if (isUserSchoolListOpen) {
        const event = new Event('userSchoolListRefresh');
        window.dispatchEvent(event);
      }
    } catch (error) {
      message.error('Erro ao adicionar vínculo');
    }
  };

  const handleEditUserSchool = async (values: Omit<UserSchoolDTO, 'id' | 'dataCriacao' | 'dataAtualizacao'>) => {
    if (!selectedUserSchool) return;
    
    try {
      await userSchoolService.update(selectedUserSchool.id, values);
      message.success('Vínculo atualizado com sucesso!');
      setIsUserSchoolFormOpen(false);
      setSelectedUserSchool(undefined);
      if (isUserSchoolListOpen) {
        const event = new Event('userSchoolListRefresh');
        window.dispatchEvent(event);
      }
    } catch (error) {
      message.error('Erro ao atualizar vínculo');
    }
  };

  const handleEditUserSchoolClick = (userSchool: UserSchoolDTO) => {
    setSelectedUserSchool(userSchool);
    setIsUserSchoolFormOpen(true);
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
          <button 
            className={styles.actionButton}
            onClick={() => {
              setSelectedUser(undefined);
              setIsUserFormOpen(true);
            }}
          >
            Criar Usuário
          </button>
          <button 
            className={styles.actionButton}
            onClick={() => setIsUserListOpen(true)}
          >
            Listar Usuários
          </button>
        </div>
      </div>

      <div className={styles.adminSection}>
        <h3>Gerenciamento de Vínculos Usuário-Escola</h3>
        <div className={styles.actions}>
          <button 
            className={styles.actionButton}
            onClick={() => {
              setSelectedUserSchool(undefined);
              setIsUserSchoolFormOpen(true);
            }}
          >
            Criar Vínculo
          </button>
          <button 
            className={styles.actionButton}
            onClick={() => setIsUserSchoolListOpen(true)}
          >
            Listar Vínculos
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

      <UserListModal
        isOpen={isUserListOpen}
        onClose={() => setIsUserListOpen(false)}
        onEdit={handleEditUserClick}
      />

      <UserForm
        isOpen={isUserFormOpen}
        onClose={() => {
          setIsUserFormOpen(false);
          setSelectedUser(undefined);
        }}
        onSubmit={selectedUser ? handleEditUser : handleAddUser}
        initialValues={selectedUser}
      />

      <UserSchoolListModal
        isOpen={isUserSchoolListOpen}
        onClose={() => setIsUserSchoolListOpen(false)}
        onEdit={handleEditUserSchoolClick}
      />

      <UserSchoolForm
        isOpen={isUserSchoolFormOpen}
        onClose={() => {
          setIsUserSchoolFormOpen(false);
          setSelectedUserSchool(undefined);
        }}
        onSubmit={selectedUserSchool ? handleEditUserSchool : handleAddUserSchool}
        initialValues={selectedUserSchool}
      />
    </div>
  );
}; 