import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, message, Select, Switch } from 'antd';
import { ImportacaoManagerDto, CreateImportacaoManagerDto, UpdateImportacaoManagerDto } from '../../services/importShortcut/importShortcutTypes';
import { LinkDto } from '../../services/link/linkTypes';

interface ImportShortcutFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: CreateImportacaoManagerDto | UpdateImportacaoManagerDto) => Promise<void>;
  initialValues?: ImportacaoManagerDto;
  usuarioEscolaId?: number;
  planilhaOrigemUrl?: string;
  linksAdicionais?: LinkDto[];
}

const ImportShortcutForm: React.FC<ImportShortcutFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  usuarioEscolaId,
  planilhaOrigemUrl,
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
        // Define o link da planilha origem automaticamente se disponível
        if (planilhaOrigemUrl) {
          form.setFieldValue('planilhaOrigemUrl', planilhaOrigemUrl);
        }
        // Define como ativo por padrão
        form.setFieldValue('isAtivo', true);
      }
    }
  }, [isOpen, initialValues, planilhaOrigemUrl, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);
      if (isEditing && initialValues) {
        await onSubmit({ ...values } as UpdateImportacaoManagerDto);
      } else if (usuarioEscolaId) {
        await onSubmit({ ...values, usuarioEscolaId } as CreateImportacaoManagerDto);
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
      title={isEditing ? 'Editar Importação' : 'Adicionar Nova Importação'}
      open={isOpen}
      onCancel={handleClose}
      onOk={handleSubmit}
      okText={isEditing ? 'Salvar' : 'Adicionar'}
      cancelText="Cancelar"
      confirmLoading={isSubmitting}
      destroyOnClose
      width={700}
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item
          name="nome"
          label="Nome da Importação"
          rules={[{ required: true, message: 'Por favor, insira o nome da importação' }]}
        >
          <Input placeholder="Ex: Importar Notas para Planilha Final" allowClear />
        </Form.Item>

        <Form.Item
          name="planilhaOrigemUrl"
          label="Planilha de Origem"
          rules={[
            { required: true, message: 'Por favor, insira o link da planilha de origem' },
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
          name="planilhaDestinoUrl"
          label="Planilha de Destino"
          rules={[
            { required: true, message: 'Por favor, selecione a planilha de destino' },
            { type: 'url', message: 'Por favor, insira uma URL válida' },
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
                {link.nome}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="celulasMapping"
          label="Mapeamento de Células"
          rules={[{ required: true, message: 'Por favor, insira o mapeamento de células' }]}
          extra="Exemplo: A1->B1,A2->B2,C3->D3 (formato origem->destino separado por vírgula)"
        >
          <Input.TextArea 
            placeholder="Ex: A1->B1, A2->B2, C10->D10"
            allowClear 
            rows={3}
          />
        </Form.Item>

        <Form.Item name="descricao" label="Descrição (Opcional)">
          <Input.TextArea 
            placeholder="Detalhes sobre a importação (ex: dados que serão copiados, frequência, etc.)" 
            allowClear 
            rows={3} 
          />
        </Form.Item>

        <Form.Item 
          name="isAtivo" 
          label="Status" 
          valuePropName="checked"
        >
          <Switch 
            checkedChildren="Ativo" 
            unCheckedChildren="Inativo"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ImportShortcutForm; 