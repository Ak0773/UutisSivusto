const mysql = require('mysql2')
const dbconfig = require('./dbconfig.json')

function blogi() {
	return new Promise((resolve, reject) => {
		const connection = mysql.createConnection(dbconfig)
		connection.connect()
		connection.query("SELECT * FROM blogi join blogikirjoitus on blogi.blogi_id = blogikirjoitus.blogi_id order by julkaisuaika desc",
			(err, rivit) => {
				if (err) {
					reject(err)
				}
				resolve(rivit)
			})
		connection.end()
	})
}

module.exports = { blogi }