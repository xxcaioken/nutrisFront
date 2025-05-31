import { useEffect, useState } from 'react';
import { Modal, Table, Button, message, Popconfirm, Space } from 'antd';
import { userSchoolService, UserSchoolDTO } from '../services/userSchool/userSchoolService';
import styles from './UserSchoolListModal.module.css';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface UserSchoolListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (userSchool: UserSchoolDTO) => void;
}

const UserSchoolListModal = ({ isOpen, onClose, onEdit }: UserSchoolListModalProps) => {
  const [userSchools, setUserSchools] = useState<UserSchoolDTO[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUserSchools = async () => {
    try {
      setLoading(true);
      const data = await userSchoolService.getAll();
      setUserSchools(data);
    } catch (error) {
      message.error('Erro ao carregar vínculos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUserSchools();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleRefresh = () => {
      fetchUserSchools();
    };

    window.addEventListener('userSchoolListRefresh', handleRefresh);
    return () => {
      window.removeEventListener('userSchoolListRefresh', handleRefresh);
    };
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await userSchoolService.delete(id);
      message.success('Vínculo excluído com sucesso!');
      fetchUserSchools();
    } catch (error) {
      message.error('Erro ao excluir vínculo');
    }
  };

  const columns = [
    {
      title: 'Usuário ID',
      dataIndex: 'usuarioId',
      key: 'usuarioId',
    },
    {
      title: 'Escola',
      dataIndex: ['escola', 'nome'],
      key: 'escolaNome',
    },
    {
      title: 'Link da Planilha',
      dataIndex: 'linkPlanilha',
      key: 'linkPlanilha',
      render: (link: string) => (
        <a href={link} target="_blank" rel="noopener noreferrer">
          {link}
        </a>
      ),
    },
    {
      title: 'Data de Criação',
      dataIndex: 'dataCriacao',
      key: 'dataCriacao',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Ações',
      key: 'acoes',
      render: (_: any, record: UserSchoolDTO) => (
        <Space>
          <Button 
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            Editar
          </Button>
          <Popconfirm
            title="Tem certeza que deseja excluir este vínculo?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button 
              danger
              icon={<DeleteOutlined />}
            >
              Excluir
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Modal
      title="Lista de Vínculos Usuário Escolas"
      open={isOpen}
      onCancel={onClose}
      width={1000}
      footer={null}
    >
      <Table
        dataSource={userSchools}
        columns={columns}
        rowKey="id"
        loading={loading}
        className={styles.table}
      />
    </Modal>
  );
};

export default UserSchoolListModal; 