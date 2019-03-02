const mongoose = require('mongoose');
const Product = require('../models/product');

exports.getAllProducts = (req, res, next) => {
  Product.find()
    .then(docs => {
      if (docs) {
        console.log('All products queried.');
        return res.status(200).json(docs);
      } else {
        next();       
      }
    })
    .catch(error => {
      console.error('Error: ', error);
      next(error);
    });
};

exports.getProductById = (req, res, next) => {
  const id = req.params.id;
  if (mongoose.Types.ObjectId.isValid(id)) {
    Product.findById(req.params.id)
      .then(doc => {
        if (doc) {
          console.log(`Product queried (id: ${doc._id})`);
          return res.status(200).json(doc);
        } else {
          next();       
        }
      })
      .catch(error => {
        console.error('Error: ', error);
        next(error);
      });
  } else {
    const error = new Error('Invalid id.');
    error.status = 400;
    next(error);
  }
};

exports.addProduct = (req, res, next) => {
  const product = new Product({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    quantity: req.body.quantity || 0
  });
  product.save()
    .then(doc => {
      console.log(`Product saved (id: ${doc._id})`);
      return res.status(201).json({
        message: 'Product created.',
        product: doc
      });
    })
    .catch(error => {
      console.error('Error: ', error.errmsg);
      next(error);
    });
};

exports.updateProduct = (req, res, next) => {
  const id = req.params.id;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const update = req.body;
    Product.findByIdAndUpdate(id, update, {new: true})
      .then(doc => {
        if (doc) {
          console.log(`Product updated (id: ${doc._id})`);
          return res.status(200).json({
            message: 'Product updated.',
            product: doc
          });
        } else {
          const error = new Error('Product not exist.');
          error.status = 400;
          next(error);
        }
      })
      .catch(error => {
        console.error('Error: ', error.errmsg);
        next(error);
      });
  } else {
    const error = new Error('Invalid id.');
    error.status = 400;
    next(error);
  }
};

exports.deleteProduct = (req, res, next) => {
  const id = req.params.id;
  if (mongoose.Types.ObjectId.isValid(id)) {
    Product.findByIdAndDelete(id)
      .then(doc => {
        if (doc) {
          console.log(`Product deleted (id: ${doc._id})`);
          return res.status(200).json({
            message: 'Product deleted.',
            product: doc
          });
        } else {
          next();       
        }
      })
      .catch(error => {
        console.error('Error: ', error);
        next(error);
      });
  } else {
    const error = new Error('Invalid id.');
    error.status = 400;
    next(error);
  }
};
