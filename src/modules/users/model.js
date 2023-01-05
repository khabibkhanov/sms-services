const { fetchAll } = require('../../lib/postgres')
const { GET_USERS } = require('./query.js')

const getUsers = async () => {
	let user = await fetchAll(GET_USERS)
    return user
}

module.exports = {
	getUsers
}