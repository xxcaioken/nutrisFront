import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  Table,
  Button,
  Space,
  message,
  Popconfirm,
  Tooltip,
  Empty,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { LinkDto, CreateLinkDto, UpdateLinkDto } from '../../services/link/linkTypes';
import { linkService } from '../../services/link/linkService';
import DependentLinkForm from '../DependentLinkForm/DependentLinkForm';
import styles from './DependentLinksModal.module.css';

interface DependentLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSchoolId: number | null; // ID da relação UsuarioEscola
  userSchoolName?: string; // Nome da escola para o título do modal
}

const DependentLinksModal: React.FC<DependentLinksModalProps> = ({
  isOpen,
  onClose,
  userSchoolId,
  userSchoolName,
}) => {
  const [links, setLinks] = useState<LinkDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<LinkDto | undefined>(undefined);

  const loadLinks = useCallback(async () => {
    if (!userSchoolId) return;
    setLoading(true);
    try {
      const data = await linkService.getByUsuarioEscolaId(userSchoolId);
      setLinks(data);
    } catch (error) {
      message.error('Erro ao carregar links dependentes.');
      console.error('Erro ao carregar links:', error);
    } finally {
      setLoading(false);
    }
  }, [userSchoolId]);

  useEffect(() => {
    if (isOpen && userSchoolId) {
      loadLinks();
    }
  }, [isOpen, userSchoolId, loadLinks]);

  const handleAdd = () => {
    setSelectedLink(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (link: LinkDto) => {
    setSelectedLink(link);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await linkService.delete(id);
      message.success('Link excluído com sucesso!');
      loadLinks(); // Recarrega a lista
    } catch (error) {
      message.error('Erro ao excluir link.');
      console.error('Erro ao excluir link:', error);
    }
  };

  const handleFormSubmit = async (values: CreateLinkDto | UpdateLinkDto) => {
    if (!userSchoolId) return; // Segurança
    try {
      if (selectedLink) {
        // Editando
        await linkService.update(selectedLink.id, values as UpdateLinkDto);
        message.success('Link atualizado com sucesso!');
      } else {
        // Criando
        await linkService.create(values as CreateLinkDto);
        message.success('Link adicionado com sucesso!');
      }
      setIsFormOpen(false);
      loadLinks(); // Recarrega a lista
    } catch (error) {
      // O serviço ou o formulário já podem ter mostrado uma mensagem mais específica
      message.error('Erro ao salvar link.'); 
      console.error('Erro ao salvar link:', error);
    }
  };

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
      ellipsis: true,
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      ellipsis: true,
      render: (url: string) => (
        <a href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      ),
    },
    {
      title: 'Descrição',
      dataIndex: 'descricao',
      key: 'descricao',
      ellipsis: true,
      render: (text: string) => text || '-',
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 120,
      render: (_: any, record: LinkDto) => (
        <Space>
          <Tooltip title="Editar Link">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Excluir Link">
            <Popconfirm
              title="Tem certeza que deseja excluir este link?"
              onConfirm={() => handleDelete(record.id)}
              okText="Sim"
              cancelText="Não"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            >
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Modal
        title={`Links da Rota: ${userSchoolName || 'Carregando...'}`}
        open={isOpen}
        onCancel={onClose}
        width="80%"
        style={{ top: 20 }}
        footer={[
          <Button key="close" onClick={onClose}>
            Fechar
          </Button>,
        ]}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          style={{ marginBottom: 16 }}
        >
          Adicionar Novo Link
        </Button>
        <Table
          columns={columns}
          dataSource={links}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 5, hideOnSinglePage: true }}
          locale={{ emptyText: <Empty description="Nenhum link dependente encontrado para esta rota." /> }}
          className={styles.dependentLinksTable}
        />
      </Modal>

      {userSchoolId && (
        <DependentLinkForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          initialValues={selectedLink}
          usuarioEscolaId={userSchoolId} // Passa o ID para criação
        />
      )}
    </>
  );
};

export default DependentLinksModal; 