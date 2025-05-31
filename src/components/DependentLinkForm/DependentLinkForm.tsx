import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { LinkDto, CreateLinkDto, UpdateLinkDto } from '../../services/link/linkTypes';

interface DependentLinkFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: CreateLinkDto | UpdateLinkDto) => Promise<void>;
  initialValues?: LinkDto;
  usuarioEscolaId?: number;
}

const DependentLinkForm: React.FC<DependentLinkFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  usuarioEscolaId
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
      }
    }
  }, [isOpen, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);
      if (isEditing && initialValues) {
        await onSubmit({ ...values } as UpdateLinkDto);
      } else if (usuarioEscolaId) {
        await onSubmit({ ...values, usuarioEscolaId } as CreateLinkDto);
      }
      form.resetFields();
    } catch (error) {
      message.error("Erro no handleSubmit do DependentLinkForm:" + error);
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
      title={isEditing ? 'Editar Link' : 'Adicionar Novo Link'}
      open={isOpen}
      onCancel={handleClose}
      onOk={handleSubmit}
      okText={isEditing ? 'Salvar' : 'Adicionar'}
      cancelText="Cancelar"
      confirmLoading={isSubmitting}
      destroyOnClose
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item
          name="nome"
          label="Nome do Link"
          rules={[{ required: true, message: 'Por favor, insira o nome do link' }]}
        >
          <Input placeholder="Ex: Planilha de Alunos" allowClear />
        </Form.Item>

        <Form.Item
          name="url"
          label="URL"
          rules={[
            { required: true, message: 'Por favor, insira a URL' },
            { type: 'url', message: 'Por favor, insira uma URL válida' },
          ]}
        >
          <Input placeholder="https://docs.google.com/spreadsheets/..." allowClear />
        </Form.Item>

        <Form.Item name="descricao" label="Descrição (Opcional)">
          <Input.TextArea placeholder="Detalhes adicionais sobre o link" allowClear rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DependentLinkForm; 