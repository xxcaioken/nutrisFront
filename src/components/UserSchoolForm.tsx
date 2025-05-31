import { Form, Input, Modal, message, Select } from 'antd';
import { UserSchoolDTO, userSchoolService } from '../services/userSchool/userSchoolService';
import { useEffect, useState } from 'react';
import { UserDTO } from '../services/user/userService';
import { EscolaDTO } from '../services/school/schoolService';
import { userService } from '../services/user/userService';
import { schoolService } from '../services/school/schoolService';

interface UserSchoolFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<UserSchoolDTO, 'id' | 'dataCriacao' | 'dataAtualizacao'>) => Promise<void>;
  initialValues?: UserSchoolDTO;
}

const UserSchoolForm = ({ isOpen, onClose, onSubmit, initialValues }: UserSchoolFormProps) => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [schools, setSchools] = useState<EscolaDTO[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!initialValues;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, schoolsData] = await Promise.all([
          userService.getAll(),
          schoolService.getAll()
        ]);
        setUsers(usersData);
        setSchools(schoolsData);
      } catch (error) {
        message.error('Erro ao carregar dados');
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && initialValues) {
      form.setFieldsValue({
        usuarioId: initialValues.usuarioId,
        escolaId: initialValues.escolaId,
        linkPlanilha: initialValues.linkPlanilha
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
      setIsSubmitting(true);
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error("Erro no handleSubmit do UserSchoolForm:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title={isEditing ? 'Editar Vínculo Usuário-Escola' : 'Criar Vínculo Usuário-Escola'}
      open={isOpen}
      onCancel={handleClose}
      onOk={handleSubmit}
      okText={isEditing ? 'Salvar' : 'Criar'}
      cancelText="Cancelar"
      style={{ zIndex: 1001 }}
      maskStyle={{ zIndex: 1000 }}
      confirmLoading={isSubmitting}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="usuarioId"
          label="Usuário"
          rules={[{ required: true, message: 'Por favor, selecione um usuário' }]}
        >
          <Select
            placeholder="Selecione um usuário"
            showSearch
            allowClear
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label?.toString() ?? '').toLowerCase().includes(input.toLowerCase())
            }
          >
            {users.map(user => (
              <Select.Option key={user.id} value={user.id} label={`${user.nome} (${user.email})`}>
                {user.nome} ({user.email})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="escolaId"
          label="Escola"
          rules={[{ required: true, message: 'Por favor, selecione uma escola' }]}
        >
          <Select
            placeholder="Selecione uma escola"
            showSearch
            allowClear
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label?.toString() ?? '').toLowerCase().includes(input.toLowerCase())
            }
          >
            {schools.map(school => (
              <Select.Option key={school.id} value={school.id} label={school.nome}>
                {school.nome}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="linkPlanilha"
          label="Link da Planilha"
          rules={[{ required: true, message: 'Por favor, insira o link da planilha' }]}
        >
          <Input allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserSchoolForm; 