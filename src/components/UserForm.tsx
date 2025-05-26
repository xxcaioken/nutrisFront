import { Form, Input, Modal, Switch, message, Button } from 'antd';
import { UserDTO, userService } from '../services/user/userService';
import { useState, useEffect } from 'react';

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<UserDTO, 'id'>) => Promise<void>;
  initialValues?: UserDTO;
}

const UserForm = ({ isOpen, onClose, onSubmit, initialValues }: UserFormProps) => {
  const [form] = Form.useForm();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm] = Form.useForm();
  const isEditing = !!initialValues;

  useEffect(() => {
    if (isOpen && initialValues) {
      form.setFieldsValue({
        nome: initialValues.nome,
        email: initialValues.email,
        escolaId: initialValues.escolaId,
        isAdmin: initialValues.isAdmin
      });
    } else {
      form.resetFields();
    }
  }, [isOpen, initialValues, form]);

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      message.error('Por favor, preencha todos os campos obrigatórios');
    }
  };

  const handleChangePassword = async () => {
    try {
      const values = await passwordForm.validateFields();
      if (!initialValues?.id) return;

      await userService.changePassword(initialValues.id, values);
      message.success('Senha alterada com sucesso!');
      setShowPasswordModal(false);
      passwordForm.resetFields();
    } catch (error) {
      message.error('Erro ao alterar senha');
    }
  };

  return (
    <>
      <Modal
        title={isEditing ? 'Editar Usuário' : 'Criar Usuário'}
        open={isOpen}
        onCancel={handleClose}
        onOk={handleSubmit}
        okText={isEditing ? 'Salvar' : 'Criar'}
        cancelText="Cancelar"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="nome"
            label="Nome"
            rules={[{ required: true, message: 'Por favor, insira o nome' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Por favor, insira o email' },
              { type: 'email', message: 'Por favor, insira um email válido' }
            ]}
          >
            <Input />
          </Form.Item>

          {!isEditing && (
            <Form.Item
              name="password"
              label="Senha"
              rules={[{ required: true, message: 'Por favor, insira a senha' }]}
            >
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item
            name="escolaId"
            label="ID da Escola"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="isAdmin"
            label="Administrador"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          {isEditing && (
            <Button 
              type="link" 
              onClick={() => setShowPasswordModal(true)}
              style={{ padding: 0 }}
            >
              Alterar Senha
            </Button>
          )}
        </Form>
      </Modal>

      <Modal
        title="Alterar Senha"
        open={showPasswordModal}
        onCancel={() => {
          setShowPasswordModal(false);
          passwordForm.resetFields();
        }}
        onOk={handleChangePassword}
        okText="Alterar"
        cancelText="Cancelar"
      >
        <Form
          form={passwordForm}
          layout="vertical"
        >
          <Form.Item
            name="newPassword"
            label="Nova Senha"
            rules={[{ required: true, message: 'Por favor, insira a nova senha' }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserForm; 