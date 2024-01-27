const express = require('express');
const router = express.Router();
const fs = require('fs');

// Ruta para listar todos los productos
router.get('/', (req, res) => {
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
  const limit = req.query.limit;
  const limitedProducts = limit ? products.slice(0, limit) : products;

  res.json(limitedProducts);
});

router.get('/:pid', (req, res) => {
  const productId = req.params.pid;
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
  const product = products.find(p => p.id === productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

router.post('/', (req, res) => {
  const newProduct = req.body;
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
  newProduct.id = Date.now().toString();
  products.push(newProduct);
  fs.writeFileSync('productos.json', JSON.stringify(products, null, 2));

  res.json(newProduct);
});

router.put('/:pid', (req, res) => {
  const productId = req.params.pid;
  const updatedProduct = req.body;

  let products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));

  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex !== -1) {
    products[productIndex] = { ...products[productIndex], ...updatedProduct };

    fs.writeFileSync('productos.json', JSON.stringify(products, null, 2));

    res.json(products[productIndex]);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});


router.delete('/:pid', (req, res) => {
  const productId = req.params.pid;

  let products = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
  const filteredProducts = products.filter(p => p.id !== productId);

  if (filteredProducts.length < products.length) {
    fs.writeFileSync('productos.json', JSON.stringify(filteredProducts, null, 2));

    res.json({ message: 'Producto eliminado exitosamente' });
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

module.exports = router;
