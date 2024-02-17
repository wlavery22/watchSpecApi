const express = require('express');
const app = express();
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
  { id: 'a1', name: 'Alpinist', type: 'field watch', maker: 'Seiko', cost: "$700", complications: "date" },
  { id: 'b2', name: 'Cocktail Time', type: 'dress watch', maker: 'Seiko', cost: "$400", complications: "date" },
  { id: 'c3', name: 'Dress KX', type: 'casual', maker: 'Seiko', cost: "$300", complications: "date" },
  { id: 'd4', name: 'B09', type: 'chronograph', maker: 'Brietling', cost: "$9k", complications: "chronograph" },
  { id: 'e5', name: 'Khaki Field Auto', type: 'field watch', maker: 'Hamilton', cost: "$700", complications: "date" },
  { id: 'f6', name: 'Khaki Field King Auto', type: 'field watch', maker: 'Hamilton', cost: "$700", complications: "day date" },
  { id: 'g7', name: 'Khaki Field Murph 38mm', type: 'field watch', maker: 'Hamilton', cost: "$900", complications: "seconds hand" },
  { id: 'h8', name: 'Intra-Matic Auto Chrono', type: 'chronograph', maker: 'Hamilton', cost: "$2.3k", complications: "chronograph" }, 
  { id: 'i9', name: 'Max Bill', type: 'casual', maker: 'Junghans', cost: "$900", complications: "seconds hand" },
  { id: 'j10', name: 'Meister Chronoscope', type: 'chronograph', maker: 'Junghans', cost: "$2.4k", complications: "day date chronograph" }
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

  for (let requiredParameter of ['name', 'type', 'maker', 'cost', 'complications']) {
    if (!watch[requiredParameter]) {
      response
        .status(422)
        .send({ error: `Expected format: { name: <String>, type: <String>, maker: <String>, cost: <String>, complications: <String> }. You're missing a "${requiredParameter}" property.` });
      return
    }
  }

  const { name, type, maker, cost, complications } = watch;
  app.locals.watches.push({ name, type, id, maker, cost, complications });
  response.status(201).json({ name, type, id, maker, cost, complications });
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

  for (let requiredParameter of ['name', 'type', 'maker', 'cost', 'complications']) {
    if (!watch[requiredParameter]) {
      response
        .status(422)
        .send({ error: `Expected format: { name: <String>, type: <String>, maker: <String>, cost: <String>, complications: <String> }. You're missing a "${requiredParameter}" property.` });
      return;
    }
  }
 
  const { name, type, maker, cost, complications } = watch;
  app.locals.watches[index] = { ...app.locals.watches[index], name, type, maker, cost, complications };

  response.status(200).json({ name, type, id, maker, cost, complications });
});


