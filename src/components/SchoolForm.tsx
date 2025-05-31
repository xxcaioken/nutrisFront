import React, { useState } from 'react';
import { Form, Input, Modal, message } from 'antd';
import { EscolaDTO } from '../services/school/schoolService';

interface SchoolFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<EscolaDTO, 'id' | 'dataCriacao'>) => Promise<void>;
  initialValues?: EscolaDTO;
}

const SchoolForm: React.FC<SchoolFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      message.error('Erro ao validar formulário:' + error);
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
      title={initialValues ? 'Editar Escola' : 'Adicionar Escola'}
      open={isOpen}
      onCancel={handleClose}
      onOk={handleSubmit}
      okText={initialValues ? 'Salvar' : 'Adicionar'}
      cancelText="Cancelar"
      confirmLoading={isSubmitting}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
      >
        <Form.Item
          name="nome"
          label="Nome da Escola"
          rules={[{ required: true, message: 'Por favor, insira o nome da escola' }]}
        >
          <Input placeholder="Digite o nome da escola" allowClear />
        </Form.Item>

        <Form.Item
          name="endereco"
          label="Endereço"
          rules={[{ required: true, message: 'Por favor, insira o endereço' }]}
        >
          <Input placeholder="Digite o endereço" allowClear />
        </Form.Item>

        <Form.Item
          name="telefone"
          label="Telefone"
          rules={[{ required: true, message: 'Por favor, insira o telefone' }]}
        >
          <Input placeholder="Digite o telefone" allowClear />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Por favor, insira o email' },
            { type: 'email', message: 'Por favor, insira um email válido' }
          ]}
        >
          <Input placeholder="Digite o email" allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SchoolForm; 