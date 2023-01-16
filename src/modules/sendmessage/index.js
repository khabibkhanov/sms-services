const router = require('express').Router()
const { CheckEnteredNumber } = require('../../middlewares/checknumber.js')
const {  GET, POST } = require('./controller.js')

router.use(CheckEnteredNumber)

router.route('/api/sendMessage')
	.get( GET )

router.route('/api/sendMessage')
	.post( POST )

module.exports = router