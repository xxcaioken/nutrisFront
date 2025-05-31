import { useEffect, useState } from 'react';
import { getUserProfile, UserProfile } from '../../services/profile/profileService';
import { schoolService, EscolaDTO } from '../../services/school/schoolService';
import { userService, UserDTO } from '../../services/user/userService';
import { userSchoolService, UserSchoolDTO } from '../../services/userSchool/userSchoolService';
import { PageTitle } from '../../components/common/PageTitle/PageTitle';
import styles from './Admin.module.css';
import SchoolListModal from '../../components/SchoolListModal';
import SchoolForm from '../../components/SchoolForm';
import UserListModal from '../../components/UserListModal';
import UserForm from '../../components/UserForm';
import UserSchoolListModal from '../../components/UserSchoolListModal';
import UserSchoolForm from '../../components/UserSchoolForm';
import { message, Modal } from 'antd';
import { 
  QuestionCircleOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  UserAddOutlined,
  TeamOutlined,
  LinkOutlined,
  CopyOutlined,
  EditOutlined,
  AppstoreOutlined
} from '@ant-design/icons';

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
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(false);
  const [isSpreadsheetModalOpen, setIsSpreadsheetModalOpen] = useState(false);
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
        message.error('Erro ao carregar dados:' + error);
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
      <PageTitle title="Painel Administrativo" />
      
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
            <PlusOutlined /> Adicionar Nova Escola
          </button>
          <button 
            className={styles.actionButton}
            onClick={() => setIsSchoolListOpen(true)}
          >
            <AppstoreOutlined /> Listar Escolas
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
            <UserAddOutlined /> Criar Usuário
          </button>
          <button 
            className={styles.actionButton}
            onClick={() => setIsUserListOpen(true)}
          >
            <TeamOutlined /> Listar Usuários
          </button>
        </div>
      </div>

      <div className={styles.adminSection}>
        <h3>Gerenciamento de Vínculos Usuário Escolas</h3>
        <div className={styles.actions}>
          <button 
            className={styles.actionButton}
            onClick={() => {
              setSelectedUserSchool(undefined);
              setIsUserSchoolFormOpen(true);
            }}
          >
            <LinkOutlined /> Criar Vínculo
          </button>
          <button 
            className={styles.actionButton}
            onClick={() => setIsUserSchoolListOpen(true)}
          >
            <UnorderedListOutlined /> Listar Vínculos
          </button>
        </div>
      </div>

      <div className={styles.adminSection}>
        <h3>
          Planilha base
        </h3>
        <div className={styles.actions}>
          
          <a 
            href="https://docs.google.com/spreadsheets/d/1fMrqWIIlbs5QO7icdFqGmoM3LxPtUffa14jHUS6cOJ4/edit?gid=0#gid=0"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.actionButton}
          >
            <CopyOutlined /> Clonar Planilha
            <QuestionCircleOutlined 
              className={styles.helpIcon}
              onClick={(e) => {
                e.preventDefault();
                setIsInstructionsModalOpen(true);
              }}
            />
          </a>
          <button 
            className={styles.actionButton}
            onClick={() => setIsSpreadsheetModalOpen(true)}
          >
            <EditOutlined /> Editar Planilha Base
          </button>
        </div>
      </div>

      <Modal
        title="Planilha Base"
        open={isSpreadsheetModalOpen}
        onCancel={() => setIsSpreadsheetModalOpen(false)}
        width="90%"
        style={{ top: 20 }}
        bodyStyle={{ height: 'calc(90vh - 110px)', padding: 0 }}
      >
        <iframe
          src="https://docs.google.com/spreadsheets/d/1fMrqWIIlbs5QO7icdFqGmoM3LxPtUffa14jHUS6cOJ4/edit?gid=0#gid=0"
          style={{
            width: '100%',
            height: '100%',
            border: 'none'
          }}
          title="Planilha Base"
        />
      </Modal>

      <Modal
        title="Como clonar a planilha"
        open={isInstructionsModalOpen}
        onCancel={() => setIsInstructionsModalOpen(false)}
        footer={null}
      >
        <div className={styles.instructions}>
          <h4>Instruções para clonar a planilha:</h4>
          <ol>
            <li>Clique no botão "clonar Planilha"</li>
            <li>Na página do Google Sheets que abrir, clique em "Arquivo" no menu superior</li>
            <li>Selecione "Fazer uma cópia"</li>
            <li>Escolha um nome para sua cópia e selecione onde deseja salvá-la</li>
            <li>Clique em "OK" para criar sua cópia</li>
          </ol>
          <p><strong>Observação:</strong> Você precisa estar logado em uma conta Google para fazer a cópia da planilha.</p>
        </div>
      </Modal>

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