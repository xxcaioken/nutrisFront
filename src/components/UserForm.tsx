import { Form, Input, Modal, Switch, message, Button, Select } from 'antd';
import { UserDTO, userService } from '../services/user/userService';
import { useState, useEffect } from 'react';
import { schoolService, EscolaDTO } from '../services/school/schoolService';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [schools, setSchools] = useState<EscolaDTO[]>([]);
  const isEditing = !!initialValues;

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const schoolsData = await schoolService.getAll();
        setSchools(schoolsData);
      } catch (error) {
        message.error('Erro ao carregar lista de escolas');
      }
    };

    if (isOpen) {
      fetchSchools();
      if (initialValues) {
        form.setFieldsValue({
          nome: initialValues.nome,
          email: initialValues.email,
          escolaId: initialValues.escolaId,
          isAdmin: initialValues.isAdmin
        });
      } else {
        form.resetFields();
      }
    }
  }, [isOpen, initialValues, form]);

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error("Erro no handleSubmit do UserForm:", error);
    } finally {
      setIsSubmitting(false);
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
        confirmLoading={isSubmitting}
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
            <Input allowClear />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Por favor, insira o email' },
              { type: 'email', message: 'Por favor, insira um email válido' }
            ]}
          >
            <Input allowClear />
          </Form.Item>

          {!isEditing && (
            <Form.Item
              name="password"
              label="Senha"
              rules={[{ required: true, message: 'Por favor, insira a senha' }]}
            >
              <Input.Password allowClear />
            </Form.Item>
          )}

          <Form.Item
            name="escolaId"
            label="Escola"
          >
            <Select
              placeholder="Selecione uma escola"
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label?.toString() ?? '').toLowerCase().includes(input.toLowerCase())
              }
              loading={schools.length === 0 && isOpen}
            >
              {schools.map(school => (
                <Select.Option key={school.id} value={school.id} label={school.nome}>
                  {school.nome}
                </Select.Option>
              ))}
            </Select>
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