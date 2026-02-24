'use client';

import Image from 'next/image';
import styles from './ConnectorTitle.module.css';
import connectorIcons from './connectorIcons';

interface ConnectorTitleProps {
  name: string;
}

export default function ConnectorTitle({ name }: ConnectorTitleProps) {
  const iconPath = connectorIcons[name];
  const isImage = iconPath?.endsWith('.png');

  return (
    <div className={styles.wrapper}>
      {isImage ? (
        <Image
          src={iconPath}
          alt={name}
          width={36}
          height={36}
          className={styles.icon}
        />
      ) : (
        <span className={styles.emoji}>{iconPath || '🔌'}</span>
      )}
      <h1 className={styles.title}>{name}</h1>
    </div>
  );
}
