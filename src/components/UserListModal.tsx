import { useEffect, useState } from 'react';
import { Modal, Table, Button, message, Popconfirm, Space } from 'antd';
import { userService, UserDTO } from '../services/user/userService';
import styles from './UserListModal.module.css';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface UserListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (user: UserDTO) => void;
}

const UserListModal = ({ isOpen, onClose, onEdit }: UserListModalProps) => {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      message.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleRefresh = () => {
      fetchUsers();
    };

    window.addEventListener('userListRefresh', handleRefresh);
    return () => {
      window.removeEventListener('userListRefresh', handleRefresh);
    };
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await userService.delete(id);
      message.success('Usuário excluído com sucesso!');
      fetchUsers();
    } catch (error) {
      message.error('Erro ao excluir usuário');
    }
  };

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Admin',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      render: (isAdmin: boolean) => isAdmin ? 'Sim' : 'Não',
    },
    {
      title: 'Escola ID',
      dataIndex: 'escolaId',
      key: 'escolaId',
    },
    {
      title: 'Funções',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: string[]) => roles?.join(', ') || '-',
    },
    {
      title: 'Ações',
      key: 'acoes',
      render: (_: any, record: UserDTO) => (
        <Space>
          <Button 
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            Editar
          </Button>
          <Popconfirm
            title="Tem certeza que deseja excluir este usuário?"
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
      title="Lista de Usuários"
      open={isOpen}
      onCancel={onClose}
      width={1000}
      footer={null}
    >
      <Table
        dataSource={users}
        columns={columns}
        rowKey="id"
        loading={loading}
        className={styles.table}
      />
    </Modal>
  );
};

export default UserListModal; 