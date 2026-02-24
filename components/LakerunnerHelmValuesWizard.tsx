'use client';

import { useState, useCallback } from 'react';
import styles from './LakerunnerHelmValuesWizard.module.css';
import {
  type InstallType,
  type WizardState,
  isValidCollectorName,
  isValidUUID,
  isValidPort,
  createDefaultState,
  generateValuesYaml,
} from '../lib/generateValuesYaml';

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'chq_';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function LakerunnerHelmValuesWizard() {
  const [state, setState] = useState<WizardState>(createDefaultState());
  const [copied, setCopied] = useState(false);

  const updateState = useCallback(<K extends keyof WizardState>(
    key: K,
    value: WizardState[K]
  ) => {
    setState(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateNested = useCallback(<K extends keyof WizardState>(
    key: K,
    field: string,
    value: string | boolean
  ) => {
    setState(prev => ({
      ...prev,
      [key]: { ...(prev[key] as object), [field]: value }
    }));
  }, []);

  const handleGenerateOrgId = () => {
    updateState('organizationId', generateUUID());
  };

  const handleGenerateApiKey = () => {
    updateState('apiKey', generateApiKey());
  };

  const handleInstallTypeChange = (installType: InstallType) => {
    setState(prev => ({
      ...prev,
      installType,
      // POC: Grafana enabled by default
      // Production: Grafana disabled by default
      enableGrafana: installType === 'poc',
    }));
  };

  const handleCopy = async () => {
    const yaml = generateValuesYaml(state);
    if (yaml) {
      await navigator.clipboard.writeText(yaml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const yaml = generateValuesYaml(state);

  return (
    <div className={styles.wizard}>
      <div className={styles.privacyNote}>
        🔒 <strong>Privacy First:</strong> This wizard runs entirely in your browser. No data is sent to any server.
      </div>

      {/* Installation Type Selection */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Installation Type</h3>
        <div className={styles.installTypes}>
          <button
            className={`${styles.typeCard} ${state.installType === 'poc' ? styles.active : ''}`}
            onClick={() => handleInstallTypeChange('poc')}
          >
            <strong>Kubernetes POC</strong>
            <span>Proof of concept with real cloud storage and databases</span>
          </button>
          <button
            className={`${styles.typeCard} ${state.installType === 'production' ? styles.active : ''}`}
            onClick={() => handleInstallTypeChange('production')}
          >
            <strong>Production</strong>
            <span>Full production deployment with HA and autoscaling</span>
          </button>
        </div>
      </section>

      {/* Organization Settings */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Organization Settings</h3>
            <p className={styles.hint}>
              Lakerunner is multi-tenant. Each tenant is an organization, and the collector and API key are used by that organization.
            </p>
            <div className={styles.formGridTwoCol}>
              <div className={styles.formGroup}>
                <label>Organization ID <span className={styles.required}>*</span></label>
                <div className={styles.inputWithButton}>
                  <input
                    type="text"
                    value={state.organizationId}
                    onChange={(e) => updateState('organizationId', e.target.value)}
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    className={state.organizationId && !isValidUUID(state.organizationId) ? styles.inputError : ''}
                  />
                  <button onClick={handleGenerateOrgId} className={styles.generateBtn}>
                    Generate
                  </button>
                </div>
                {state.organizationId && !isValidUUID(state.organizationId) && (
                  <span className={styles.errorText}>
                    Must be a valid UUID format
                  </span>
                )}
                <span className={styles.hint}>
                  Click "Generate" to make a random ID, or enter one you have previously used.
                </span>
              </div>
              <div className={styles.formGroup}>
                <label>Collector Name <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  value={state.collectorName}
                  onChange={(e) => updateState('collectorName', e.target.value)}
                  placeholder="my-collector"
                  className={!isValidCollectorName(state.collectorName) ? styles.inputError : ''}
                />
                {!isValidCollectorName(state.collectorName) && (
                  <span className={styles.errorText}>
                    Collector name is required and cannot be "default"
                  </span>
                )}
              </div>
              <div className={styles.formGroup}>
                <label>API Key <span className={styles.required}>*</span></label>
                <div className={styles.inputWithButton}>
                  <input
                    type="text"
                    value={state.apiKey}
                    onChange={(e) => updateState('apiKey', e.target.value)}
                    placeholder="chq_..."
                    className={!state.apiKey.trim() ? styles.inputError : ''}
                  />
                  <button onClick={handleGenerateApiKey} className={styles.generateBtn}>
                    Generate
                  </button>
                </div>
                <span className={styles.hint}>
                  This will be used by Grafana and other tools to query telemetry for this organization.
                </span>
              </div>
            </div>
          </section>

          {/* Optional Components */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Optional Components</h3>

            {/* Grafana Component */}
            <div className={styles.optionalComponent}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={state.enableGrafana}
                  onChange={(e) => updateState('enableGrafana', e.target.checked)}
                />
                <strong>Grafana</strong>
              </label>
              <span className={styles.hint}>Pre-configured Grafana with Lakerunner datasources</span>
            </div>

            {/* Cardinal Monitoring Component */}
            <div className={styles.optionalComponent}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={state.enableCardinalMonitoring}
                  onChange={(e) => updateState('enableCardinalMonitoring', e.target.checked)}
                />
                <strong>Monitoring by Cardinal</strong>
              </label>
              <span className={styles.hint}>Send Lakerunner telemetry to Cardinal for monitoring. Cardinal will monitor your Lakerunner deployment and provide a dashboard for performance monitoring. We will not see your organization's data, just Lakerunner performance.</span>
              {state.enableCardinalMonitoring && (
                <div className={styles.componentSettings}>
                  <div className={styles.formGroup}>
                    <label>Cardinal Cloud API Key <span className={styles.required}>*</span></label>
                    <input
                      type="text"
                      value={state.cardinalApiKey}
                      onChange={(e) => updateState('cardinalApiKey', e.target.value)}
                      placeholder="your-cardinal-cloud-api-key"
                      className={!state.cardinalApiKey.trim() ? styles.inputError : ''}
                    />
                    <span className={styles.hint}>
                      This is different from the Lakerunner API key above. Sign up at <a href="https://app.cardinalhq.io" target="_blank" rel="noopener noreferrer">app.cardinalhq.io</a> and copy your API key from the dashboard.
                    </span>
                  </div>
                </div>
              )}
              {!state.enableCardinalMonitoring && (
                <div className={styles.componentSettings}>
                  <div className={styles.warningBox}>
                    <strong>⚠️ Warning:</strong> Without Cardinal monitoring, ensure your Lakerunner deployment is properly monitored by another observability solution.
                  </div>
                </div>
              )}
            </div>

            {/* KEDA Component */}
            <div className={styles.optionalComponent}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={state.enableKeda}
                  onChange={(e) => updateState('enableKeda', e.target.checked)}
                />
                <strong>KEDA Autoscaling</strong>
              </label>
              <span className={styles.hint}>Work queue-based autoscaling for production workloads</span>
              {!state.enableKeda && (state.installType === 'poc' || state.installType === 'production') && (
                <div className={styles.componentSettings}>
                  <div className={styles.warningBox}>
                    <strong>⚠️ Warning:</strong> KEDA is highly recommended for {state.installType === 'poc' ? 'POC' : 'production'} deployments.
                    It provides intelligent scaling based on workload backlog, which is essential for micro-batch workloads.
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Cloud Provider */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Cloud Provider</h3>
            <div className={styles.providerSelect}>
              <button
                className={`${styles.providerBtn} ${state.cloudProvider === 'aws' ? styles.active : ''}`}
                onClick={() => updateState('cloudProvider', 'aws')}
              >
                AWS
              </button>
              <button
                className={`${styles.providerBtn} ${state.cloudProvider === 'gcp' ? styles.active : ''}`}
                onClick={() => updateState('cloudProvider', 'gcp')}
              >
                GCP
              </button>
              <button
                className={`${styles.providerBtn} ${styles.disabled}`}
                disabled
              >
                Azure
                <span className={styles.comingSoon}>Coming Soon</span>
              </button>
            </div>

            <div className={styles.formGrid}>
              {state.cloudProvider === 'aws' && (
                <>
                  <div className={styles.formGroup}>
                    <label>S3 Bucket Name <span className={styles.required}>*</span></label>
                    <input
                      type="text"
                      value={state.storage.bucket}
                      onChange={(e) => updateNested('storage', 'bucket', e.target.value)}
                      placeholder="my-lakerunner-bucket"
                      className={!state.storage.bucket.trim() ? styles.inputError : ''}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Region <span className={styles.required}>*</span></label>
                    <input
                      type="text"
                      value={state.storage.region}
                      onChange={(e) => updateNested('storage', 'region', e.target.value)}
                      placeholder="us-east-1"
                      className={!state.storage.region.trim() ? styles.inputError : ''}
                    />
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Credentials</label>
                    <div className={styles.credentialModeSelect}>
                      <button
                        className={`${styles.credentialModeBtn} ${state.aws.credentialMode === 'eks' ? styles.active : ''}`}
                        onClick={() => updateNested('aws', 'credentialMode', 'eks')}
                      >
                        EKS (IRSA/Pod Identity)
                      </button>
                      <button
                        className={`${styles.credentialModeBtn} ${state.aws.credentialMode === 'existing' ? styles.active : ''}`}
                        onClick={() => updateNested('aws', 'credentialMode', 'existing')}
                      >
                        Use Existing Secret
                      </button>
                      <button
                        className={`${styles.credentialModeBtn} ${state.aws.credentialMode === 'create' ? styles.active : ''}`}
                        onClick={() => updateNested('aws', 'credentialMode', 'create')}
                      >
                        Create Secret
                      </button>
                    </div>
                  </div>
                  {state.aws.credentialMode === 'eks' && (
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <span className={styles.hint}>
                        Credentials will be provided by EKS via IAM Roles for Service Accounts (IRSA) or EKS Pod Identity.
                        Ensure your cluster and service account are configured appropriately.
                      </span>
                    </div>
                  )}
                  {state.aws.credentialMode === 'existing' && (
                    <div className={styles.formGroup}>
                      <label>Secret Name <span className={styles.required}>*</span></label>
                      <input
                        type="text"
                        value={state.aws.existingSecretName}
                        onChange={(e) => updateNested('aws', 'existingSecretName', e.target.value)}
                        placeholder="aws-credentials"
                        className={!state.aws.existingSecretName.trim() ? styles.inputError : ''}
                      />
                      <span className={styles.hint}>Name of existing Kubernetes secret containing AWS credentials</span>
                    </div>
                  )}
                  {state.aws.credentialMode === 'create' && (
                    <>
                      <div className={styles.formGroup}>
                        <label>Access Key ID <span className={styles.required}>*</span></label>
                        <input
                          type="text"
                          value={state.aws.accessKeyId}
                          onChange={(e) => updateNested('aws', 'accessKeyId', e.target.value)}
                          placeholder="AKIA..."
                          className={!state.aws.accessKeyId.trim() ? styles.inputError : ''}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Secret Access Key <span className={styles.required}>*</span></label>
                        <input
                          type="password"
                          value={state.aws.secretAccessKey}
                          onChange={(e) => updateNested('aws', 'secretAccessKey', e.target.value)}
                          placeholder="••••••••"
                          className={!state.aws.secretAccessKey.trim() ? styles.inputError : ''}
                        />
                      </div>
                    </>
                  )}
                </>
              )}

              {state.cloudProvider === 'gcp' && (
                <>
                  <div className={styles.formGroup}>
                    <label>GCS Bucket Name <span className={styles.required}>*</span></label>
                    <input
                      type="text"
                      value={state.storage.bucket}
                      onChange={(e) => updateNested('storage', 'bucket', e.target.value)}
                      placeholder="my-lakerunner-bucket"
                      className={!state.storage.bucket.trim() ? styles.inputError : ''}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Region <span className={styles.required}>*</span></label>
                    <input
                      type="text"
                      value={state.storage.region}
                      onChange={(e) => updateNested('storage', 'region', e.target.value)}
                      placeholder="us-central1"
                      className={!state.storage.region.trim() ? styles.inputError : ''}
                    />
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Credentials</label>
                    <div className={styles.credentialModeSelect}>
                      <button
                        className={`${styles.credentialModeBtn} ${state.gcp.credentialMode === 'workload_identity' ? styles.active : ''}`}
                        onClick={() => updateNested('gcp', 'credentialMode', 'workload_identity')}
                      >
                        Workload Identity
                      </button>
                      <button
                        className={`${styles.credentialModeBtn} ${state.gcp.credentialMode === 'existing' ? styles.active : ''}`}
                        onClick={() => updateNested('gcp', 'credentialMode', 'existing')}
                      >
                        Use Existing Secret
                      </button>
                      <button
                        className={`${styles.credentialModeBtn} ${state.gcp.credentialMode === 'service_account' ? styles.active : ''}`}
                        onClick={() => updateNested('gcp', 'credentialMode', 'service_account')}
                      >
                        Service Account JSON
                      </button>
                    </div>
                  </div>
                  {state.gcp.credentialMode === 'workload_identity' && (
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <span className={styles.hint}>
                        Credentials will be provided by GKE Workload Identity. Ensure your cluster and service account are configured appropriately.
                      </span>
                    </div>
                  )}
                  {state.gcp.credentialMode === 'existing' && (
                    <div className={styles.formGroup}>
                      <label>Secret Name <span className={styles.required}>*</span></label>
                      <input
                        type="text"
                        value={state.gcp.existingSecretName}
                        onChange={(e) => updateNested('gcp', 'existingSecretName', e.target.value)}
                        placeholder="my-gcp-credentials"
                        className={!state.gcp.existingSecretName.trim() ? styles.inputError : ''}
                      />
                      <span className={styles.hint}>Name of existing Kubernetes secret containing GOOGLE_APPLICATION_CREDENTIALS</span>
                    </div>
                  )}
                  {state.gcp.credentialMode === 'service_account' && (
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label>Service Account JSON <span className={styles.required}>*</span></label>
                      <textarea
                        value={state.gcp.serviceAccountJson}
                        onChange={(e) => updateNested('gcp', 'serviceAccountJson', e.target.value)}
                        placeholder='{"type": "service_account", ...}'
                        rows={4}
                        className={!state.gcp.serviceAccountJson.trim() ? styles.inputError : ''}
                      />
                    </div>
                  )}
                </>
              )}

              {state.cloudProvider === 'azure' && (
                <>
                  <div className={styles.formGroup}>
                    <label>Storage Account Name</label>
                    <input
                      type="text"
                      value={state.azure.storageAccountName}
                      onChange={(e) => updateNested('azure', 'storageAccountName', e.target.value)}
                      placeholder="mystorageaccount"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Container Name</label>
                    <input
                      type="text"
                      value={state.azure.containerName}
                      onChange={(e) => updateNested('azure', 'containerName', e.target.value)}
                      placeholder="lakerunner-data"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Region</label>
                    <input
                      type="text"
                      value={state.storage.region}
                      onChange={(e) => updateNested('storage', 'region', e.target.value)}
                      placeholder="eastus"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Storage Account Key</label>
                    <input
                      type="password"
                      value={state.azure.storageAccountKey}
                      onChange={(e) => updateNested('azure', 'storageAccountKey', e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                </>
              )}
            </div>
          </section>

          {/* PostgreSQL Configuration */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>PostgreSQL - Lakerunner DB</h3>
            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label>Credentials</label>
                <div className={styles.credentialModeSelect}>
                  <button
                    className={`${styles.credentialModeBtn} ${state.lrdb.credentialMode === 'create' ? styles.active : ''}`}
                    onClick={() => updateNested('lrdb', 'credentialMode', 'create')}
                  >
                    Create Secret
                  </button>
                  <button
                    className={`${styles.credentialModeBtn} ${state.lrdb.credentialMode === 'existing' ? styles.active : ''}`}
                    onClick={() => updateNested('lrdb', 'credentialMode', 'existing')}
                  >
                    Use Existing Secret
                  </button>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Host <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  value={state.lrdb.host}
                  onChange={(e) => updateNested('lrdb', 'host', e.target.value)}
                  placeholder="lakerunner-db.example.com"
                  className={!state.lrdb.host.trim() ? styles.inputError : ''}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Port <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  value={state.lrdb.port}
                  onChange={(e) => updateNested('lrdb', 'port', e.target.value)}
                  placeholder="5432"
                  className={!isValidPort(state.lrdb.port) ? styles.inputError : ''}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Database <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  value={state.lrdb.database}
                  onChange={(e) => updateNested('lrdb', 'database', e.target.value)}
                  placeholder="lakerunner"
                  className={!state.lrdb.database.trim() ? styles.inputError : ''}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Username <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  value={state.lrdb.username}
                  onChange={(e) => updateNested('lrdb', 'username', e.target.value)}
                  placeholder="lakerunner"
                  className={!state.lrdb.username.trim() ? styles.inputError : ''}
                />
                <span className={styles.hint}>lakerunner</span>
              </div>
              {state.lrdb.credentialMode === 'create' ? (
                <div className={styles.formGroup}>
                  <label>Password <span className={styles.required}>*</span></label>
                  <input
                    type="password"
                    value={state.lrdb.password}
                    onChange={(e) => updateNested('lrdb', 'password', e.target.value)}
                    placeholder="••••••••"
                    className={!state.lrdb.password.trim() ? styles.inputError : ''}
                  />
                </div>
              ) : (
                <div className={styles.formGroup}>
                  <label>Secret Name <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    value={state.lrdb.existingSecretName}
                    onChange={(e) => updateNested('lrdb', 'existingSecretName', e.target.value)}
                    placeholder="pg-credentials"
                    className={!state.lrdb.existingSecretName.trim() ? styles.inputError : ''}
                  />
                  <span className={styles.hint}>Name of existing Kubernetes secret containing password (key: LRDB_PASSWORD)</span>
                </div>
              )}
              <div className={styles.formGroup}>
                <label>SSL Mode</label>
                <select
                  value={state.lrdb.sslMode}
                  onChange={(e) => updateNested('lrdb', 'sslMode', e.target.value)}
                >
                  <option value="disable">disable</option>
                  <option value="require">require</option>
                  <option value="verify-ca">verify-ca</option>
                  <option value="verify-full">verify-full</option>
                </select>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>PostgreSQL - Config DB</h3>
            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label>Credentials</label>
                <div className={styles.credentialModeSelect}>
                  <button
                    className={`${styles.credentialModeBtn} ${state.configdb.credentialMode === 'create' ? styles.active : ''}`}
                    onClick={() => updateNested('configdb', 'credentialMode', 'create')}
                  >
                    Create Secret
                  </button>
                  <button
                    className={`${styles.credentialModeBtn} ${state.configdb.credentialMode === 'existing' ? styles.active : ''}`}
                    onClick={() => updateNested('configdb', 'credentialMode', 'existing')}
                  >
                    Use Existing Secret
                  </button>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Host <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  value={state.configdb.host}
                  onChange={(e) => updateNested('configdb', 'host', e.target.value)}
                  placeholder="config-db.example.com"
                  className={!state.configdb.host.trim() ? styles.inputError : ''}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Port <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  value={state.configdb.port}
                  onChange={(e) => updateNested('configdb', 'port', e.target.value)}
                  placeholder="5432"
                  className={!isValidPort(state.configdb.port) ? styles.inputError : ''}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Database <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  value={state.configdb.database}
                  onChange={(e) => updateNested('configdb', 'database', e.target.value)}
                  placeholder="configdb"
                  className={!state.configdb.database.trim() ? styles.inputError : ''}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Username <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  value={state.configdb.username}
                  onChange={(e) => updateNested('configdb', 'username', e.target.value)}
                  placeholder="lakerunner"
                  className={!state.configdb.username.trim() ? styles.inputError : ''}
                />
                <span className={styles.hint}>lakerunner</span>
              </div>
              {state.configdb.credentialMode === 'create' ? (
                <div className={styles.formGroup}>
                  <label>Password <span className={styles.required}>*</span></label>
                  <input
                    type="password"
                    value={state.configdb.password}
                    onChange={(e) => updateNested('configdb', 'password', e.target.value)}
                    placeholder="••••••••"
                    className={!state.configdb.password.trim() ? styles.inputError : ''}
                  />
                </div>
              ) : (
                <div className={styles.formGroup}>
                  <label>Secret Name <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    value={state.configdb.existingSecretName}
                    onChange={(e) => updateNested('configdb', 'existingSecretName', e.target.value)}
                    placeholder="configdb-credentials"
                    className={!state.configdb.existingSecretName.trim() ? styles.inputError : ''}
                  />
                  <span className={styles.hint}>Name of existing Kubernetes secret containing password (key: CONFIGDB_PASSWORD)</span>
                </div>
              )}
              <div className={styles.formGroup}>
                <label>SSL Mode</label>
                <select
                  value={state.configdb.sslMode}
                  onChange={(e) => updateNested('configdb', 'sslMode', e.target.value)}
                >
                  <option value="disable">disable</option>
                  <option value="require">require</option>
                  <option value="verify-ca">verify-ca</option>
                  <option value="verify-full">verify-full</option>
                </select>
              </div>
            </div>
          </section>

          {/* Kafka Configuration */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Kafka</h3>
            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label>Credentials</label>
                <div className={styles.credentialModeSelect}>
                  <button
                    className={`${styles.credentialModeBtn} ${state.kafka.credentialMode === 'create' ? styles.active : ''}`}
                    onClick={() => updateNested('kafka', 'credentialMode', 'create')}
                  >
                    Create Secret
                  </button>
                  <button
                    className={`${styles.credentialModeBtn} ${state.kafka.credentialMode === 'existing' ? styles.active : ''}`}
                    onClick={() => updateNested('kafka', 'credentialMode', 'existing')}
                  >
                    Use Existing Secret
                  </button>
                </div>
              </div>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label>Broker Addresses <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  value={state.kafka.brokers}
                  onChange={(e) => updateNested('kafka', 'brokers', e.target.value)}
                  placeholder="kafka-1:9092,kafka-2:9092,kafka-3:9092"
                  className={!state.kafka.brokers.trim() ? styles.inputError : ''}
                />
              </div>
              <div className={styles.formGroup}>
                <label>SASL Mechanism</label>
                <select
                  value={state.kafka.saslMechanism}
                  onChange={(e) => updateNested('kafka', 'saslMechanism', e.target.value)}
                >
                  <option value="PLAIN">PLAIN</option>
                  <option value="SCRAM-SHA-256">SCRAM-SHA-256</option>
                  <option value="SCRAM-SHA-512">SCRAM-SHA-512</option>
                </select>
              </div>
              {state.kafka.credentialMode === 'create' ? (
                <>
                  <div className={styles.formGroup}>
                    <label>Username <span className={styles.required}>*</span></label>
                    <input
                      type="text"
                      value={state.kafka.username}
                      onChange={(e) => updateNested('kafka', 'username', e.target.value)}
                      placeholder="kafka-user"
                      className={!state.kafka.username.trim() ? styles.inputError : ''}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Password <span className={styles.required}>*</span></label>
                    <input
                      type="password"
                      value={state.kafka.password}
                      onChange={(e) => updateNested('kafka', 'password', e.target.value)}
                      placeholder="••••••••"
                      className={!state.kafka.password.trim() ? styles.inputError : ''}
                    />
                  </div>
                </>
              ) : (
                <div className={styles.formGroup}>
                  <label>Secret Name <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    value={state.kafka.existingSecretName}
                    onChange={(e) => updateNested('kafka', 'existingSecretName', e.target.value)}
                    placeholder="kafka-credentials"
                    className={!state.kafka.existingSecretName.trim() ? styles.inputError : ''}
                  />
                  <span className={styles.hint}>Name of existing Kubernetes secret containing credentials (keys: KAFKA_USERNAME, KAFKA_PASSWORD)</span>
                </div>
              )}
              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={state.kafka.useTls}
                    onChange={(e) => updateNested('kafka', 'useTls', e.target.checked)}
                  />
                  Use TLS
                </label>
              </div>
            </div>
          </section>

      {/* Generated YAML Output */}
      <section className={styles.section}>
        <div className={styles.outputHeader}>
          <h3 className={styles.sectionTitle}>Generated values.yaml</h3>
          {yaml && (
            <button onClick={handleCopy} className={styles.copyBtn}>
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
        {yaml ? (
          <pre className={styles.yamlOutput}>{yaml}</pre>
        ) : (
          <div className={styles.configurePrompt}>
            Please complete all required fields (marked with <span className={styles.required}>*</span>) above to generate your values.yaml configuration.
          </div>
        )}

        {yaml && (
          <div className={styles.installInstructions}>
            <h4>Installation Commands</h4>
            {state.enableKeda && (
              <>
                <h4>Step 1: Install KEDA (Required)</h4>
                <p style={{ marginBottom: '1rem' }}>
                  Follow the official KEDA installation guide: <a href="https://keda.sh/docs/latest/deploy/" target="_blank" rel="noopener noreferrer">https://keda.sh/docs/latest/deploy/</a>
                </p>
              </>
            )}
            <h4>{state.enableKeda ? 'Step 2: Install Lakerunner' : 'Install Lakerunner'}</h4>
            <pre className={styles.codeBlock}>
{`# Save the above values.yaml, then run:
helm install lakerunner oci://public.ecr.aws/cardinalhq.io/lakerunner \\
  --values values.yaml \\
  --namespace lakerunner --create-namespace`}
            </pre>
            {state.enableGrafana && (
              <>
                <h4>Access Grafana</h4>
                <pre className={styles.codeBlock}>
{`# Port-forward to access Grafana locally:
kubectl port-forward -n lakerunner svc/grafana 3000:3000

# Then access Grafana at: http://localhost:3000`}
                </pre>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
