const express = require('express');
const router = express.Router();
const nftController = require('../controllers/nftController');
const passport = require('passport') ;


router.get('/', nftController.listNFTs) ;

router.use(passport.authenticate('jwt', { session: false }));
router.get('/ordered', nftController.listOrderedNFTs) ;
router.post('/save', nftController.saveNFT) ;
router.post('/', nftController.listNFTsByCart) ;
module.exports = router;