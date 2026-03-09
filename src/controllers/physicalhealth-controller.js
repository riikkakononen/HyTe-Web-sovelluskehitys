import {listAllPhysicalHealthEntries, addPhysicalHealthEntry, updatePhysicalHealthEntryById, deletePhysicalHealthEntryById} from "../models/physicalhealth-model.js";

// Haetaan käyttäjän kaikki physicalhealth-entryt

const getPhysicalHealthEntries = async (req, res) => {
  const userId = req.user.id;
  const result = await listAllPhysicalHealthEntries(userId); // Annetaan physicalhealth-modelin listAllPhysicalHealthEntries:lle userId tietokantahakua varten 
  if (result?.error) {
    return res.status(500).json(result);
  }
  return res.json(result);
};

// Luodaan uusi entry

const postPhysicalHealthEntry = async (req, res) => {
  const userId = req.user.id;
  const {entry_date, symptoms, energy_level} = req.body; // Saadaan pyynnöstä date, symptoms ja energy level
  if (!entry_date || (!symptoms && !energy_level)) {
    return res.sendStatus(400); // Pitää saada date ja vähintään symptoms tai energylevel, jompi kumpi
  }
  const result = await addPhysicalHealthEntry({
    user_id: userId,
    entry_date,
    symptoms,
    energy_level
  }); // Annetaan physicalhealth-modelin addPhysicalHealthEntrylle userid, päivämäärä, symptoms ja energy level
  if (result?.error) {
    return res.status(500).json(result);
  }
  return res.status(201).json({ message: 'New entry added.', ...result });
};

// Muokataan entryä

const putPhysicalHealthEntry = async (req, res) => {
  const entryId = Number(req.params.id);
  const userId = req.user.id; 
  const {entry_date, symptoms, energy_level} = req.body; // Saadaan pyynnöstä päivämäärä, symptoms ja energy level
  const result = await updatePhysicalHealthEntryById(
    entryId,
    userId,
    { entry_date, symptoms, energy_level }
  );  // Annetaan physicalhealth-modelin updatePhysicalHealthEntryById:lle entryid, userid, päivämäärä, symptoms ja energy level
  if (result?.error) {
    return res.status(500).json(result);
  }
  if (result.affectedRows === 0) {
    return res.status(404).json({ error: 'entry not found' });  // Jos tietokannassa ei tapahdu muutosta, entryä ei löytynyt
  }
  return res.status(200).json({ message: 'entry updated' });
};

// Poistetaan entry

const deletePhysicalHealthEntry = async (req, res) => {
  const entryId = Number(req.params.id);
  const userId = req.user.id;
  const result = await deletePhysicalHealthEntryById(entryId, userId); // Annetaan physicalhealth-modelin deletePhysicalHealthEntryById:lle entryId ja userId
  if (result?.error) {
    return res.status(500).json(result);
  }
  if (result.affectedRows === 0) {
    return res.status(404).json({ error: 'entry not found' }); // Jos tietokannassa ei tapahdu muutosta, entryä ei löytynyt
  }
  return res.status(200).json({ message: 'entry deleted' });
};

export {getPhysicalHealthEntries, postPhysicalHealthEntry, putPhysicalHealthEntry, deletePhysicalHealthEntry};