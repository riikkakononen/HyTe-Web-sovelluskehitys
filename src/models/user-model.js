import promisePool from '../utils/database.js';


// TODO: lisää modelit ja muokkaa kontrollerit reiteille:
// GET /api/users - list all users

const listAllUsers = async () => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM Users');

    return rows;

  }  catch (e) {
      console.error('error', e.message);
      return {error: e.message}
    }
  };

// GET /api/users/:id - get user by id

const getUserById = async(id) => {
  try {
    const [rows] = await promisePool.execute('SELECT * FROM Users WHERE user_id = ?', [id]);

    return rows[0];

  } catch (e) {
    console.error('error', e.message);
    return {error: e.message}
  }
};
// POST /api/users - add a new user

const addUser = async (user) => {
  const {username, password, email} = user;
  const sql = `INSERT INTO Users (username, password, email)
               VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [username, password, email];
  try {
    const result = await promisePool.execute(sql, params);
    //console.log('insert result', result);
    return {user_id: result[0].insertId};
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

// Huom: virheenkäsittely lisätty
const findUserByUsername = async (username) => {
  const sql = 'SELECT * FROM Users WHERE username = ?';
  try {
  const [rows] = await promisePool.execute(sql, [username]);
  return rows[0];
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

export {findUserByUsername};