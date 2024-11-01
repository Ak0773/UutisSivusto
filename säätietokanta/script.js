const mysql = require('mysql2')
const dbconfig = require('./dbconfig.json')
const express = require('express')
const { XMLBuilder, XMLParser, XMLValidator } = require('fast-xml-parser')
const fetch = (...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args))
const app = express()
const port = 3000
const host = 'localhost'

app.get('/saa/viikko/:vko', (req, res) => {
	// hae tietokannasta säädata
	const viikko = req.params.vko
	console.log(viikko)
	const connection = mysql.createConnection(dbconfig)
	connection.connect()
	connection.query("SELECT * , DATE_FORMAT (pvm, '%d.%m.%Y') AS pv FROM saa where vko = ?", [viikko],
		(err, data) => {
			if (err) {
				throw err
			}
			const rakentaja = new XMLBuilder({
				arrayNodeName: 'paiva'
			})
			const xml = `<?xml version="1.0" encoding="UTF-8"?>
			<säädata>
				${rakentaja.build(data)}
			</säädata>`
			res.set('Content-Type', 'text/xml')
			res.send(xml)
		})
	connection.end()
})

app.listen(port, host, () => console.log(`${host}:${port} kuuntelee...`))