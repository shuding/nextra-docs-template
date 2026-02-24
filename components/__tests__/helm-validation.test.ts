import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import {
  generateValuesYaml,
  createDefaultState,
  type WizardState,
} from '../../lib/generateValuesYaml';

// These tests validate that the wizard-generated YAML can be successfully
// templated with the actual Lakerunner helm chart using `helm template`

describe('Helm Template Validation', () => {
  const CHART_URL = 'oci://public.ecr.aws/cardinalhq.io/lakerunner';
  let tempDir: string;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lakerunner-test-'));
  });

  afterAll(() => {
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  function validateWithHelm(yamlContent: string, testName: string): { success: boolean; output: string; error: string } {
    const valuesFile = path.join(tempDir, `${testName}-values.yaml`);
    fs.writeFileSync(valuesFile, yamlContent);

    const result = spawnSync('helm', ['template', testName, CHART_URL, '--values', valuesFile], {
      encoding: 'utf-8',
      timeout: 30000,
    });

    return {
      success: result.status === 0,
      output: result.stdout || '',
      error: result.stderr || '',
    };
  }

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

  describe('AWS Configurations', () => {
    test('POC with AWS create credentials passes helm template', () => {
      const state = createValidPOCState();
      state.aws.credentialMode = 'create';

      const yaml = generateValuesYaml(state);
      expect(yaml).not.toBeNull();

      const result = validateWithHelm(yaml!, 'aws-create-test');

      if (!result.success) {
        console.error('Helm template error:', result.error);
      }

      expect(result.success).toBe(true);
      expect(result.output).toContain('kind: Deployment');
    }, 60000);

    test('POC with AWS existing secret passes helm template', () => {
      const state = createValidPOCState();
      state.aws.credentialMode = 'existing';
      state.aws.existingSecretName = 'aws-credentials';

      const yaml = generateValuesYaml(state);
      expect(yaml).not.toBeNull();

      const result = validateWithHelm(yaml!, 'aws-existing-test');

      if (!result.success) {
        console.error('Helm template error:', result.error);
      }

      expect(result.success).toBe(true);
    }, 60000);

    test('POC with EKS IRSA passes helm template', () => {
      const state = createValidPOCState();
      state.aws.credentialMode = 'eks';

      const yaml = generateValuesYaml(state);
      expect(yaml).not.toBeNull();

      const result = validateWithHelm(yaml!, 'aws-eks-test');

      if (!result.success) {
        console.error('Helm template error:', result.error);
      }

      expect(result.success).toBe(true);
    }, 60000);
  });

  describe('GCP Configurations', () => {
    test('POC with GCP Workload Identity passes helm template', () => {
      const state = createValidPOCState();
      state.cloudProvider = 'gcp';
      state.storage.region = 'us-central1';
      state.gcp = {
        credentialMode: 'workload_identity',
        serviceAccountJson: '',
        existingSecretName: '',
      };

      const yaml = generateValuesYaml(state);
      expect(yaml).not.toBeNull();

      const result = validateWithHelm(yaml!, 'gcp-workload-identity-test');

      if (!result.success) {
        console.error('Helm template error:', result.error);
      }

      expect(result.success).toBe(true);
      expect(result.output).toContain('kind: Deployment');
    }, 60000);

    test('POC with GCP existing secret passes helm template', () => {
      const state = createValidPOCState();
      state.cloudProvider = 'gcp';
      state.storage.region = 'us-central1';
      state.gcp = {
        credentialMode: 'existing',
        serviceAccountJson: '',
        existingSecretName: 'my-gcp-credentials',
      };

      const yaml = generateValuesYaml(state);
      expect(yaml).not.toBeNull();

      const result = validateWithHelm(yaml!, 'gcp-existing-test');

      if (!result.success) {
        console.error('Helm template error:', result.error);
      }

      expect(result.success).toBe(true);
    }, 60000);

    test('POC with GCP service account JSON passes helm template', () => {
      const state = createValidPOCState();
      state.cloudProvider = 'gcp';
      state.storage.region = 'us-central1';
      state.gcp = {
        credentialMode: 'service_account',
        serviceAccountJson: '{"type":"service_account","project_id":"test-project","private_key_id":"key123"}',
        existingSecretName: '',
      };

      const yaml = generateValuesYaml(state);
      expect(yaml).not.toBeNull();

      const result = validateWithHelm(yaml!, 'gcp-service-account-test');

      if (!result.success) {
        console.error('Helm template error:', result.error);
      }

      expect(result.success).toBe(true);
    }, 60000);
  });

  describe('Production Configuration', () => {
    test('Production with existing secrets passes helm template', () => {
      const state = createValidPOCState();
      state.installType = 'production';
      state.aws.credentialMode = 'existing';
      state.aws.existingSecretName = 'aws-credentials';
      state.lrdb.credentialMode = 'existing';
      state.lrdb.existingSecretName = 'lrdb-credentials';
      state.configdb.credentialMode = 'existing';
      state.configdb.existingSecretName = 'configdb-credentials';
      state.kafka.credentialMode = 'existing';
      state.kafka.existingSecretName = 'kafka-credentials';
      state.enableGrafana = false;

      const yaml = generateValuesYaml(state);
      expect(yaml).not.toBeNull();

      const result = validateWithHelm(yaml!, 'production-test');

      if (!result.success) {
        console.error('Helm template error:', result.error);
      }

      expect(result.success).toBe(true);
      // Production should have replica settings
      expect(yaml).toContain('replicas: 3');
    }, 60000);
  });

  describe('KEDA Configuration', () => {
    test('Configuration without KEDA passes helm template', () => {
      const state = createValidPOCState();
      state.enableKeda = false;

      const yaml = generateValuesYaml(state);
      expect(yaml).not.toBeNull();
      expect(yaml).toContain('mode: "disabled"');

      const result = validateWithHelm(yaml!, 'no-keda-test');

      if (!result.success) {
        console.error('Helm template error:', result.error);
      }

      expect(result.success).toBe(true);
      // Should not contain ScaledObject when KEDA disabled
      expect(result.output).not.toContain('kind: ScaledObject');
    }, 60000);
  });

  describe('Cardinal Monitoring Configuration', () => {
    test('POC without Cardinal monitoring passes helm template', () => {
      const state = createValidPOCState();
      state.enableCardinalMonitoring = false;
      state.cardinalApiKey = '';

      const yaml = generateValuesYaml(state);
      expect(yaml).not.toBeNull();
      expect(yaml).not.toContain('OTEL_EXPORTER_OTLP_ENDPOINT');

      const result = validateWithHelm(yaml!, 'no-monitoring-test');

      if (!result.success) {
        console.error('Helm template error:', result.error);
      }

      expect(result.success).toBe(true);
      expect(result.output).toContain('kind: Deployment');
    }, 60000);

    test('POC with Cardinal monitoring passes helm template and includes env vars', () => {
      const state = createValidPOCState();
      state.enableCardinalMonitoring = true;
      state.cardinalApiKey = 'test-cardinal-api-key-12345';

      const yaml = generateValuesYaml(state);
      expect(yaml).not.toBeNull();
      expect(yaml).toContain('OTEL_EXPORTER_OTLP_ENDPOINT');
      expect(yaml).toContain('x-cardinalhq-api-key=test-cardinal-api-key-12345');

      const result = validateWithHelm(yaml!, 'with-monitoring-test');

      if (!result.success) {
        console.error('Helm template error:', result.error);
      }

      expect(result.success).toBe(true);
      expect(result.output).toContain('kind: Deployment');
      // Verify env vars are attached to deployments
      expect(result.output).toContain('OTEL_EXPORTER_OTLP_ENDPOINT');
      expect(result.output).toContain('otelhttp.intake.us-east-2.aws.cardinalhq.io');
    }, 60000);

    test('Production with Cardinal monitoring passes helm template', () => {
      const state = createValidPOCState();
      state.installType = 'production';
      state.aws.credentialMode = 'existing';
      state.aws.existingSecretName = 'aws-credentials';
      state.lrdb.credentialMode = 'existing';
      state.lrdb.existingSecretName = 'lrdb-credentials';
      state.configdb.credentialMode = 'existing';
      state.configdb.existingSecretName = 'configdb-credentials';
      state.kafka.credentialMode = 'existing';
      state.kafka.existingSecretName = 'kafka-credentials';
      state.enableCardinalMonitoring = true;
      state.cardinalApiKey = 'prod-cardinal-api-key-12345';

      const yaml = generateValuesYaml(state);
      expect(yaml).not.toBeNull();

      const result = validateWithHelm(yaml!, 'production-monitoring-test');

      if (!result.success) {
        console.error('Helm template error:', result.error);
      }

      expect(result.success).toBe(true);
      expect(result.output).toContain('OTEL_EXPORTER_OTLP_ENDPOINT');
    }, 60000);
  });
});
