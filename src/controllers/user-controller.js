import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {addUser, findUserByEmail} from '../models/user-model.js';


// NEW USER REGISTRATION

const postUser = async (req, res) => {
  const {username, password, email} = req.body; // Otetaan pyynnöstä käyttäjänimi, salasana ja sähköposti talteen
  if (!username || !password || !email) {
    return res.status(400).json({error: 'required fields missing'}); // Varmistetaan, ettei tietoja puutu
  }
  const normalizedEmail = email.trim().toLowerCase(); // Muutetaan sähköposti sisältämään vaan pieniä kirjaimia
  const existingUser = await findUserByEmail(normalizedEmail); // Tarkistetaan, ettei käyttäjää jo ole olemassa
  if (existingUser?.error) {
    return res.status(500).json(existingUser);
  }
  if (existingUser) {
    return res.status(409).json({error: 'email already in use'}); // Tarkistetaan, ettei käyttäjää ole jo olemassa
  }
  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({error: 'password too short'}); // Varmistetaan että salasana on ainakin 8 merkkiä
  }
  const salt = await bcrypt.genSalt(10); // Luodaan salasanalle salt (jotta hashaus on uniikki vaikka sama salasana olisi usealla käyttäjällä käytössä)
  const hashedPassword = await bcrypt.hash(password, salt); // hashataan salasana
  const result = await addUser({username, email: normalizedEmail, password: hashedPassword}); // Annetaan user-modelin addUserille tarvittavat tiedot
  if (result?.error) {
    return res.status(500).json(result);
  }
  return res.status(201).json({message: 'new user added', user_id: result.user_id});
};


// USER LOGIN

const postLogin = async (req, res) => {
  const {email, password} = req.body; // Otetaan pyynnöstä talteen sähköposti ja salasana
  if (!email || !password) {
    return res.status(400).json({error: 'required fields missing'}); // Varmistetaan ettei tietoja puutu
  }

  const normalizedEmail = email.trim().toLowerCase(); // Trimmataan sähköposti sisältämään vaan pieniä kirjaimia
  const user = await findUserByEmail(normalizedEmail); // Annetaan user-modelin findUserByEmailille trimmattu sähköposti
  if (user?.error) {
    return res.status(500).json(user);
  }
  if (!user) {
    return res.status(403).json({error: 'invalid email or password'}); // Jos käyttäjää ei löydy, annetaan virheilmoitus (tietosuojan takia ei kerrota onko ongelma sähköpostissa vai salasanassa)
  }
  const match = await bcrypt.compare(password, user.password); // Verrataan käyttäjän syöttämän salasanan hashia tietokannan hashiin
  if (!match) {
    return res.status(403).json({error: 'invalid email or password'}); // Ei matchaa
  }
  delete user.password; // Matchaa --> poistetaan salasana
  const token = jwt.sign(
    {id: user.user_id, email: user.normalizedEmail},
    process.env.JWT_SECRET,
    {expiresIn: process.env.JWT_EXPIRES_IN,} // Luodaan token
  );
  return res.json({message: 'login ok', token, user});
};

export {postUser, postLogin};