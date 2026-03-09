import promisePool from '../utils/database.js';


// Haetaan käyttäjän kaikki entryt tietokannasta

const listAllPhysicalHealthEntries = async (userId) => {
  try {
    const [rows] = await promisePool.query(`SELECT * FROM PhysicalHealth WHERE user_id = ?`, [userId]); // Haetaan entryt tietokannasta
    return rows;
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};


// Päivitetään käyttäjän entryä entryid:n ja userid:n perusteella tietokannassa

const updatePhysicalHealthEntryById = async (entryId, userId, entry) => { // Saadaan entryid, userid ja entry=date,symptoms,energylevel physicalhealth-controllerista
  const { entry_date, symptoms, energy_level } = entry;

  const sql = `UPDATE PhysicalHealth SET entry_date = ?, symptoms = ?, energy_level = ? WHERE entry_id = ? AND user_id = ?`;
  const params = [entry_date, symptoms, energy_level, entryId, userId];
  try {
    const [result] = await promisePool.execute(sql, params); // Päivitetään entryn muokkaus tietokantaan
    return result;
  } catch (e) {
    console.error('error', e.message);
    return { error: e.message };
  }
};

// Lisätään uusi entry tietokantaan

const addPhysicalHealthEntry = async (entry) => { // Saadaan userid, date, symptoms ja energy level physicalhealth-controllerista
  const {user_id, entry_date, symptoms, energy_level} = entry;
  const sql = `INSERT INTO PhysicalHealth (user_id, entry_date, symptoms, energy_level)
               VALUES (?, ?, ?, ?)`;
  const params = [user_id, entry_date, symptoms, energy_level];
  try {
    const result = await promisePool.execute(sql, params); // Lisätään uusi entry tietokantaan
    return {entry_id: result.insertId};
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

// Poistetaan entry tietokannasta

const deletePhysicalHealthEntryById = async (entryId, userId) => { // Saadaan entryid ja userid mentalhealth-controllerista
  const sql = `DELETE FROM PhysicalHealth WHERE entry_id = ? AND user_id = ?`;

  try {
    const [result] = await promisePool.execute(sql, [entryId, userId]); // Poistetaan entry tietokannasta
    return result;
  } catch (e) {
    console.error('error', e.message);
    return { error: e.message };
  }
};


export {listAllPhysicalHealthEntries, updatePhysicalHealthEntryById, addPhysicalHealthEntry, deletePhysicalHealthEntryById};