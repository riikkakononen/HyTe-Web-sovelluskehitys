import {listAllMentalHealthEntries, addMentalHealthEntry, updateMentalHealthEntryById, deleteMentalHealthEntryById} from "../models/mentalhealth-model.js";

// Haetaan käyttäjän kaikki mentalhealth-entryt

const getMentalHealthEntries = async (req, res) => {
  const userId = req.user.id;
  const result = await listAllMentalHealthEntries(userId); // Annetaan mentalhealth-modelin listAllMentalHealthEntries:lle userId tietokantahakua varten
  if (result?.error) {
    return res.status(500).json(result);
    }
  return res.json(result);
};

// Luodaan uusi entry

const postMentalHealthEntry = async (req, res) => {
  const userId = req.user.id;
  const {entry_date, mood, notes} = req.body; // Saadaan pyynnöstä päivämäärä, mood, notes
  if (!entry_date || (!mood && !notes)) {
    return res.sendStatus(400); // Pitää saada päivämäärä ja vähintään mood tai notes, jompi kumpi
  }
  const result = await addMentalHealthEntry({
    user_id: userId,
    entry_date,
    mood,
    notes
  }); // Annetaan mentalhealth-modelin addMentalHealthEntrylle userid, päivämäärä, mood ja notes
  if (result?.error) {
    return res.status(500).json(result);
  }
  return res.status(201).json({ message: 'New entry added.', ...result });
};


// Muokataan entryä

const putMentalHealthEntry = async (req, res) => {
  const entryId = Number(req.params.id);
  const userId = req.user.id;
  const {entry_date, mood, notes} = req.body;  // Saadaan pyynnöstä päivämäärä, mood ja notes
  const result = await updateMentalHealthEntryById(
    entryId,
    userId,
    { entry_date, mood, notes }
  ); // Annetaan mentalhealth-modelin updateMentalHealthEntryById:lle entryid, userid, päivämäärä, mood ja notes

  if (result?.error) {
    return res.status(500).json(result);
  }
  if (result.affectedRows === 0) {
    return res.status(404).json({ error: 'entry not found' }); // Jos tietokannassa ei tapahdu muutosta, entryä ei löytynyt
  }
  return res.status(200).json({ message: 'entry updated'});
};


// Poistetaan entry

const deleteMentalHealthEntry = async (req, res) => {
  const entryId = Number(req.params.id);
  const userId = req.user.id;
  const result = await deleteMentalHealthEntryById(entryId, userId); // Annetaan mentalhealth-modelin deleteMentalHealthEntryById:lle entryId ja userId
  if (result?.error) {
    return res.status(500).json(result);
  }
  if (result.affectedRows === 0) {
    return res.status(404).json({ error: 'entry not found'});  // Jos tietokannassa ei tapahdu muutosta, entryä ei löytynyt
  }
  return res.status(200).json({message: 'entry deleted'});
};

export {getMentalHealthEntries, postMentalHealthEntry, putMentalHealthEntry, deleteMentalHealthEntry};