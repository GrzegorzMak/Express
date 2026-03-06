const express = require('express');
const app = express();

// body
app.use(express.json());

// etap 3
app.use((req, res, next) => {
  const start = Date.now();
  const time = new Date().toLocaleTimeString('pl-PL');

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const color = status >= 400 ? 'Nie' : 'Tak';
    console.log(`${color} [${req.method}] ${req.originalUrl} - ${time} (${duration}ms) → ${status}`);
  });

  next();
});

// etap 1
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Hacker Shop API działa!',
    endpoints: {
      'GET /products':            'Lista produktów (?sort=price&order=desc&category=peripherals)',
      'GET /products/:id':        'Pojedynczy produkt',
      'POST /products':           'Dodaj produkt (body: { name, price, category? })',
      'DELETE /products/:id':     'Usuń produkt',
    },
  });
});

// stage 5
app.use('/products', require('./routes/products'));

// 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Nie znaleziono',
    message: `Endpoint ${req.method} ${req.url} nie istnieje`,
    hint: 'GET / żeby zobaczyć dostępne endpointy',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Błąd serwera:', err.message);
  res.status(500).json({
    error: 'Wewnętrzny błąd serwera',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Testuj w terminalu:');
  console.log('  curl http://localhost:3000/');
  console.log('  curl http://localhost:3000/products');
  console.log('  curl http://localhost:3000/products?sort=price&order=desc');
  console.log('  curl -X POST http://localhost:3000/products -H "Content-Type: application/json" -d \'{"name":"GPU RTX 4090","price":8999.99,"category":"components"}\'');
  console.log('  curl -X DELETE http://localhost:3000/products/1');
  console.log('');
});
