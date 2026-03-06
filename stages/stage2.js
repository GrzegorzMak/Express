const express = require('express');
const app = express();

app.use(express.json());

const products = [
  { id: 1, name: 'Klawiatura mechaniczna RGB', price: 349.99, category: 'peripherals' },
  { id: 2, name: 'Mysz bezprzewodowa 16K DPI', price: 249.00, category: 'peripherals' },
  { id: 3, name: 'Monitor 27" 165Hz',          price: 1299.00, category: 'displays' },
  { id: 4, name: 'Kabel USB-C 2m',             price: 29.99, category: 'cables' },
  { id: 5, name: 'Hub USB 7-portowy',           price: 89.00, category: 'accessories' },
  { id: 6, name: 'Podkładka pod mysz XXL',      price: 59.99, category: 'peripherals' },
];

app.get('/', (req, res) => {
  res.json({ status: 'online', message: 'Hacker Shop API działa!' });
});


app.get('/products', (req, res) => {
  let result = [...products];

 
  if (req.query.sort === 'price') {
    const order = req.query.order === 'desc' ? -1 : 1;
    result.sort((a, b) => (a.price - b.price) * order);
  }

  res.json(result);
});


app.get('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ error: 'Produkt nie znaleziony' });
  }

  res.json(product);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
  console.log('GET /products          — lista produktów');
  console.log('GET /products?sort=price — posortowane po cenie');
  console.log('GET /products/:id      — pojedynczy produkt');
});
