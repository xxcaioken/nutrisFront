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
  QuestionCircleOutlined,
  SwapOutlined
} from '@ant-design/icons';
import { ImportShortcutDto, CreateImportShortcutDto, UpdateImportShortcutDto } from '../../services/importShortcut/importShortcutTypes';
import { importShortcutService } from '../../services/importShortcut/importShortcutService';
import ImportShortcutForm from '../ImportShortcutForm/ImportShortcutForm';
import { LinkDto } from '../../services/link/linkTypes';
import styles from './ImportShortcutsModal.module.css';

interface ImportShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSchoolId: number | null;
  userSchoolName?: string;
  linkTabelaPrincipal?: string;
  linksAdicionais?: LinkDto[];
}

const ImportShortcutsModal: React.FC<ImportShortcutsModalProps> = ({
  isOpen,
  onClose,
  userSchoolId,
  userSchoolName,
  linkTabelaPrincipal,
  linksAdicionais,
}) => {
  const [shortcuts, setShortcuts] = useState<ImportShortcutDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedShortcut, setSelectedShortcut] = useState<ImportShortcutDto | undefined>(undefined);

  const loadShortcuts = useCallback(async () => {
    if (!userSchoolId) return;
    setLoading(true);
    try {
      const data = await importShortcutService.getByUsuarioEscolaId(userSchoolId);
      setShortcuts(data);
    } catch (error) {
      message.error('Erro ao carregar atalhos de importação.');
      console.error('Erro ao carregar atalhos:', error);
    } finally {
      setLoading(false);
    }
  }, [userSchoolId]);

  useEffect(() => {
    if (isOpen && userSchoolId) {
      loadShortcuts();
    }
  }, [isOpen, userSchoolId, loadShortcuts]);

  const handleAdd = () => {
    setSelectedShortcut(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (shortcut: ImportShortcutDto) => {
    setSelectedShortcut(shortcut);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await importShortcutService.delete(id);
      message.success('Atalho de importação excluído com sucesso!');
      loadShortcuts();
    } catch (error) {
      message.error('Erro ao excluir atalho de importação.');
      console.error('Erro ao excluir atalho:', error);
    }
  };

  const handleFormSubmit = async (values: CreateImportShortcutDto | UpdateImportShortcutDto) => {
    if (!userSchoolId) return;
    try {
      if (selectedShortcut) {
        await importShortcutService.update(selectedShortcut.id, values as UpdateImportShortcutDto);
        message.success('Atalho de importação atualizado com sucesso!');
      } else {
        await importShortcutService.create(values as CreateImportShortcutDto);
        message.success('Atalho de importação adicionado com sucesso!');
      }
      setIsFormOpen(false);
      loadShortcuts();
    } catch (error) {
      message.error('Erro ao salvar atalho de importação.');
      console.error('Erro ao salvar atalho:', error);
    }
  };

  const getLinkNameByUrl = (url: string) => {
    const link = linksAdicionais?.find(l => l.url === url);
    return link ? link.nome : url;
  };

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
      ellipsis: true,
    },
    {
      title: 'Tabela Principal',
      dataIndex: 'linkTabelaPrincipal',
      key: 'linkTabelaPrincipal',
      ellipsis: true,
      render: (url: string) => (
        <Tooltip title={url}>
          <a href={url} target="_blank" rel="noopener noreferrer">
            Tabela Principal
          </a>
        </Tooltip>
      ),
    },
    {
      title: 'Tabela Destino',
      dataIndex: 'linkTabelaDestino',
      key: 'linkTabelaDestino',
      ellipsis: true,
      render: (url: string) => (
        <Tooltip title={url}>
          <a href={url} target="_blank" rel="noopener noreferrer">
            {getLinkNameByUrl(url)}
          </a>
        </Tooltip>
      ),
    },
    {
      title: 'Células',
      key: 'celulas',
      render: (_: any, record: ImportShortcutDto) => (
        <div className={styles.cellsMapping}>
          <span className={styles.cellOrigin}>{record.celulaOrigem}</span>
          <SwapOutlined className={styles.arrowIcon} />
          <span className={styles.cellDestination}>{record.celulaDestino}</span>
        </div>
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
      render: (_: any, record: ImportShortcutDto) => (
        <Space>
          <Tooltip title="Editar Atalho">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Excluir Atalho">
            <Popconfirm
              title="Tem certeza que deseja excluir este atalho de importação?"
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
        title={`Atalhos de Importação: ${userSchoolName || 'Carregando...'}`}
        open={isOpen}
        onCancel={onClose}
        width="90%"
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
          Adicionar Novo Atalho de Importação
        </Button>
        <Table
          columns={columns}
          dataSource={shortcuts}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 5, hideOnSinglePage: true }}
          locale={{ emptyText: <Empty description="Nenhum atalho de importação encontrado para esta rota." /> }}
          className={styles.importShortcutsTable}
        />
      </Modal>

      {userSchoolId && (
        <ImportShortcutForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          initialValues={selectedShortcut}
          usuarioEscolaId={userSchoolId}
          linkTabelaPrincipal={linkTabelaPrincipal}
          linksAdicionais={linksAdicionais}
        />
      )}
    </>
  );
};

export default ImportShortcutsModal; 