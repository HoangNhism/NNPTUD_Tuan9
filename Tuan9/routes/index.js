var express = require('express');
var router = express.Router();
const Category = require('../schemas/category');
const Product = require('../schemas/product');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// API route to get category by slug
router.get('/api/:categoryslug', async function(req, res, next) {
  try {
    const categorySlug = req.params.categoryslug;
    const category = await Category.findOne({ slug: categorySlug });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    const products = await Product.find({ category: category._id });
    
    res.json({
      category: category,
      products: products
    });
  } catch (error) {
    next(error);
  }
});

// API route to get product by slug within a category
router.get('/api/:categoryslug/:productslug', async function(req, res, next) {
  try {
    const categorySlug = req.params.categoryslug;
    const productSlug = req.params.productslug;
    
    const category = await Category.findOne({ slug: categorySlug });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    const product = await Product.findOne({ 
      slug: productSlug,
      category: category._id
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({
      category: category,
      product: product
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;