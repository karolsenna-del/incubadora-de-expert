'use strict';

const path = require('path');
const fs = require('fs');

const DEFAULT_STALE_TTL_HOURS = 168; // 7 days

/**
 * Read optional project configuration without disclosing parse failures.
 *
 * @param {string} cwd - Working directory
 * @returns {object} Configuration or an empty object
 */
function loadCoreConfig(cwd) {
  try {
    const configPath = path.join(cwd, '.auroq-core', 'core-config.yaml');
    if (!fs.existsSync(configPath)) return {};
    const yaml = require('js-yaml');
    const config = yaml.load(fs.readFileSync(configPath, 'utf8'));
    return config && typeof config === 'object' ? config : {};
  } catch (_err) {
    // YAML errors can contain configuration values; never log their text.
    return {};
  }
}

function getStaleSessionTTL(config) {
  const ttl = config && config.synapse && config.synapse.session && config.synapse.session.staleTTLHours;
  return typeof ttl === 'number' && ttl > 0 ? ttl : DEFAULT_STALE_TTL_HOURS;
}

/**
 * Resolve runtime dependencies for Synapse hook execution.
 *
 * On the first prompt of a session (prompt_count === 0), runs
 * cleanStaleSessions() fire-and-forget to remove expired sessions.
 *
 * @param {{cwd?: string, session_id?: string, sessionId?: string}} input
 * @returns {{
 *   engine: import('../engine').SynapseEngine,
 *   session: Object
 * } | null}
 */
function resolveHookRuntime(input) {
  const cwd = input && input.cwd;
  const sessionId = input && (input.session_id || input.sessionId);
  if (!cwd || typeof cwd !== 'string') return null;

  const synapsePath = path.join(cwd, '.synapse');
  if (!fs.existsSync(synapsePath)) return null;

  try {
    const { loadSession, createSession, cleanStaleSessions } = require(
      path.join(cwd, '.auroq-core', 'core', 'synapse', 'session', 'session-manager.js'),
    );
    const { SynapseEngine } = require(
      path.join(cwd, '.auroq-core', 'core', 'synapse', 'engine.js'),
    );

    const sessionsDir = path.join(synapsePath, 'sessions');
    let session = sessionId ? loadSession(sessionId, sessionsDir) : null;
    // loadSession validates the ID before we use it as a filename. Create only
    // a missing session: an unreadable/corrupt existing file is kept intact.
    if (!session && sessionId && !fs.existsSync(path.join(sessionsDir, `${sessionId}.json`))) {
      session = createSession(sessionId, cwd, sessionsDir);
    }
    const shouldCleanStaleSessions = session?.prompt_count === 0;
    session = session || { prompt_count: 0 };
    const coreConfig = loadCoreConfig(cwd);
    const engine = new SynapseEngine(synapsePath, { synapse: coreConfig.synapse || {} });

    // AC3: Run cleanup on first prompt only (fire-and-forget)
    if (shouldCleanStaleSessions) {
      try {
        const ttlHours = getStaleSessionTTL(coreConfig);
        const removed = cleanStaleSessions(sessionsDir, ttlHours);
        if (removed > 0 && process.env.DEBUG === '1') {
          console.error(`[hook-runtime] Cleaned ${removed} stale session(s) (TTL: ${ttlHours}h)`);
        }
      } catch (_cleanupErr) {
        // Fire-and-forget: never block hook execution
      }
    }

    return { engine, session, sessionId, sessionsDir, cwd };
  } catch (error) {
    if (process.env.DEBUG === '1') {
      console.error('[hook-runtime] SYNAPSE_RUNTIME_FAILED');
    }
    return null;
  }
}

/**
 * Normalize hook output payload shape.
 *
 * `hookEventName` is REQUIRED by Claude Code — without it the whole payload is
 * rejected and `additionalContext` never reaches the model.
 *
 * @param {string} xml
 * @param {string} [eventName] - Hook event name (default: 'UserPromptSubmit')
 * @returns {{hookSpecificOutput: {hookEventName: string, additionalContext: string}}}
 */
function buildHookOutput(xml, eventName) {
  return {
    hookSpecificOutput: {
      hookEventName: eventName || 'UserPromptSubmit',
      additionalContext: xml || '',
    },
  };
}

module.exports = {
  resolveHookRuntime,
  buildHookOutput,
};
