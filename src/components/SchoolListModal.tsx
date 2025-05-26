import React, { useState, useEffect } from 'react';
import { Modal, Table, Button, Space, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { schoolService, EscolaDTO } from '../services/school/schoolService';

export interface SchoolListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (school: EscolaDTO) => void;
}

const SchoolListModal: React.FC<SchoolListModalProps> = ({ isOpen, onClose, onEdit }) => {
  const [schools, setSchools] = useState<EscolaDTO[]>([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
    },
    {
      title: 'Endereço',
      dataIndex: 'endereco',
      key: 'endereco',
    },
    {
      title: 'Telefone',
      dataIndex: 'telefone',
      key: 'telefone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: EscolaDTO) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            Editar
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Excluir
          </Button>
        </Space>
      ),
    },
  ];

  const handleDelete = async (id: string) => {
    try {
      await schoolService.delete(id);
      message.success('Escola excluída com sucesso!');
      loadSchools();
    } catch (error) {
      message.error('Erro ao excluir escola');
    }
  };

  const loadSchools = async () => {
    try {
      setLoading(true);
      const data = await schoolService.getAll();
      setSchools(data);
    } catch (error) {
      message.error('Erro ao carregar lista de escolas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadSchools();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleRefresh = () => {
      loadSchools();
    };

    window.addEventListener('schoolListRefresh', handleRefresh);

    return () => {
      window.removeEventListener('schoolListRefresh', handleRefresh);
    };
  }, []);

  return (
    <Modal
      title="Gerenciamento de Escolas"
      open={isOpen}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="close" onClick={onClose}>
          Fechar
        </Button>,
      ]}
    >
      <Table
        columns={columns}
        dataSource={schools}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </Modal>
  );
};

export default SchoolListModal; 