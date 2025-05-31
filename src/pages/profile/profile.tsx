import { useEffect, useState } from 'react';
import { getUserProfile, UserProfile, getUserSchools, UserSchool } from '../../services/profile/profileService';
import { Modal } from '../../components/common/Modal';
import { SpreadsheetModal } from '../../components/SpreadsheetModal/SpreadsheetModal';
import { PageTitle } from '../../components/common/PageTitle/PageTitle';
import styles from './profile.module.css';
import { Button, Tooltip, message } from 'antd';
import { LinkOutlined, FileExcelOutlined } from '@ant-design/icons';
import DependentLinksModal from '../../components/DependentLinksModal/DependentLinksModal';
import { LinkDto } from '../../services/link/linkTypes';
import { linkService } from '../../services/link/linkService';

interface ProfileUserSchool extends UserSchool {
  dependentLinks?: LinkDto[];
}

export const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profileSchools, setProfileSchools] = useState<ProfileUserSchool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSpreadsheet, setSelectedSpreadsheet] = useState<string | null>(null);
  const [isDependentLinksModalOpen, setIsDependentLinksModalOpen] = useState(false);
  const [selectedUserSchoolForLinks, setSelectedUserSchoolForLinks] = useState<UserSchool | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const profile = await getUserProfile();
        setUser(profile);
        
        const userSchoolsData = await getUserSchools(profile.id);
        
        const schoolsWithLinks = await Promise.all(
          userSchoolsData.map(async (school) => {
            try {
              const links = await linkService.getByUsuarioEscolaId(school.id);
              return { ...school, dependentLinks: links };
            } catch (linkError) {
              console.error(`Erro ao buscar links para escola ${school.escola?.nome || school.id}:`, linkError);
              message.error(`Não foi possível carregar os links auxiliares para ${school.escola?.nome || 'uma escola'}.`);
              return { ...school, dependentLinks: [] };
            }
          })
        );
        setProfileSchools(schoolsWithLinks);

      } catch (fetchError) {
        console.error('Erro ao carregar dados do perfil:', fetchError);
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

  const handleOpenDependentLinksModal = (school: UserSchool) => {
    setSelectedUserSchoolForLinks(school);
    setIsDependentLinksModalOpen(true);
  };

  const handleCloseDependentLinksModal = () => {
    setSelectedUserSchoolForLinks(null);
    setIsDependentLinksModalOpen(false);
  };

  if (loading) return <div className={styles.loading}>Carregando...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!user) return <div className={styles.error}>Usuário não encontrado</div>;

  return (
    <div className={styles.container}>
      <PageTitle title="Perfil" />
      
      <div className={styles.profileInfo}>
        <p><strong>Nome:</strong> {user.nome}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <div className={styles.schoolsSection}>
        <h3>Rotas</h3>
        {profileSchools.length === 0 && !loading ? (
          <p>Nenhuma rota (escola) encontrada para este usuário.</p>
        ) : (
          <ul className={styles.schoolsList}>
            {profileSchools.map(school => (
              <li key={school.id} className={styles.schoolItem}>
                <div className={styles.schoolHeader}>
                  <h4>{school.escola?.nome || 'Nome da Escola Indisponível'}</h4>
                  <span className={styles.schoolDate}>
                    Criado em: {formatDate(school.dataCriacao)}
                  </span>
                </div>
                <div className={styles.schoolDetails}>
                  <p>
                    <strong>Link da Planilha Principal:</strong>{' '}
                    <Tooltip title={school.linkPlanilha}>
                      <button 
                        className={`${styles.spreadsheetLink} ${styles.mainSpreadsheetLink}`}
                        onClick={() => handleSpreadsheetClick(school.linkPlanilha)}
                      >
                        <FileExcelOutlined /> {school.escola?.nome || 'Planilha Principal'}
                      </button>
                    </Tooltip>
                  </p>

                  {school.dependentLinks && school.dependentLinks.length > 0 && (
                    <div className={styles.dependentLinksContainer}>
                      <div className={styles.dependentLinksHeader}>
                        <strong>Links Auxiliares:</strong>
                      </div>
                      <div className={styles.auxLinksList}>
                        {school.dependentLinks.map(link => (
                          <Tooltip key={link.id} title={link.descricao || link.url}>
                            <button
                              className={styles.spreadsheetLink} 
                              onClick={() => handleSpreadsheetClick(link.url)}
                            >
                              <LinkOutlined /> {link.nome}
                            </button>
                          </Tooltip>
                        ))}
                      </div>
                    </div>
                  )}

                  {school.dataAtualizacao && (
                    <p className={styles.updateDate}><strong>Última atualização da rota:</strong> {formatDate(school.dataAtualizacao)}</p>
                  )}
                  <Button 
                    type="dashed"
                    icon={<LinkOutlined />}
                    onClick={() => handleOpenDependentLinksModal(school)}
                  >
                    Gerenciar Links Dependentes
                  </Button>
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

      {selectedUserSchoolForLinks && (
        <DependentLinksModal
          isOpen={isDependentLinksModalOpen}
          onClose={handleCloseDependentLinksModal}
          userSchoolId={selectedUserSchoolForLinks.id}
          userSchoolName={selectedUserSchoolForLinks.escola?.nome}
        />
      )}
    </div>
  );
};
