const path = require('path');
const fs = require('fs');

const INIT_SQL_PATH = path.resolve(__dirname, '../../../database-schema-init.sql');

/**
 * Runs database-schema-init.sql if the database has not been seeded yet.
 * Uses enum_constants row count as the "already initialized" indicator.
 * Safe to call on every startup — it is a no-op when data already exists.
 *
 * @param {import('sequelize').Sequelize} sequelize
 */
async function runDbInit(sequelize) {
  const [[{ cnt }]] = await sequelize.query(
    'SELECT COUNT(*) AS cnt FROM enum_constants',
    { raw: true },
  );

  if (Number(cnt) > 0) {
    // eslint-disable-next-line no-console
    console.log('[db-init] Database already initialized, skipping.');
    return;
  }

  // eslint-disable-next-line no-console
  console.log('[db-init] Fresh database detected — running initialization script...');

  const sql = fs.readFileSync(INIT_SQL_PATH, 'utf8');

  // Strip comment-only lines then split into individual statements by semicolons.
  // This is safe for our SQL file because no string literals contain semicolons.
  const statements = sql
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n')
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const stmt of statements) {
    try {
      await sequelize.query(stmt);
    } catch (err) {
      const code = err.original && err.original.code;
      if (code === 'ER_DUP_KEYNAME') {
        // Index already exists — harmless, continue
      } else if (code === 'ER_TABLE_EXISTS_ERROR') {
        // Table already created by sequelize.sync() — harmless, continue
      } else {
        // eslint-disable-next-line no-console
        console.error('[db-init] Failed to execute statement:\n', stmt);
        throw err;
      }
    }
  }

  // eslint-disable-next-line no-console
  console.log('[db-init] Database initialization complete.');
}

module.exports = runDbInit;
