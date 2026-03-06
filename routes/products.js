const router = require('express').Router();

let nextId = 7;
const products = [
  { id: 1, name: 'Klawiatura mechaniczna RGB', price: 349.99, category: 'peripherals' },
  { id: 2, name: 'Mysz bezprzewodowa 16K DPI', price: 249.00, category: 'peripherals' },
  { id: 3, name: 'Monitor 27" 165Hz',          price: 1299.00, category: 'displays' },
  { id: 4, name: 'Kabel USB-C 2m',             price: 29.99, category: 'cables' },
  { id: 5, name: 'Hub USB 7-portowy',           price: 89.00, category: 'accessories' },
  { id: 6, name: 'Podkładka pod mysz XXL',      price: 59.99, category: 'peripherals' },
];

const VALID_CATEGORIES = ['peripherals', 'displays', 'cables', 'accessories', 'components'];

router.get('/', (req, res) => {
  let result = [...products];

  if (req.query.category) {
    result = result.filter(p => p.category === req.query.category);
  }

  if (req.query.sort === 'price') {
    const order = req.query.order === 'desc' ? -1 : 1;
    result.sort((a, b) => (a.price - b.price) * order);
  }

  res.json(result);
});

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ error: 'Produkt nie znaleziony' });
  }

  res.json(product);
});

router.post('/', (req, res) => {
  const { name, price, category } = req.body;
  const errors = [];

  if (!name)                               errors.push('Pole "name" jest wymagane');
  else if (typeof name !== 'string')       errors.push('Pole "name" musi być stringiem');
  else if (name.trim().length < 2)         errors.push('Pole "name" musi mieć min. 2 znaki');
  else if (name.trim().length > 100)       errors.push('Pole "name" może mieć max. 100 znaków');

  if (price === undefined || price === null)  errors.push('Pole "price" jest wymagane');
  else if (typeof price !== 'number')         errors.push('Pole "price" musi być liczbą');
  else if (price <= 0)                        errors.push('Pole "price" musi być większe od 0');
  else if (price > 99999.99)                  errors.push('Pole "price" nie może przekraczać 99999.99');

  if (category && !VALID_CATEGORIES.includes(category)) {
    errors.push(`Pole "category" musi być jednym z: ${VALID_CATEGORIES.join(', ')}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Walidacja nie powiodła się', details: errors });
  }

  const newProduct = {
    id: nextId++,
    name: name.trim(),
    price: Math.round(price * 100) / 100,
    category: category || 'accessories',
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Produkt nie znaleziony' });
  }

  const deleted = products.splice(index, 1)[0];
  res.json({ message: 'Usunięto', product: deleted });
});

module.exports = router;
