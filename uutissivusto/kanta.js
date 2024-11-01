const mysql = require('mysql2')
const dbconfig = require('./dbconfig.json')
function uutiset() {
	return new Promise((resolve, reject) => {
		const connection = mysql.createConnection(dbconfig)
		connection.connect()
		connection.query("SELECT *FROM uutiset order by julkaisuaika desc",
			(err, rivit) => {
				if (err) {
					reject(err)
				}
				resolve(rivit)
			})
		connection.end()
	})
}

module.exports = { uutiset }
