const express = require('express');
const app = express();

app.use(express.json());

// stage 1
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Hacker Shop API dziala!',
    endpoints: {
      'GET /products':            'Lista produktow (?sort=price&order=desc&category=peripherals)',
      'GET /products/:id':        'Pojedynczy produkt',
      'POST /products':           'Dodaj produkt (body: { name, price, category? })',
      'DELETE /products/:id':     'Usun produkt',
    },
  });
});

// stage 2
app.use('/products', require('./routes/products'));

// 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Nie znaleziono',
    message: `Endpoint ${req.method} ${req.url} nie istnieje`,
    hint: 'GET / zeby zobaczyc dostepne endpointy',
  });
});

// error handler
app.use((err, req, res, next) => {
  console.error('Blad serwera:', err.message);
  res.status(500).json({
    error: 'Wewnetrzny blad serwera',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Testuj w terminalu:');
  console.log('  curl http://localhost:3000/');
  console.log('  curl http://localhost:3000/products');
  console.log('  curl http://localhost:3000/products?sort=price&order=desc');
});
