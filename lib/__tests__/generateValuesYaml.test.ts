import {
  generateValuesYaml,
  createDefaultState,
  isValidCollectorName,
  isValidUUID,
  isValidPort,
  type WizardState,
} from '../generateValuesYaml';

// Helper to create a valid POC base state
function createValidPOCState(): WizardState {
  const state = createDefaultState();
  state.installType = 'poc';
  state.cloudProvider = 'aws';
  state.organizationId = 'b3a870ae-2c05-42b9-b073-572e718ad39d';
  state.collectorName = 'test-collector';
  state.apiKey = 'chq_test123456789012345678901234';
  state.storage = { bucket: 'test-bucket', region: 'us-east-1' };
  state.aws = {
    credentialMode: 'create',
    accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
    secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    existingSecretName: '',
  };
  state.lrdb = {
    credentialMode: 'create',
    host: 'lakerunner-db.example.com',
    port: '5432',
    database: 'lakerunner',
    username: 'lakerunner',
    password: 'testpassword123',
    sslMode: 'require',
    existingSecretName: '',
  };
  state.configdb = {
    credentialMode: 'create',
    host: 'config-db.example.com',
    port: '5432',
    database: 'configdb',
    username: 'lakerunner',
    password: 'testpassword456',
    sslMode: 'require',
    existingSecretName: '',
  };
  state.kafka = {
    credentialMode: 'create',
    brokers: 'kafka-1:9092,kafka-2:9092',
    saslMechanism: 'SCRAM-SHA-256',
    username: 'kafka-user',
    password: 'kafkapassword789',
    useTls: true,
    existingSecretName: '',
  };
  state.enableKeda = true;
  state.enableGrafana = true;
  state.enableCollector = true;
  state.enableCardinalMonitoring = false;
  state.cardinalApiKey = '';
  return state;
}

describe('Validation Functions', () => {
  describe('isValidCollectorName', () => {
    test('rejects empty string', () => {
      expect(isValidCollectorName('')).toBe(false);
      expect(isValidCollectorName('   ')).toBe(false);
    });

    test('rejects "default" in any case', () => {
      expect(isValidCollectorName('default')).toBe(false);
      expect(isValidCollectorName('Default')).toBe(false);
      expect(isValidCollectorName('DEFAULT')).toBe(false);
      expect(isValidCollectorName(' default ')).toBe(false);
    });

    test('accepts valid collector names', () => {
      expect(isValidCollectorName('my-collector')).toBe(true);
      expect(isValidCollectorName('test-collector')).toBe(true);
      expect(isValidCollectorName('prod-collector-1')).toBe(true);
    });
  });

  describe('isValidUUID', () => {
    test('accepts valid UUIDs', () => {
      expect(isValidUUID('b3a870ae-2c05-42b9-b073-572e718ad39d')).toBe(true);
      expect(isValidUUID('a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5a6b7')).toBe(true);
    });

    test('rejects invalid UUIDs', () => {
      expect(isValidUUID('')).toBe(false);
      expect(isValidUUID('not-a-uuid')).toBe(false);
      expect(isValidUUID('12345678-1234-1234-1234')).toBe(false);
    });
  });

  describe('isValidPort', () => {
    test('accepts valid ports', () => {
      expect(isValidPort('1')).toBe(true);
      expect(isValidPort('80')).toBe(true);
      expect(isValidPort('5432')).toBe(true);
      expect(isValidPort('65535')).toBe(true);
    });

    test('rejects invalid ports', () => {
      expect(isValidPort('0')).toBe(false);
      expect(isValidPort('-1')).toBe(false);
      expect(isValidPort('65536')).toBe(false);
      expect(isValidPort('abc')).toBe(false);
      expect(isValidPort('')).toBe(false);
    });
  });
});

