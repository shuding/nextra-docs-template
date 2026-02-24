'use client';

import ConnectorCard from './ConnectorCard';
import styles from './ConnectorGrid.module.css';

interface Connector {
  name: string;
  description: string;
  href: string;
}

interface ConnectorGridProps {
  databases: Connector[];
  observability: Connector[];
  integrations: Connector[];
}

export default function ConnectorGrid({
  databases,
  observability,
  integrations,
}: ConnectorGridProps) {
  const renderSection = (
    title: string,
    connectors: Connector[],
    category: 'Databases' | 'Observability' | 'Integrations'
  ) => (
    <section className={styles.section}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.grid}>
        {connectors.map((connector) => (
          <div key={connector.href} className={styles.cell}>
            <ConnectorCard
              name={connector.name}
              description={connector.description}
              href={connector.href}
              category={category}
            />
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className={styles.wrapper}>
      {renderSection('Databases', databases, 'Databases')}
      {renderSection('Observability', observability, 'Observability')}
      {renderSection('Integrations', integrations, 'Integrations')}
    </div>
  );
}
