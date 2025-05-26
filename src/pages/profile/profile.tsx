import { useEffect, useState } from 'react';
import { getUserProfile, UserProfile } from '../../services/profile/profileService';

export const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await getUserProfile();
        setUser(profile);
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      }
    };

    fetchData();
  }, []);

  if (!!user?.isAdmin) 
    return <p>Carregando...</p>;

  return (
    <div>
      <h2>Perfil</h2>
      <p><strong>Nome:</strong> {user?.nome}</p>
      <p><strong>Email:</strong> {user?.email}</p>
    </div>
  );
};
