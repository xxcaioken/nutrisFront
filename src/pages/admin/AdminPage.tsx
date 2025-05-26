import React, { useState } from 'react';
import { Card, Button, Space, message } from 'antd';
import { BankOutlined } from '@ant-design/icons';
import SchoolListModal from '../../components/SchoolListModal';
import SchoolForm from '../../components/SchoolForm';

const AdminPage: React.FC = () => {
  const [isSchoolListOpen, setIsSchoolListOpen] = useState(false);
  const [isSchoolFormOpen, setIsSchoolFormOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<any>(null);

  const handleAddSchool = (values: any) => {
    console.log('Adicionar escola:', values);
    message.success('Escola adicionada com sucesso!');
    setIsSchoolFormOpen(false);
  };

  const handleEditSchool = (values: any) => {
    console.log('Editar escola:', values);
    message.success('Escola atualizada com sucesso!');
    setIsSchoolFormOpen(false);
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1>Painel de Administração</h1>
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="Gerenciamento de Escolas">
          <Button
            type="primary"
            icon={<BankOutlined />}
            onClick={() => setIsSchoolListOpen(true)}
          >
            Gerenciar Escolas
          </Button>
        </Card>
      </Space>

      <SchoolListModal
        isOpen={isSchoolListOpen}
        onClose={() => setIsSchoolListOpen(false)}
        onEdit={()=>setIsSchoolListOpen(false)}
      />

      <SchoolForm
        isOpen={isSchoolFormOpen}
        onClose={() => {
          setIsSchoolFormOpen(false);
          setSelectedSchool(null);
        }}
        onSubmit={selectedSchool ? handleEditSchool : handleAddSchool}
        initialValues={selectedSchool}
      />
    </div>
  );
};

export default AdminPage; 