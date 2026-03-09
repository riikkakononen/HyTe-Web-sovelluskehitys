import promisePool from '../utils/database.js';

// Lisätään uusi käyttäjä
const addUser = async (user) => { // Saadaan user-tiedot user-controllerista
  const {username, password, email} = user;
  const sql = `INSERT INTO Users (username, password, email) 
               VALUES (?, ?, ?)`;
  const params = [username, password, email];
  try {
    const [result] = await promisePool.execute(sql, params); // Luodaan uusi käyttäjä tietokantaan
    return {user_id: result.insertId};
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

// Etsitään käyttäjä sähköpostilla sisäänkirjautumista varten
const findUserByEmail = async (email) => { // Saadaan email user-controllerista
  const sql = 'SELECT user_id, username, email, password FROM Users WHERE email = ?';

  try {
  const [rows] = await promisePool.execute(sql, [email]); // Haetaan user_id, username, email ja password tietokannasta
  return rows[0];
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

export {addUser, findUserByEmail};