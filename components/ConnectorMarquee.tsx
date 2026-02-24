'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './ConnectorMarquee.module.css';
import connectorIcons from './connectorIcons';

const connectors = [
  { name: 'PostgreSQL', href: '/vibeshield/connectors/postgres' },
  { name: 'BigQuery', href: '/vibeshield/connectors/bigquery' },
  { name: 'BigQuery Insights', href: '/vibeshield/connectors/bigquery-insights' },
  { name: 'AWS Athena', href: '/vibeshield/connectors/athena' },
  { name: 'ClickHouse', href: '/vibeshield/connectors/clickhouse' },
  { name: 'Snowflake', href: '/vibeshield/connectors/snowflake' },
  { name: 'AWS CloudWatch', href: '/vibeshield/connectors/cloudwatch' },
  { name: 'Datadog', href: '/vibeshield/connectors/datadog' },
  { name: 'Elasticsearch', href: '/vibeshield/connectors/elasticsearch' },
  { name: 'Grafana', href: '/vibeshield/connectors/grafana' },
  { name: 'Prometheus', href: '/vibeshield/connectors/prometheus' },
  { name: 'Thanos', href: '/vibeshield/connectors/thanos' },
  { name: 'New Relic', href: '/vibeshield/connectors/newrelic' },
  { name: 'Google Cloud Monitoring', href: '/vibeshield/connectors/gcp-monitoring' },
  { name: 'Lakerunner', href: '/vibeshield/connectors/lakerunner' },
  { name: 'Slack', href: '/vibeshield/connectors/slack' },
  { name: 'GitHub', href: '/vibeshield/connectors/github' },
  { name: 'HTTP MCP Server', href: '/vibeshield/connectors/httpmcp' },
  { name: 'AWS Lambda', href: '/vibeshield/connectors/lambda' },
];

function ConnectorItem({ name, href }: { name: string; href: string }) {
  const iconPath = connectorIcons[name];
  const isImage = iconPath?.endsWith('.png');

  return (
    <Link href={href} className={styles.item} aria-label={name}>
      {isImage ? (
        <Image
          src={iconPath}
          alt={name}
          width={40}
          height={40}
          className={styles.icon}
        />
      ) : (
        <span className={styles.emoji}>{iconPath || '🔌'}</span>
      )}
      <span className={styles.label}>{name}</span>
    </Link>
  );
}

export default function ConnectorMarquee() {
  return (
    <div className={styles.marquee} role="region" aria-label="Connector icons">
      <div className={styles.track}>
        <div className={styles.group}>
          {connectors.map((connector) => (
            <ConnectorItem key={connector.href} {...connector} />
          ))}
        </div>
        <div className={styles.group} aria-hidden="true">
          {connectors.map((connector) => (
            <ConnectorItem key={`${connector.href}-dup`} {...connector} />
          ))}
        </div>
      </div>
    </div>
  );
}
