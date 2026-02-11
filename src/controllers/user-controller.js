// HUOM: mokkidata on poistettu modelista
//import users from '../models/user-model.js';

import {listAllUsers, findUserById, updateUserById, addUser, findUserByUsername, deleteUserById} from '../models/user-model.js';


// TODO: lisää tietokantafunktiot user modeliin
// ja käytä niitä täällä

// DONE: refaktoroi tietokantafunktiolle
const getUsers = async (req, res) => {
  const result = await listAllUsers();
  if (result?.error) return res.status(500).json(result);
  // ÄLÄ IKINÄ lähetä salasanoja HTTP-vastauksessa
  for (let i = 0; i < result.length; i++) {
    delete result[i].password;
    // kaikki emailit sensuroitu esimerkki
    result[i].email = 'sensored';
  }
  res.json(result);
};

// TODO: getUserById

const getUserById = async(req, res) => {
  const user = await findUserById(req.params.id);

  if (!user) return res.sendStatus(404);
  if (user?.error) return res.status(500).json(user);

  delete user.password;
  user.email = 'sensored';

  res.json(user);
};

// TODO: putUserById

const putUserById = async (req, res) => {
  const id = Number(req.params.id);

  const { username, email } = req.body;
  if (!username || !email) {
    return res.status(400).json({ error: 'required fields missing' });
  }

  const result = await updateUserById(id, { username, email });

  if (result?.error) {
    return res.status(500).json(result);
  }

  // jos id:tä ei ollut olemassa
  if (result.affectedRows === 0) {
    return res.status(404).json({ error: 'user not found' });
  }

  res.status(200).json({ message: 'user updated' });
};


// TODO: deleteUserById

const deleteUser = async (req, res) => {
  const id = Number(req.params.id);

  const result = await deleteUserById(id);
  if (result?.error) {
    return res.status(500).json(result);
  }

  if (result.affectedRows === 0) {
    return res.status(404).json({ error: 'user not found' });
  }

  res.status(204).send();
};

// Käyttäjän lisäys (rekisteröityminen)
// TODO: refaktoroi tietokantafunktiolle
const postUser = async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || password || email) {
    return res.status(400).json({error: 'required fields missing'});
  }

  const result = await addUser({ username, password, email });

  if (result?.error) {
    return res.status(500).json(result);
  }

  res.status(201).json({ message: 'new user added', user_id: result.user_id });
};

// Tietokantaversio valmis
const postLogin = async (req, res) => {
  const {username, password} = req.body;
  // haetaan käyttäjä-objekti käyttäjän nimen perusteella
  const user = await findUserByUsername(username);
  //console.log('postLogin user from db', user);
  if (user) {
    if (user.password === password) {
      delete user.password;
      return res.json({message: 'login ok', user: user});
    }
    return res.status(403).json({error: 'invalid password'});
  }
  res.status(404).json({error: 'user not found'});
};


export {getUsers, getUserById, putUserById, deleteUser, postUser, postLogin};