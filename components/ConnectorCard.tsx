'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './ConnectorCard.module.css';
import connectorIcons from './connectorIcons';

interface ConnectorCardProps {
  name: string;
  description: string;
  href: string;
  category: 'Databases' | 'Observability' | 'Integrations';
}

export default function ConnectorCard({
  name,
  description,
  href,
}: ConnectorCardProps) {
  const iconPath = connectorIcons[name];
  const isImage = iconPath?.endsWith('.png');

  return (
    <Link href={href} legacyBehavior>
      <a className={styles.card}>
        {isImage ? (
          <Image
            src={iconPath}
            alt={name}
            width={52}
            height={52}
            className={styles.icon}
          />
        ) : (
          <span className={styles.emoji}>{iconPath || '🔌'}</span>
        )}
        <h3 className={styles.title}>{name}</h3>
        <p className={styles.description}>{description}</p>
      </a>
    </Link>
  );
}
