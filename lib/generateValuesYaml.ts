// Types for the Install Wizard state
export type InstallType = 'poc' | 'production';
export type CloudProvider = 'aws' | 'gcp' | 'azure';
export type AWSCredentialMode = 'create' | 'existing' | 'eks';
export type GCPCredentialMode = 'workload_identity' | 'service_account' | 'existing';
export type SecretMode = 'create' | 'existing';

export interface StorageConfig {
  bucket: string;
  region: string;
  endpoint?: string;
}

export interface AWSConfig {
  credentialMode: AWSCredentialMode;
  accessKeyId: string;
  secretAccessKey: string;
  existingSecretName: string;
}

export interface GCPConfig {
  credentialMode: GCPCredentialMode;
  serviceAccountJson: string;
  existingSecretName: string;
}

export interface AzureConfig {
  storageAccountName: string;
  storageAccountKey: string;
  containerName: string;
}

export interface PostgresConfig {
  credentialMode: SecretMode;
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
  sslMode: string;
  existingSecretName: string;
}

export interface KafkaConfig {
  credentialMode: SecretMode;
  brokers: string;
  saslMechanism: string;
  username: string;
  password: string;
  useTls: boolean;
  existingSecretName: string;
}

export interface WizardState {
  installType: InstallType;
  cloudProvider: CloudProvider;
  organizationId: string;
  collectorName: string;
  apiKey: string;
  storage: StorageConfig;
  aws: AWSConfig;
  gcp: GCPConfig;
  azure: AzureConfig;
  lrdb: PostgresConfig;
  configdb: PostgresConfig;
  kafka: KafkaConfig;
  enableKeda: boolean;
  enableGrafana: boolean;
  enableCollector: boolean;
  enableCardinalMonitoring: boolean;
  cardinalApiKey: string;
}

// Validation functions
export function isValidCollectorName(name: string): boolean {
  const trimmed = name.trim().toLowerCase();
  return trimmed !== '' && trimmed !== 'default';
}

export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid.trim());
}

export function isValidPort(port: string): boolean {
  const portNum = parseInt(port, 10);
  return !isNaN(portNum) && portNum >= 1 && portNum <= 65535;
}

export function isBasicsConfigured(state: WizardState): boolean {
  if (!isValidCollectorName(state.collectorName)) return false;
  if (!isValidUUID(state.organizationId)) return false;
  if (!state.apiKey.trim()) return false;

  // Validate Cardinal monitoring API key if enabled
  if (state.enableCardinalMonitoring && state.cardinalApiKey.trim().length < 10) return false;

  // Validate storage configuration
  if (!state.storage.bucket.trim()) return false;
  if (!state.storage.region.trim()) return false;

  // Validate cloud provider credentials
  if (state.cloudProvider === 'aws') {
    if (state.aws.credentialMode === 'create') {
      if (!state.aws.accessKeyId.trim()) return false;
      if (!state.aws.secretAccessKey.trim()) return false;
    } else if (state.aws.credentialMode === 'existing') {
      if (!state.aws.existingSecretName.trim()) return false;
    }
  } else if (state.cloudProvider === 'gcp') {
    if (state.gcp.credentialMode === 'service_account') {
      if (!state.gcp.serviceAccountJson.trim()) return false;
    } else if (state.gcp.credentialMode === 'existing') {
      if (!state.gcp.existingSecretName.trim()) return false;
    }
    // workload_identity requires no additional fields
  }

  // For POC and Production, validate database and Kafka configuration
  if (state.installType === 'poc' || state.installType === 'production') {
    // Validate lrdb
    if (!state.lrdb.host.trim()) return false;
    if (!isValidPort(state.lrdb.port)) return false;
    if (!state.lrdb.database.trim()) return false;
    if (!state.lrdb.username.trim()) return false;
    if (state.lrdb.credentialMode === 'create' && !state.lrdb.password.trim()) return false;
    if (state.lrdb.credentialMode === 'existing' && !state.lrdb.existingSecretName.trim()) return false;

    // Validate configdb
    if (!state.configdb.host.trim()) return false;
    if (!isValidPort(state.configdb.port)) return false;
    if (!state.configdb.database.trim()) return false;
    if (!state.configdb.username.trim()) return false;
    if (state.configdb.credentialMode === 'create' && !state.configdb.password.trim()) return false;
    if (state.configdb.credentialMode === 'existing' && !state.configdb.existingSecretName.trim()) return false;

    // Validate kafka
    if (!state.kafka.brokers.trim()) return false;
    if (state.kafka.credentialMode === 'create' && !state.kafka.username.trim()) return false;
    if (state.kafka.credentialMode === 'create' && !state.kafka.password.trim()) return false;
    if (state.kafka.credentialMode === 'existing' && !state.kafka.existingSecretName.trim()) return false;
  }

  return true;
}

