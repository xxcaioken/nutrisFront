import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, message, Select } from 'antd';
import { ImportShortcutDto, CreateImportShortcutDto, UpdateImportShortcutDto } from '../../services/importShortcut/importShortcutTypes';
import { LinkDto } from '../../services/link/linkTypes';

interface ImportShortcutFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: CreateImportShortcutDto | UpdateImportShortcutDto) => Promise<void>;
  initialValues?: ImportShortcutDto;
  usuarioEscolaId?: number;
  linkTabelaPrincipal?: string;
  linksAdicionais?: LinkDto[];
}

const ImportShortcutForm: React.FC<ImportShortcutFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  usuarioEscolaId,
  linkTabelaPrincipal,
  linksAdicionais
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!initialValues;

  useEffect(() => {
    if (isOpen) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
        // Define o link da tabela principal automaticamente se disponível
        if (linkTabelaPrincipal) {
          form.setFieldValue('linkTabelaPrincipal', linkTabelaPrincipal);
        }
      }
    }
  }, [isOpen, initialValues, linkTabelaPrincipal, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);
      if (isEditing && initialValues) {
        await onSubmit({ ...values } as UpdateImportShortcutDto);
      } else if (usuarioEscolaId) {
        await onSubmit({ ...values, usuarioEscolaId } as CreateImportShortcutDto);
      }
      form.resetFields();
    } catch (error) {
      message.error("Erro no handleSubmit do ImportShortcutForm:" + error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={isEditing ? 'Editar Atalho de Importação' : 'Adicionar Novo Atalho de Importação'}
      open={isOpen}
      onCancel={handleClose}
      onOk={handleSubmit}
      okText={isEditing ? 'Salvar' : 'Adicionar'}
      cancelText="Cancelar"
      confirmLoading={isSubmitting}
      destroyOnClose
      width={600}
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item
          name="nome"
          label="Nome do Atalho"
          rules={[{ required: true, message: 'Por favor, insira o nome do atalho' }]}
        >
          <Input placeholder="Ex: Importar Notas para Planilha Final" allowClear />
        </Form.Item>

        <Form.Item
          name="linkTabelaPrincipal"
          label="Link da Tabela Principal (Origem)"
          rules={[
            { required: true, message: 'Por favor, insira o link da tabela principal' },
            { type: 'url', message: 'Por favor, insira uma URL válida' },
          ]}
        >
          <Input 
            placeholder="https://docs.google.com/spreadsheets/..." 
            allowClear 
            readOnly
            disabled
            style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
          />
        </Form.Item>

        <Form.Item
          name="linkTabelaDestino"
          label="Link da Tabela de Destino"
          rules={[
            { required: true, message: 'Por favor, selecione a tabela de destino' },
          ]}
        >
          <Select
            placeholder="Selecione um link dos links adicionais"
            allowClear
            showSearch
            optionFilterProp="children"
          >
            {linksAdicionais?.map(link => (
              <Select.Option key={link.id} value={link.url}>
                {link.nome} - {link.url}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            name="celulaOrigem"
            label="Célula de Origem"
            rules={[{ required: true, message: 'Por favor, insira a célula de origem' }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="Ex: A1, B5, C10" allowClear />
          </Form.Item>

          <Form.Item
            name="celulaDestino"
            label="Célula de Destino"
            rules={[{ required: true, message: 'Por favor, insira a célula de destino' }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="Ex: A1, B5, C10" allowClear />
          </Form.Item>
        </div>

        <Form.Item name="descricao" label="Descrição (Opcional)">
          <Input.TextArea 
            placeholder="Detalhes sobre a importação (ex: dados que serão copiados, frequência, etc.)" 
            allowClear 
            rows={3} 
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ImportShortcutForm; 