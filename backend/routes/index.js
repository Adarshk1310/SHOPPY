const express =require('express');
const router = express.Router();

const homeController = require('../controllers/home');
const userController =require('../controllers/usercontroller');
const verifyToken = require('../middleware/middleware');

router.get('/',homeController.home);
router.post('/signup',userController.signup);
router.post('/login',userController.login);
router.get('/search/:id',homeController.search);
router.post('/add',verifyToken,homeController.addProduct);
router.post('/cartproducts',homeController.cartproducts);
router.post('/cartItem/qtyDecrease',verifyToken,homeController.qtyDecrease);
router.post('/cartItem/qtyIncrease',verifyToken,homeController.qtyIncrease);
router.delete('/cartItem/delete',verifyToken,homeController.delete);
router.post('/placeorder',verifyToken,homeController.placeOrder);
router.post('/orderProducts',homeController.orderProducts);
router.delete('/cancelorderitem',verifyToken,homeController.cancelItem);



module.exports=router;