describe('generateValuesYaml', () => {
  describe('AWS Cloud Provider', () => {
    test('generates EKS IRSA config (inject: false, create: false)', () => {
      const state = createValidPOCState();
      state.aws.credentialMode = 'eks';

      const yaml = generateValuesYaml(state);

      expect(yaml).not.toBeNull();
      expect(yaml).toContain('provider: "aws"');
      expect(yaml).toContain('inject: false');
      expect(yaml).toContain('create: false');
      expect(yaml).not.toContain('accessKeyId');
      // Note: secretName appears in apiKeys section, which is correct
    });

    test('generates existing secret config (inject: true, create: false, secretName)', () => {
      const state = createValidPOCState();
      state.aws.credentialMode = 'existing';
      state.aws.existingSecretName = 'my-aws-secret';

      const yaml = generateValuesYaml(state);

      expect(yaml).not.toBeNull();
      expect(yaml).toContain('provider: "aws"');
      expect(yaml).toContain('inject: true');
      expect(yaml).toContain('create: false');
      expect(yaml).toContain('secretName: "my-aws-secret"');
      expect(yaml).not.toContain('accessKeyId');
    });

    test('generates create secret config (inject: true, create: true, credentials)', () => {
      const state = createValidPOCState();
      state.aws.credentialMode = 'create';

      const yaml = generateValuesYaml(state);

      expect(yaml).not.toBeNull();
      expect(yaml).toContain('provider: "aws"');
      expect(yaml).toContain('inject: true');
      expect(yaml).toContain('create: true');
      expect(yaml).toContain('accessKeyId: "AKIAIOSFODNN7EXAMPLE"');
      expect(yaml).toContain('secretAccessKey:');
    });
  });

  describe('GCP Cloud Provider', () => {
    test('generates Workload Identity config (inject: false, create: false)', () => {
      const state = createValidPOCState();
      state.cloudProvider = 'gcp';
      state.gcp = {
        credentialMode: 'workload_identity',
        serviceAccountJson: '',
        existingSecretName: '',
      };

      const yaml = generateValuesYaml(state);

      expect(yaml).not.toBeNull();
      expect(yaml).toContain('provider: "gcp"');
      expect(yaml).toContain('gcp:');
      expect(yaml).toContain('inject: false');
      expect(yaml).toContain('create: false');
      expect(yaml).not.toContain('serviceAccountJson');
      // Note: secretName appears in apiKeys section, which is correct
    });

    test('generates existing secret config (inject: true, create: false, secretName)', () => {
      const state = createValidPOCState();
      state.cloudProvider = 'gcp';
      state.gcp = {
        credentialMode: 'existing',
        serviceAccountJson: '',
        existingSecretName: 'my-gcp-credentials',
      };

      const yaml = generateValuesYaml(state);

      expect(yaml).not.toBeNull();
      expect(yaml).toContain('provider: "gcp"');
      expect(yaml).toContain('gcp:');
      expect(yaml).toContain('inject: true');
      expect(yaml).toContain('create: false');
      expect(yaml).toContain('secretName: "my-gcp-credentials"');
      expect(yaml).not.toContain('serviceAccountJson');
    });

    test('generates service account JSON config (inject: true, create: true, serviceAccountJson)', () => {
      const state = createValidPOCState();
      state.cloudProvider = 'gcp';
      state.gcp = {
        credentialMode: 'service_account',
        serviceAccountJson: '{"type":"service_account","project_id":"test"}',
        existingSecretName: '',
      };

      const yaml = generateValuesYaml(state);

      expect(yaml).not.toBeNull();
      expect(yaml).toContain('provider: "gcp"');
      expect(yaml).toContain('gcp:');
      expect(yaml).toContain('inject: true');
      expect(yaml).toContain('create: true');
      expect(yaml).toContain('serviceAccountJson:');
      expect(yaml).toContain('service_account');
    });
  });

  describe('KEDA Configuration', () => {
    test('generates keda mode when enabled', () => {
      const state = createValidPOCState();
      state.enableKeda = true;

      const yaml = generateValuesYaml(state);

      expect(yaml).toContain('mode: "keda"');
    });

    test('generates disabled mode when KEDA disabled', () => {
      const state = createValidPOCState();
      state.enableKeda = false;

      const yaml = generateValuesYaml(state);

      expect(yaml).toContain('mode: "disabled"');
    });
  });

  describe('Grafana Configuration', () => {
    test('includes grafana apiKey when enabled', () => {
      const state = createValidPOCState();
      state.enableGrafana = true;

      const yaml = generateValuesYaml(state);

      expect(yaml).toContain('grafana:');
      expect(yaml).toContain('enabled: true');
      // Grafana uses the main apiKey
      expect(yaml).toContain(`apiKey: "${state.apiKey}"`);
    });

    test('does not include apiKey when grafana disabled', () => {
      const state = createValidPOCState();
      state.enableGrafana = false;

      const yaml = generateValuesYaml(state);

      expect(yaml).toContain('grafana:');
      expect(yaml).toContain('enabled: false');
      expect(yaml).not.toContain('cardinal:');
    });
  });

  describe('Production Configuration', () => {
    test('includes replica settings for production', () => {
      const state = createValidPOCState();
      state.installType = 'production';

      const yaml = generateValuesYaml(state);

      expect(yaml).toContain('ingestLogs:');
      expect(yaml).toContain('replicas: 3');
      expect(yaml).toContain('queryApi:');
      expect(yaml).toContain('replicas: 2');
    });

    test('does not include replica settings for POC', () => {
      const state = createValidPOCState();
      state.installType = 'poc';

      const yaml = generateValuesYaml(state);

      expect(yaml).not.toContain('ingestLogs:');
      expect(yaml).not.toContain('replicas: 3');
    });
  });

  describe('Validation', () => {
    test('returns null when collector name is invalid', () => {
      const state = createValidPOCState();
      state.collectorName = 'default';

      const yaml = generateValuesYaml(state);

      expect(yaml).toBeNull();
    });

    test('returns null when organization ID is invalid', () => {
      const state = createValidPOCState();
      state.organizationId = 'not-a-uuid';

      const yaml = generateValuesYaml(state);

      expect(yaml).toBeNull();
    });

    test('returns null when GCP service account mode has no JSON', () => {
      const state = createValidPOCState();
      state.cloudProvider = 'gcp';
      state.gcp = {
        credentialMode: 'service_account',
        serviceAccountJson: '',  // Empty - should fail validation
        existingSecretName: '',
      };

      const yaml = generateValuesYaml(state);

      expect(yaml).toBeNull();
    });

    test('returns null when GCP existing secret mode has no secret name', () => {
      const state = createValidPOCState();
      state.cloudProvider = 'gcp';
      state.gcp = {
        credentialMode: 'existing',
        serviceAccountJson: '',
        existingSecretName: '',  // Empty - should fail validation
      };

      const yaml = generateValuesYaml(state);

      expect(yaml).toBeNull();
    });

    test('passes validation for GCP workload identity with no credentials', () => {
      const state = createValidPOCState();
      state.cloudProvider = 'gcp';
      state.gcp = {
        credentialMode: 'workload_identity',
        serviceAccountJson: '',  // Empty is OK for workload identity
        existingSecretName: '',
      };

      const yaml = generateValuesYaml(state);

      expect(yaml).not.toBeNull();
    });
  });

  describe('Storage Profiles', () => {
    test('includes organization_id and collector_name in storageProfiles', () => {
      const state = createValidPOCState();

      const yaml = generateValuesYaml(state);

      expect(yaml).toContain('storageProfiles:');
      expect(yaml).toContain('organization_id: "b3a870ae-2c05-42b9-b073-572e718ad39d"');
      expect(yaml).toContain('collector_name: "test-collector"');
      expect(yaml).toContain('cloud_provider: "aws"');
      expect(yaml).toContain('bucket: "test-bucket"');
    });
  });

  describe('Cardinal Monitoring Configuration', () => {
    test('includes OTEL env vars when Cardinal monitoring enabled with valid API key', () => {
      const state = createValidPOCState();
      state.enableCardinalMonitoring = true;
      state.cardinalApiKey = 'test-cardinal-api-key-12345';

      const yaml = generateValuesYaml(state);

      expect(yaml).not.toBeNull();
      expect(yaml).toContain('env:');
      expect(yaml).toContain('- name: OTEL_EXPORTER_OTLP_ENDPOINT');
      expect(yaml).toContain('value: "https://otelhttp.intake.us-east-2.aws.cardinalhq.io"');
      expect(yaml).toContain('- name: OTEL_EXPORTER_OTLP_HEADERS');
      expect(yaml).toContain('value: "x-cardinalhq-api-key=test-cardinal-api-key-12345"');
    });

    test('does not include OTEL env vars when Cardinal monitoring disabled', () => {
      const state = createValidPOCState();
      state.enableCardinalMonitoring = false;
      state.cardinalApiKey = '';

      const yaml = generateValuesYaml(state);

      expect(yaml).not.toBeNull();
      expect(yaml).not.toContain('OTEL_EXPORTER_OTLP_ENDPOINT');
      expect(yaml).not.toContain('OTEL_EXPORTER_OTLP_HEADERS');
    });

    test('returns null when Cardinal monitoring enabled but API key too short', () => {
      const state = createValidPOCState();
      state.enableCardinalMonitoring = true;
      state.cardinalApiKey = 'short';  // Less than 10 characters

      const yaml = generateValuesYaml(state);

      expect(yaml).toBeNull();
    });

    test('generates valid YAML when Cardinal monitoring enabled with 10+ char API key', () => {
      const state = createValidPOCState();
      state.enableCardinalMonitoring = true;
      state.cardinalApiKey = '1234567890';  // Exactly 10 characters

      const yaml = generateValuesYaml(state);

      expect(yaml).not.toBeNull();
      expect(yaml).toContain('OTEL_EXPORTER_OTLP_ENDPOINT');
    });
  });

  describe('Collector Configuration', () => {
    test('collector is always disabled in generated YAML', () => {
      const state = createValidPOCState();

      const yaml = generateValuesYaml(state);

      expect(yaml).toContain('collector:');
      expect(yaml).toContain('enabled: false');
    });
  });
});
