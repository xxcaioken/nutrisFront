import React from 'react';
import { Dropdown, Menu, Button, message } from 'antd';
import { MenuOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { logout as logoutService } from '../../../services/auth/AuthService';
import styles from './HamburgerMenu.module.css';

const HamburgerMenu: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutService(); 
      console.log('Usuário deslogado');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      message.success('Logout realizado com sucesso!');
      navigate('/'); 
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      message.error(`Erro ao fazer logout: ${errorMessage}`);
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.hamburgerMenuContainer}>
      <Dropdown overlay={menu} trigger={['click']}>
        <Button type="text" icon={<MenuOutlined />} className={styles.menuButton} />
      </Dropdown>
    </div>
  );
};

export default HamburgerMenu; 