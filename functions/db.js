const sqlite3 = require('sqlite3');

const fs = require('fs');
const path = require('path');

const databaseFolder = path.join(__dirname, "..", "db");

if (!fs.existsSync(databaseFolder)) {
  console.log(`[!] ${databaseFolder} was not found`);
  fs.mkdir(databaseFolder);
  console.log(`[*] The database folder was created!`);
}

// The database path
const dbPath = path.join(__dirname, "..", "db", "database.db");

// Connect to local database
const db = new sqlite3.Database(dbPath);

function startDatabase() {
  // Phrases table
  db.run(`
    CREATE TABLE IF NOT EXISTS phrases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phrase TEXT NOT NULL UNIQUE CHECK (TRIM(phrase) <> ''),
      user TEXT NOT NULL
    )
  `);

  // Guild table
  db.run(`
    CREATE TABLE IF NOT EXISTS guild_config (
      guild_id TEXT PRIMARY KEY,
      prefix TEXT DEFAULT '&',
      automsg INTEGER DEFAULT 0
    )
  `);

  // Algorithm table
  db.run(`
    CREATE TABLE IF NOT EXISTS algorithm_config (
      guild_id TEXT PRIMARY KEY,
      register_range INTEGER DEFAULT 20,
      speak_range INTEGER DEFAULT 20
    )
  `);

  console.log("[+] Database foi verificado!");
}

function insertDatabaseInfo(msg, user) {
  return new Promise((resolve, reject) => {
    db.run(`
      INSERT OR IGNORE
      INTO phrases (phrase, user)
      VALUES (?, ?)`,
      [msg, user],
      function(err) {
        if (err) {
          reject(err);
          return;
        }

        console.log(`[+] (insertDatabaseInfo) "${msg}" de ${user} enviado para o banco de dados com sucesso`);
        resolve();
      }
    );
  });
}

function consultDatabaseConfig(guildID) {
  return new Promise((resolve, reject) => {
    db.get(`
      SELECT * FROM guild_config
      WHERE guild_id = ?`,
      [guildID],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(row);
      }
    );
  });
}

function editDatabaseConfig(guildId, prefix, automsg) {
  return new Promise((resolve, reject) => {
    // Update the database
    db.run(`
      INSERT INTO guild_config (guild_id, prefix, automsg)
      VALUES (?, ?, ?)
      ON CONFLICT(guild_id) DO UPDATE SET
        prefix = excluded.prefix,
        automsg = excluded.automsg`,
      [guildId, prefix, automsg],
      (err) => {
        if (err) {
          reject(err);
          return;
        }

        console.log(`[*] Configurações de comunidade (${guildId}) alterados`);
        resolve();
      }
    );
  });
}

// I'm working on it...
// function deleteDatabaseInfo(id) {}

function randomDatabase() {
  return new Promise((resolve, reject) => {
    db.get(`
      SELECT * FROM phrases
      ORDER BY RANDOM()
      LIMIT 1`,
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        console.log(`[+] (random) Frase "${row.phrase}" foi escolhida!`);
        resolve(row.phrase);
      }
    );
  });
}

function searchDatabaseRandomRegex(pattern) {
  return new Promise((resolve, reject) => {
    db.get(`
      SELECT * FROM phrases
      WHERE phrase LIKE ?
      ORDER BY RANDOM()
      LIMIT 1`,
      [`%${pattern}%`],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }

          console.log(`[+] (randomRegex) Foi escolhida a mensagem "${row.phrase}"!`);
          resolve(row.phrase);
      }
    );
  });
}

module.exports = {
  startDatabase,
  insertDatabaseInfo,
  consultDatabaseConfig,
  editDatabaseConfig,
  randomDatabase,
  searchDatabaseRandomRegex
}
