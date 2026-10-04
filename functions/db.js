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

function insertDatabaseInfo(msg, user, callback) {
  db.run(`
    INSERT OR IGNORE
    INTO phrases (phrase, user)
    VALUES (?, ?)`,
    [msg, user],
    function(err) {
      if (err) {
        console.error(err.message);
        return;
      }

      console.log(`[+] (insertDatabaseInfo) "${msg}" de ${user} enviado para o banco de dados com sucesso`);
    }
  );
}

function consultDatabaseConfig(guildID, callback) {
  db.get(`
    SELECT * FROM guild_config
    WHERE guild_id = ?`,
    [guildID],
    (err, row) => {
      if (err) {
        console.error(err.message);
        return;
      }

      return row;
    }
  );
}

function editDatabaseConfig(guildId, prefix, automsg) {
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
        console.error(err.message);
        return;
      }

      console.log(`[*] Configurações de comunidade (${guildId}) alterados`);
    }
  );
}

// I'm working on it...
// function deleteDatabaseInfo(id) {}

function randomDatabase() {
  db.get(`
    SELECT * FROM phrases
    ORDER BY RANDOM()
    LIMIT 1`,
    (err, row) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log(`[+] (random) Frase "${result.phrase}" foi escolhida!`);
      return result.phrase;
    }
  );
}

function searchDatabaseRandomRegex(pattern) {
  db.get(`
    SELECT * FROM phrases
    WHERE phrase LIKE ?
    ORDER BY RANDOM()
    LIMIT 1`,
    [`%${pattern}%`],
    (err, row) => {
      if (err) {
        console.error(err);
        return randomDatabase();
      }

      console.log(`[+] (randomRegex) Foi escolhida a mensagem "${searchRandom.phrase}"!`);
      return searchRandom.phrase;
    }
  );
}

module.exports = {
  startDatabase
}
