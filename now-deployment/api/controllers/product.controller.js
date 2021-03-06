// controller/producct.controller.js
// Handles all Product CRUD operations

const Product = require('../models/product.model');
const productService = require('../services/product.service');
const scraperService = require('../services/scraper.service');

module.exports = {
  // GET
  getAll: (req, res) => {
    // No endpoint
    productService
      .getAll()
      .then(products => res.status(202).json(products))
      .catch(err => res.status(422).json(err));
  },

  getById: (req, res) => {
    // No endpoint
    productService
      .getById(req.params.id)
      .then(product => res.status(202).json(product))
      .catch(err => res.status(422).json(err));
  },

  // POST
  create: (req, res) => {
    productService
      .create(req.body.url)
      .then(product => res.status(201).json(product))
      .catch(err => res.status(422).json(err));
  },

  // PUT
  update: (req, res) => {
    productService
      .updateById(req.params.id, req.body)
      .then(updatedProduct => res.status(202).json(updatedProduct))
      .catch(err => res.status(422).json(err));
  },

  // DELETE
  remove: (req, res) => {
    productService
      ._remove(req.params.id)
      .then(removed => res.status(202).json(removed))
      .catch(err => res.status(422).json(err));
  }
};
