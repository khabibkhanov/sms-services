const { fetchAll } = require('../../lib/postgres')
const { GET_USERS, DELETE_USER } = require('./query.js')

const getUsers = async () => {
	let user = await fetchAll(GET_USERS)
    return user
}

const deleteUser = async (number) => {
	try {
		let done = await fetchAll(DELETE_USER, number)
		if (!done) {
		    return true
		} else {
		    throw done
		}
	} catch (error) {
		return error
	}
}

module.exports = {
	getUsers,
	deleteUser
}