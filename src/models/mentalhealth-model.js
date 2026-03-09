import promisePool from "../utils/database.js";


// Haetaan käyttäjän kaikki entryt tietokannasta

const listAllMentalHealthEntries = async (userId) => { // Saadaan user-id mentalhealth-controllerista
  try {
    const [rows] = await promisePool.execute(`SELECT * FROM MentalHealth WHERE user_id = ?`, [userId]); // Haetaan entryt tietokannasta
    return rows;
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};


// Päivitetään käyttäjän entryä entryid:n ja userid:n perusteella tietokannassa

const updateMentalHealthEntryById = async (entryId, userId, entry) => { // Saadaan entryid, userid ja entry=date,mood,notes mentalhealth-controllerista
  const { entry_date, mood, notes } = entry;
  const sql = `UPDATE MentalHealth SET entry_date = ?, mood = ?, notes = ? WHERE entry_id = ? AND user_id = ?`;
  const params = [entry_date, mood, notes, entryId, userId];
  try {
    const [result] = await promisePool.execute(sql, params); // Päivitetään entryn muokkaus tietokantaan
    return result;
  } catch (e) {
    console.error('error', e.message);
    return { error: e.message };
  }
};

// Lisätään uusi entry tietokantaan

const addMentalHealthEntry = async (entry) => { // Saadaan userid, date, mood ja notes mentalhealth-controllerista
  const {user_id, entry_date, mood, notes} = entry;
  const sql = `INSERT INTO MentalHealth (user_id, entry_date, mood, notes) VALUES (?, ?, ?, ?)`;
  const params = [user_id, entry_date, mood, notes];
  try {
    const result = await promisePool.execute(sql, params); // Lisätään uusi entry tietokantaan
    return { entry_id: result.insertId};
  } catch (e) {
    console.error('error', e.message);
    return { error: e.message };
  }
};


// Poistetaan entry tietokannasta

const deleteMentalHealthEntryById = async (entryId, userId) => { // Saadaan entryid ja userid mentalhealth-controllerista
  const sql = `DELETE FROM MentalHealth WHERE entry_id = ? AND user_id = ?`; 
  try {
    const [result] = await promisePool.execute(sql, [entryId, userId]); // Poistetaan entry tietokannasta
    return result;
  } catch (e) {
    console.error('error', e.message);
    return { error: e.message };
  }
};


export {listAllMentalHealthEntries, updateMentalHealthEntryById, addMentalHealthEntry, deleteMentalHealthEntryById}