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
  Tag,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SwapOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';
import { ImportacaoManagerDto, CreateImportacaoManagerDto, UpdateImportacaoManagerDto } from '../../services/importShortcut/importShortcutTypes';
import { importacaoManagerService } from '../../services/importShortcut/importShortcutService';
import ImportShortcutForm from '../ImportShortcutForm/ImportShortcutForm';
import { LinkDto } from '../../services/link/linkTypes';
import styles from './ImportShortcutsModal.module.css';

interface ImportShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSchoolId: number | null;
  userSchoolName?: string;
  planilhaOrigemUrl?: string;
  linksAdicionais?: LinkDto[];
}

const ImportShortcutsModal: React.FC<ImportShortcutsModalProps> = ({
  isOpen,
  onClose,
  userSchoolId,
  userSchoolName,
  planilhaOrigemUrl,
  linksAdicionais,
}) => {
  const [importacoes, setImportacoes] = useState<ImportacaoManagerDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedImportacao, setSelectedImportacao] = useState<ImportacaoManagerDto | undefined>(undefined);
  const [executingId, setExecutingId] = useState<number | null>(null);

  const loadImportacoes = useCallback(async () => {
    if (!userSchoolId) return;
    setLoading(true);
    try {
      const data = await importacaoManagerService.getByUsuarioEscolaId(userSchoolId);
      setImportacoes(data);
    } catch (error) {
      message.error('Erro ao carregar importações.');
      console.error('Erro ao carregar importações:', error);
    } finally {
      setLoading(false);
    }
  }, [userSchoolId]);

  useEffect(() => {
    if (isOpen && userSchoolId) {
      loadImportacoes();
    }
  }, [isOpen, userSchoolId, loadImportacoes]);

  const handleAdd = () => {
    setSelectedImportacao(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (importacao: ImportacaoManagerDto) => {
    setSelectedImportacao(importacao);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await importacaoManagerService.delete(id);
      message.success('Importação excluída com sucesso!');
      loadImportacoes();
    } catch (error) {
      message.error('Erro ao excluir importação.');
      console.error('Erro ao excluir importação:', error);
    }
  };

  const handleExecutar = async (id: number) => {
    setExecutingId(id);
    try {
      await importacaoManagerService.executarImportacao(id);
      message.success('Importação executada com sucesso!');
      loadImportacoes(); // Recarrega para atualizar a última execução
    } catch (error) {
      message.error('Erro ao executar importação.');
      console.error('Erro ao executar importação:', error);
    } finally {
      setExecutingId(null);
    }
  };

  const handleFormSubmit = async (values: CreateImportacaoManagerDto | UpdateImportacaoManagerDto) => {
    if (!userSchoolId) return;
    try {
      if (selectedImportacao) {
        await importacaoManagerService.update(selectedImportacao.id, values as UpdateImportacaoManagerDto);
        message.success('Importação atualizada com sucesso!');
      } else {
        await importacaoManagerService.create(values as CreateImportacaoManagerDto);
        message.success('Importação adicionada com sucesso!');
      }
      setIsFormOpen(false);
      loadImportacoes();
    } catch (error) {
      message.error('Erro ao salvar importação.');
      console.error('Erro ao salvar importação:', error);
    }
  };

  const getLinkNameByUrl = (url: string) => {
    const link = linksAdicionais?.find(l => l.url === url);
    return link ? link.nome : url;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
      ellipsis: true,
    },
    {
      title: 'Planilha Origem',
      dataIndex: 'planilhaOrigemUrl',
      key: 'planilhaOrigemUrl',
      ellipsis: true,
      render: (url: string) => (
        <Tooltip title={url}>
          <a href={url} target="_blank" rel="noopener noreferrer">
            Planilha Principal
          </a>
        </Tooltip>
      ),
    },
    {
      title: 'Planilha Destino',
      dataIndex: 'planilhaDestinoUrl',
      key: 'planilhaDestinoUrl',
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
      title: 'Mapeamento',
      dataIndex: 'celulasMapping',
      key: 'celulasMapping',
      ellipsis: true,
      render: (mapping: string) => (
        <Tooltip title={mapping}>
          <span className={styles.cellsMapping}>{mapping}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isAtivo',
      key: 'isAtivo',
      render: (isAtivo: boolean) => (
        <Tag color={isAtivo ? 'green' : 'red'}>
          {isAtivo ? 'Ativo' : 'Inativo'}
        </Tag>
      ),
    },
    {
      title: 'Última Execução',
      dataIndex: 'ultimaExecucao',
      key: 'ultimaExecucao',
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 180,
      render: (_: any, record: ImportacaoManagerDto) => (
        <Space>
          <Tooltip title="Executar Importação">
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={() => handleExecutar(record.id)}
              loading={executingId === record.id}
              disabled={!record.isAtivo}
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            />
          </Tooltip>
          <Tooltip title="Editar Importação">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Excluir Importação">
            <Popconfirm
              title="Tem certeza que deseja excluir esta importação?"
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
        title={`Importações: ${userSchoolName || 'Carregando...'}`}
        open={isOpen}
        onCancel={onClose}
        width="95%"
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
          Adicionar Nova Importação
        </Button>
        <Table
          columns={columns}
          dataSource={importacoes}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 6, hideOnSinglePage: true }}
          locale={{ emptyText: <Empty description="Nenhuma importação encontrada para esta rota." /> }}
          className={styles.importShortcutsTable}
        />
      </Modal>

      {userSchoolId && (
        <ImportShortcutForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          initialValues={selectedImportacao}
          usuarioEscolaId={userSchoolId}
          planilhaOrigemUrl={planilhaOrigemUrl}
          linksAdicionais={linksAdicionais}
        />
      )}
    </>
  );
};

export default ImportShortcutsModal; 