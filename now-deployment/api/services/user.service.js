// services/user.service.js

// Holds all functions used by the controller

const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

const productService = require('./product.service');
const scraperService = require('./scraper.service');

/**
 * Returns all user document in the database
 */
const getAll = async () => {
  return await User.find().select('-hash');
};

/**
 * Returns particular user document
 * @param {ObjectId} id Specific user document id
 */
const getById = async id => {
  return await User.findById(id).select('-hash');
};

/**
 * Creates a new user document, also storing a hash of the user's password
 * @param {Object} userData Fields containing user informaiton to be stored
 */
const create = async userData => {
  // Validate Info
  if (await User.findOne({ email: userData.email })) {
    throw 'Email: ' + userData.email + ' is already taken';
  }

  const user = new User(userData);

  if (userData.password) user.hash = bcrypt.hashSync(userData.password, 10);
  else throw 'Could not create user';

  return await user.save();
};

/**
 * Updates given user document fields, generates new hash if necessary
 * @param {ObjectId} id Specific user document id
 * @param {Object} userData New user information to be updated
 */
const update = async (id, userData) => {
  const user = await User.findById(id);

  // Validate
  if (!user) throw new Error('User does not exist');
  if (
    user.email !== userData.email &&
    (await User.findOne({ email: userData.email }))
  ) {
    throw 'Email: ' + userData.email + ' is already taken';
  }

  if (userData.password) {
    userData.hash = bcrypt.hashSync(userData.password, 10);
  }

  Object.assign(user, userData);

  return await user.save();
};

/**
 * Removes particular user document
 * @param {ObjectId} id User document id
 */
const _remove = async id => {
  await User.findOneAndRemove(id);
};

// ================== PRODUCTS ==================

/**
 * Returns a populated array containing all watched products for a particulat user
 * @param {ObjectId} id Specific user document id
 */
const getProducts = async id => {
  return await User.findById(id)
    .select('savedProducts')
    .populate('savedProducts');
};

/**
 * Appends a new product id to a user's array of watched products
 * @param {ObjectId} id Specific user document id
 * @param {ObjectId} productId Specific product document id
 */
const addProduct = async (id, productUrl) => {
  // Scrape the product url
  const pageData = await scraperService.scrapeProductByUrl(productUrl, 0);
  if (!pageData) throw 'Cannot scrape page data';

  // Scrape given page and store data in Product collection
  const newProduct = await productService.create(productUrl, pageData);
  if (!newProduct) throw new Error('Cannot watch this product');

  // Store id of new product in user's savedProducts array
  return await User.findByIdAndUpdate(
    id,
    {
      $push: { savedProducts: newProduct._id }
    },
    { safe: true, upsert: true, new: true }
  ).select('-hash');
};

/**
 * Removes a product id from a user's array of watched products
 * @param {ObjectId} id User document id
 * @param {ObjectId} productId Product document id
 */
const _removeProduct = async (id, productId) => {
  // Remove Product reference in savedProducts array
  // Ensures user "owns" this product before it is removed
  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      $pull: { savedProducts: { $in: productId } }
    },
    { new: true, safe: true }
  );

  if (!updatedUser)
    throw new Error('You are not watching this product. Cannot remove');

  // Remove actual Product document
  await productService._remove(productId);

  return updatedUser;
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  _remove,

  getProducts,
  addProduct,
  _removeProduct
};
