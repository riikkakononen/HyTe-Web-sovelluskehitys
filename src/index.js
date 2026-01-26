import express from 'express';
const hostname = '127.0.0.1';
const app = express();
const port = 3000;

// Dummy mock data (nollautuu aina, kun sovelluksen käynnistää uudelleen)
const items = [
  {id: 1, name: 'Omena'},
  {id: 2, name: 'Appelsiini'},
  {id: 3, name: 'Banaaneja'},
];

// parsitaan json data pyynnöstä ja lisätään request-objektiin
app.use(express.json());

// API root
app.get('/', (req, res) => {
  res.send('This is dummy items API!');
});

// Get all items
app.get('/items', (req, res) => {
  res.json(items);
});

// Get item based on id
app.get('/items/:id', (req, res) => {
  console.log('getting item id:', req.params.id);
  const itemFound = items.find(item => item.id == req.params.id);
  if (itemFound) {
    res.json(itemFound);
  } else {
    res.status(404).json({message: 'item not found'});
  }
});

// Adding PUT route for items

app.put('/items/:id', (req, res) => {
  const id = Number(req.params.id); // muutetaan pyynnön merkkijono numeroksi (ja tallennetaan id-muuttujaan)
  const itemIndex = items.findIndex(item => item.id === id); // etsitään items-taulukosta sen itemin paikka, jonka id vastaa id-muuttujan id:tä (+ tallentaan paikka itemIndex-muuttujaan)

  if (itemIndex === -1) { // jos pyydettyä id:tä vastaavaa id:tä ei löydy, ei löydy paikkaakaan, joten findIndex palauttaa arvon -1 
    return res.status(404).json({message: 'item not found'}); // palautetaan statuskoodi 404 ja viesti 'ei löydy'
  }

  res.status(200).json({message: 'item updated'}); // palautetaan statuskoodi 200 ja viesti onnistuneesta päivityksestä
});

// Adding DELETE route for items

app.delete('/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const itemIndex = items.findIndex(item => item.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({message: 'item not found'});
  }

  items.splice(itemIndex, 1); // poistaa alkion
  res.status(204).send(); //204 = no content
});

// Add new item

app.post('/items', (req, res) => {
   if (!req.body || !req.body.name) {
    return res.status(400).json({ message: 'name is required' });
   }

  let newId;

  if (items.length > 0) {
    let maxId = 0;

    for (let i = 0; i < items.length; i++) {
      if (items[i].id > maxId) {
        maxId = items[i].id;
      }
    }

    newId = maxId + 1;
  } else {
    newId = 1;
  }

  const newItem = {
    id: newId,
    name: req.body.name,
  };

  items.push(newItem);
  res.status(201).json({message: 'new item added'});
});

app.use((req, res) => {
  res.status(404).json({message: 'resource not found'});
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});