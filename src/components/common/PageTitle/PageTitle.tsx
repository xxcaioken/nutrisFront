import { HeartOutlined } from '@ant-design/icons';
import styles from './PageTitle.module.css';

interface PageTitleProps {
  title: string;
  heartPosition?: 'left' | 'right';
}

export const PageTitle = ({ title, heartPosition = 'left' }: PageTitleProps) => {
  return (
    <h2 className={styles.title}>
      {heartPosition === 'left' && <HeartOutlined className={styles.heartIcon} />}
      {title}
      {heartPosition === 'right' && <HeartOutlined className={styles.heartIcon} />}
    </h2>
  );
}; 