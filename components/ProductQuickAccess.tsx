'use client';

import Link from 'next/link';
import styles from './ProductQuickAccess.module.css';

const assets = [
  {
    title: 'Agents',
    desc: 'AI-powered assistants',
    href: '/vibeshield/product/assets/agents',
    icon: '🤖',
  },
  {
    title: 'Connectors',
    desc: 'Data source integration',
    href: '/vibeshield/product/assets/connectors',
    icon: '🔌',
  },
  {
    title: 'Knowledge',
    desc: 'Custom context & runbooks',
    href: '/vibeshield/product/assets/knowledge',
    icon: '📚',
  },
  {
    title: 'Reports',
    desc: 'Insights & analysis',
    href: '/vibeshield/product/assets/reports',
    icon: '📊',
  },
  {
    title: 'Queries',
    desc: 'Natural language search',
    href: '/vibeshield/product/assets/queries',
    icon: '🔍',
  },
  {
    title: 'Workflows',
    desc: 'Automation & logic',
    href: '/vibeshield/product/assets/workflows',
    icon: '⚙️',
  },
  {
    title: 'Scripts',
    desc: 'Custom automation',
    href: '/vibeshield/product/assets/scripts',
    icon: '📝',
  },
];

const orgSettings = [
  {
    title: 'Members',
    desc: 'Invite and manage access',
    href: '/vibeshield/product/org-settings#members',
    icon: '👥',
  },
  {
    title: 'Subscription',
    desc: 'Plan and billing',
    href: '/vibeshield/product/org-settings#subscription',
    icon: '💳',
  },
  {
    title: 'Remote Repo',
    desc: 'Sync agent configs',
    href: '/vibeshield/product/org-settings#remote-repository',
    icon: '🔗',
  },
  {
    title: 'Launch Profiles',
    desc: 'Deployment defaults',
    href: '/vibeshield/product/org-settings#launch-profiles',
    icon: '🚀',
  },
  {
    title: 'Launch Agents',
    desc: 'Cloud deployments',
    href: '/vibeshield/product/org-settings#launch-agents',
    icon: '☁️',
  },
  {
    title: 'LLM Provider',
    desc: 'Org-wide model setup',
    href: '/vibeshield/product/org-settings#llm-provider',
    icon: '🧠',
  },
];

const chatModes = [
  {
    title: 'Single-Agent',
    desc: 'Focused, direct chats',
    href: '/vibeshield/product/chat-modes#single-agent-mode',
    icon: '🎯',
  },
  {
    title: 'Multi-Agent',
    desc: 'Coordinated problem solving',
    href: '/vibeshield/product/chat-modes#multi-agent-mode',
    icon: '🤝',
  },
  {
    title: 'Choosing a Mode',
    desc: 'When to use each',
    href: '/vibeshield/product/chat-modes#choosing-the-right-mode',
    icon: '🧭',
  },
];

function Card({
  title,
  desc,
  href,
  icon,
}: {
  title: string;
  desc: string;
  href: string;
  icon: string;
}) {
  return (
    <Link href={href} className={styles.card}>
      <span className={styles.icon}>{icon}</span>
      <div>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{desc}</div>
      </div>
    </Link>
  );
}

function Section({
  title,
  description,
  linkLabel,
  linkHref,
  items,
}: {
  title: string;
  description: string;
  linkLabel: string;
  linkHref: string;
  items: Array<{ title: string; desc: string; href: string; icon: string }>;
}) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <p className={styles.sectionDescription}>{description}</p>
      <div className={styles.grid}>
        {items.map((item) => (
          <Card key={item.href} {...item} />
        ))}
      </div>
      <Link className={styles.sectionLink} href={linkHref}>
        {linkLabel}
      </Link>
    </section>
  );
}

export default function ProductQuickAccess() {
  return (
    <div className={styles.wrapper}>
      <Section
        title="Asset Types"
        description="Build your core operational blocks here: agents, connectors, knowledge, reports, queries, workflows, and scripts. These assets power everything your team automates and observes."
        linkLabel="Explore Assets →"
        linkHref="/vibeshield/product/assets/agents"
        items={assets}
      />
      <Section
        title="Organization Settings"
        description="Manage your team setup and shared defaults across the org. Configure billing, member access, repo sync, launch profiles, and LLM provider settings."
        linkLabel="Open Org Settings →"
        linkHref="/vibeshield/product/org-settings"
        items={orgSettings}
      />
      <Section
        title="Chat Modes"
        description="Choose how you interact with agents. Build Mode is for creating assets and tuning behavior, while Chat Mode is for read-only, cross-agent visibility."
        linkLabel="Read about Agent Chat →"
        linkHref="/vibeshield/product/chat-modes"
        items={chatModes}
      />
    </div>
  );
}
