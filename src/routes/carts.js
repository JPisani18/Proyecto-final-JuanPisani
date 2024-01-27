const express = require('express');
const router = express.Router();
const fs = require('fs');


router.post('/', (req, res) => {
  const newCart = {
    id: Date.now().toString(),
    products: []
  };

  const carts = JSON.parse(fs.readFileSync('carrito.json', 'utf-8'));

  carts.push(newCart);

  fs.writeFileSync('carrito.json', JSON.stringify(carts, null, 2));

  res.json(newCart);
});

router.get('/:cid', (req, res) => {
  const cartId = req.params.cid;
  const carts = JSON.parse(fs.readFileSync('carrito.json', 'utf-8'));
  const cart = carts.find(c => c.id === cartId);

  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

router.post('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;

  let carts = JSON.parse(fs.readFileSync('carrito.json', 'utf-8'));
  const cartIndex = carts.findIndex(c => c.id === cartId);

  if (cartIndex !== -1) {
    const existingProduct = carts[cartIndex].products.find(p => p.id === productId);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      carts[cartIndex].products.push({ id: productId, quantity });
    }
    fs.writeFileSync('carrito.json', JSON.stringify(carts, null, 2));

    res.json(carts[cartIndex]);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

module.exports = router;