// Default state factory
export function createDefaultState(): WizardState {
  return {
    installType: 'poc',
    cloudProvider: 'aws',
    organizationId: '',
    collectorName: '',
    apiKey: '',
    storage: { bucket: '', region: 'us-east-1', endpoint: '' },
    aws: { credentialMode: 'eks', accessKeyId: '', secretAccessKey: '', existingSecretName: '' },
    gcp: { credentialMode: 'workload_identity', serviceAccountJson: '', existingSecretName: '' },
    azure: { storageAccountName: '', storageAccountKey: '', containerName: '' },
    lrdb: { credentialMode: 'create', host: '', port: '5432', database: 'lakerunner', username: '', password: '', sslMode: 'require', existingSecretName: '' },
    configdb: { credentialMode: 'create', host: '', port: '5432', database: 'configdb', username: '', password: '', sslMode: 'require', existingSecretName: '' },
    kafka: { credentialMode: 'create', brokers: '', saslMechanism: 'PLAIN', username: '', password: '', useTls: true, existingSecretName: '' },
    enableKeda: true,
    enableGrafana: true,
    enableCollector: true,
    enableCardinalMonitoring: true,
    cardinalApiKey: '',
  };
}

// YAML generator
export function generateValuesYaml(state: WizardState): string | null {
  // Check if basics are configured
  if (!isBasicsConfigured(state)) {
    return null;
  }

  const lines: string[] = ['# Lakerunner Values Configuration', '# Generated by Cardinal Install Wizard', ''];

  // Global settings
  lines.push('global:');
  lines.push('  autoscaling:');
  lines.push(`    mode: "${state.enableKeda ? 'keda' : 'disabled'}"`);
  if (state.enableCardinalMonitoring && state.cardinalApiKey.trim()) {
    lines.push('  env:');
    lines.push('    - name: OTEL_EXPORTER_OTLP_ENDPOINT');
    lines.push('      value: "https://otelhttp.intake.us-east-2.aws.cardinalhq.io"');
    lines.push('    - name: OTEL_EXPORTER_OTLP_HEADERS');
    lines.push(`      value: "x-cardinalhq-api-key=${state.cardinalApiKey}"`);
  }
  lines.push('');

  // API Keys
  lines.push('apiKeys:');
  lines.push('  source: config');
  lines.push('  secretName: "apikeys"');
  lines.push('  create: true');
  lines.push('  yaml:');
  lines.push(`    - organization_id: "${state.organizationId}"`);
  lines.push('      keys:');
  lines.push(`        - "${state.apiKey}"`);
  lines.push('');

  // Cloud provider credentials
  lines.push('cloudProvider:');
  lines.push(`  provider: "${state.cloudProvider}"`);
  if (state.cloudProvider === 'aws') {
    lines.push('  aws:');
    lines.push(`    region: "${state.storage.region}"`);
    if (state.aws.credentialMode === 'eks') {
      // Use EKS-provided credentials (IRSA/Pod Identity)
      lines.push('    inject: false');
      lines.push('    create: false');
    } else if (state.aws.credentialMode === 'existing') {
      // Use existing secret
      lines.push('    inject: true');
      lines.push('    create: false');
      lines.push(`    secretName: "${state.aws.existingSecretName}"`);
    } else {
      // Create new secret
      lines.push('    inject: true');
      lines.push('    create: true');
      lines.push(`    accessKeyId: "${state.aws.accessKeyId}"`);
      lines.push(`    secretAccessKey: "${state.aws.secretAccessKey}"`);
    }
  } else if (state.cloudProvider === 'gcp') {
    lines.push('  gcp:');
    if (state.gcp.credentialMode === 'workload_identity') {
      // Workload Identity (recommended for GKE)
      lines.push('    inject: false');
      lines.push('    create: false');
    } else if (state.gcp.credentialMode === 'existing') {
      // Existing secret with GOOGLE_APPLICATION_CREDENTIALS
      lines.push('    inject: true');
      lines.push('    create: false');
      lines.push(`    secretName: "${state.gcp.existingSecretName}"`);
    } else {
      // Service Account JSON
      lines.push('    inject: true');
      lines.push('    create: true');
      lines.push(`    serviceAccountJson: '${state.gcp.serviceAccountJson}'`);
    }
  } else if (state.cloudProvider === 'azure') {
    lines.push('  azure:');
    lines.push(`    storageAccountName: "${state.azure.storageAccountName}"`);
    lines.push(`    storageAccountKey: "${state.azure.storageAccountKey}"`);
  }
  lines.push('');

  // Storage profiles
  lines.push('storageProfiles:');
  lines.push('  source: config');
  lines.push('  create: true');
  lines.push('  yaml:');
  lines.push(`    - organization_id: "${state.organizationId}"`);
  lines.push(`      collector_name: "${state.collectorName}"`);
  lines.push(`      cloud_provider: "${state.cloudProvider}"`);
  lines.push(`      region: "${state.storage.region}"`);
  if (state.cloudProvider === 'azure') {
    lines.push(`      bucket: "${state.azure.containerName}"`);
  } else {
    lines.push(`      bucket: "${state.storage.bucket}"`);
  }
  if (state.storage.endpoint) {
    lines.push(`      endpoint: "${state.storage.endpoint}"`);
  }
  lines.push('');

  // Database configuration (POC and Production)
  if (state.installType === 'poc' || state.installType === 'production') {
    lines.push('database:');
    if (state.lrdb.credentialMode === 'existing') {
      lines.push('  create: false');
      lines.push(`  secretName: "${state.lrdb.existingSecretName}"`);
    } else {
      lines.push('  create: true');
    }
    lines.push('  lrdb:');
    lines.push(`    host: "${state.lrdb.host}"`);
    lines.push(`    port: ${state.lrdb.port}`);
    lines.push(`    name: "${state.lrdb.database}"`);
    lines.push(`    username: "${state.lrdb.username}"`);
    if (state.lrdb.credentialMode === 'create') {
      lines.push(`    password: "${state.lrdb.password}"`);
    }
    lines.push(`    sslMode: "${state.lrdb.sslMode}"`);
    lines.push('');

    lines.push('configdb:');
    if (state.configdb.credentialMode === 'existing') {
      lines.push('  create: false');
      lines.push(`  secretName: "${state.configdb.existingSecretName}"`);
    } else {
      lines.push('  create: true');
    }
    lines.push('  lrdb:');
    lines.push(`    host: "${state.configdb.host}"`);
    lines.push(`    port: ${state.configdb.port}`);
    lines.push(`    name: "${state.configdb.database}"`);
    lines.push(`    username: "${state.configdb.username}"`);
    if (state.configdb.credentialMode === 'create') {
      lines.push(`    password: "${state.configdb.password}"`);
    }
    lines.push(`    sslMode: "${state.configdb.sslMode}"`);
    lines.push('');

    lines.push('kafka:');
    if (state.kafka.credentialMode === 'existing') {
      lines.push('  create: false');
      lines.push(`  secretName: "${state.kafka.existingSecretName}"`);
    } else {
      lines.push('  create: true');
    }
    lines.push(`  brokers: "${state.kafka.brokers}"`);
    lines.push('  sasl:');
    lines.push('    enabled: true');
    lines.push(`    mechanism: "${state.kafka.saslMechanism}"`);
    if (state.kafka.credentialMode === 'create') {
      lines.push(`    username: "${state.kafka.username}"`);
      lines.push(`    password: "${state.kafka.password}"`);
    }
    lines.push('  tls:');
    lines.push(`    enabled: ${state.kafka.useTls}`);
    lines.push('');
  }

  // Production-specific settings
  if (state.installType === 'production') {
    lines.push('# Production replica settings');
    lines.push('ingestLogs:');
    lines.push('  replicas: 3');
    lines.push('ingestMetrics:');
    lines.push('  replicas: 3');
    lines.push('ingestTraces:');
    lines.push('  replicas: 3');
    lines.push('');
    lines.push('queryApi:');
    lines.push('  replicas: 2');
    lines.push('');
  }

  // Grafana settings
  lines.push('grafana:');
  lines.push(`  enabled: ${state.enableGrafana}`);
  if (state.enableGrafana) {
    lines.push('  cardinal:');
    lines.push(`    apiKey: "${state.apiKey}"`);
  }
  lines.push('');

  // Collector settings (disabled - use external collector)
  lines.push('collector:');
  lines.push('  enabled: false');
  lines.push('');

  return lines.join('\n');
}
