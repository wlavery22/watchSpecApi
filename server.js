const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Watch Spec';

app.get('/', (request, response) => {
  response.send('Oh hey Watch Spec');
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});

app.locals.watches = [
  { id: 'a1', name: 'Alpinist', type: 'field watch', maker: 'Seiko', cost: 700, complications: 'date', features: 'triangular indices', size: '39mm' },
  { id: 'b2', name: 'Seiko 5 GMT', type: 'sports watch', maker: 'Seiko', cost: 400, complications: 'GMT', features: '24-hour bezel', size: '39mm' },
  { id: 'c3', name: 'Seiko Monster', type: 'dive watch', maker: 'Seiko', cost: 400, complications: 'day date', features: 'extra-large indices and hands', size: '42mm' },
  { id: 'd4', name: 'Seiko Turtle', type: 'dive watch', maker: 'Seiko', cost: 400, complications: 'day date', features: 'cushion case', size: '45mm' },
  { id: 'e5', name: 'Cocktail Time', type: 'dress watch', maker: 'Seiko', cost: 400, complications: 'date', features: 'sun-ray dial', size: '40mm' },
  { id: 'f6', name: 'Dress KX', type: 'casual watch', maker: 'Seiko', cost: 300, complications: 'date', features: 'dive-style hands and indices', size: '40mm' },
  { id: 'g7', name: 'Premier B09', type: 'pilot\'s watch', maker: 'Brietling', cost: 9000, complications: 'chronograph', features: 'bi-compax dial', size: '40mm' },
  { id: 'h8', name: 'Navitimer B01', type: 'pilot\'s watch', maker: 'Brietling', cost: 9000, complications: 'chronograph', features: 'tri-compax dial', size: '41mm' },
  { id: 'i9', name: 'Khaki Field Auto', type: 'field watch', maker: 'Hamilton', cost: 700, complications: 'date', features: 'additional 24-hr dial numerals',  size: '38mm' },
  { id: 'j10', name: 'Khaki Field King Auto', type: 'field watch', maker: 'Hamilton', cost: 700, complications: 'day date', features: 'crown guards', size: '40mm' },
  { id: 'k11', name: 'Khaki Field Murph', type: 'field watch', maker: 'Hamilton', cost: 900, complications: 'seconds hand', features: 'cathedral hands',  size: '38mm' },
  { id: 'l12', name: 'Intra-Matic Auto Chrono', type: 'chronograph', maker: 'Hamilton', cost: 2300, complications: 'chronograph', features: 'bi-compax dial', size: '40mm' }, 
  { id: 'm13', name: 'Max Bill', type: 'casual watch', maker: 'Junghans', cost: 900, complications: 'seconds hand', features: 'Bauhaus design', size: '38mm' },
  { id: 'n14', name: 'Meister Chronoscope', type: 'chronograph', maker: 'Junghans', cost: 2400, complications: 'day date chronograph', features: 'tri-compax dial', size: '40mm' },
  { id: 'o15', name: 'Meister Hand-Wound', type: 'dress watch', maker: 'Junghans', cost: 1400, complications: 'small seconds hand', features: 'sun-burst dial', size: '38mm' },
  { id: 'p16', name: 'Partitio Classic Hand-Wound', type: 'casual watch', maker: 'Stowa', cost: 1100, complications: 'seconds hand', features: 'syringe hands', size: '37mm' },
  { id: 'q17', name: 'Chronograph 1938', type: 'chronograph', maker: 'Stowa', cost: 2700, complications: 'chronograph', features: 'bi-compax dial', size: '41mm' },
  { id: 'r18', name: 'Marine Classic Roman', type: 'casual watch', maker: 'Stowa', cost: 1100, complications: 'seconds hand', features: 'roman numeral indices',  size: '40mm' },
  { id: 's19', name: 'Orion Rose', type: 'dress watch', maker: 'Nomos', cost: 2400, complications: 'small seconds hand', features: 'subtle rose-colored dial', size: '35mm' },
  { id: 't20', name: 'Zurich World Time', type: 'worldtimer', maker: 'Nomos', cost: 6100, complications: 'world time, small seconds hand', features: 'deep midnight-blue dial', size: '40mm' },
  { id: 'u21', name: 'Lambda 39 Rose Gold', type: 'dress watch', maker: 'Nomos', cost: 17000, complications: '84-hour power reserve', features: 'hand-engraved balance cock', size: '39mm' }
];

app.get('/api/v1/watches', (request, response) => {
  const watches = app.locals.watches;

  response.json({ watches });
});

app.get('/api/v1/watches/:id', (request, response) => {
  const { id } = request.params;
  const watch = app.locals.watches.find(watch => watch.id === id);
  if (!watch) {
    return response.sendStatus(404);
  }
  response.status(200).json(watch);
});

app.post('/api/v1/watches', (request, response) => {
  const id = Date.now();
  const watch = request.body;

  for (let requiredParameter of ['name', 'type', 'maker', 'cost', 'complications', 'features', 'size']) {
    if (!watch[requiredParameter]) {
      response
        .status(422)
        .send({ error: `Expected format: { name: <String>, type: <String>, maker: <String>, cost: <String>, complications: <String>, features: <String>, size: <String> }. You're missing a "${requiredParameter}" property.` });
      return
    }
  }

  const { name, type, maker, cost, complications, features, size } = watch;
  app.locals.watches.push({ name, type, id, maker, cost, complications, features, size });
  response.status(201).json({ name, type, id, maker, cost, complications, features, size });
});

app.delete('/api/v1/watches/:id', (request, response) => {
  const { id } = request.params;
  const index = app.locals.watches.findIndex(watch => watch.id === id);

  if (index === -1) {
    return response.sendStatus(404); 
  }

  app.locals.watches.splice(index,  1);
  response.sendStatus(204); 
});

app.put('/api/v1/watches/:id', (request, response) => {
  const { id } = request.params;
  const watch = request.body;
  const index = app.locals.watches.findIndex(watch => watch.id === id);

  if (index === -1) {
    return response.sendStatus(404);
  }

  for (let requiredParameter of ['name', 'type', 'maker', 'cost', 'complications', 'features', 'size']) {
    if (!watch[requiredParameter]) {
      response
        .status(422)
        .send({ error: `Expected format: { name: <String>, type: <String>, maker: <String>, cost: <String>, complications: <String>, features: <String>, size: <String> }. You're missing a "${requiredParameter}" property.` });
      return;
    }
  }
 
  const { name, type, maker, cost, complications, features, size } = watch;
  app.locals.watches[index] = { ...app.locals.watches[index], name, type, maker, cost, complications, features, size };

  response.status(200).json({ name, type, id, maker, cost, complications, features, size });
});
 

