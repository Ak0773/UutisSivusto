const port = 3003
const host = 'localhost'
const Math = require('mathjs')
const { XMLParser, XMLValidator } = require('fast-xml-parser')

const express = require('express')
const { uutiset } = require('./kanta')
const path = require('path')
const app = express()
app.use(express.json())
const fetch = (...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args))
//app.use(express.static(path.join(__dirname, 'files')))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'sivusto'))
app.use('/inc', express.static('includes'))

app.get("/uutiset", async (req, res) => {

	try {
		const uutisetjson = await uutiset()
		res.status(200).json(uutisetjson)
	}
	catch (err) {
		throw err
	}
})
app.get('/', async (req, res) => {
	const uutisdata = 'http://localhost:3003/uutiset'
	const blogidata = 'http://localhost:3001/blogi'
	const saadata = 'http://localhost:3000/saa/viikko/' + Math.floor(Math.random() * 22)

	let uutisjson = []
	let blogijson = []
	let saajson = []
	try {
		const uutis = await fetch(uutisdata)
		uutisjson = await uutis.json()
	} catch (err) { console.log(err) }

	try {
		const saablogi = await fetch(blogidata)
		blogijson = await saablogi.json()
	} catch (err) { console.log(err) }

	try {
		const saa = await (await fetch(saadata)).text()
		const validia = XMLValidator.validate(saa)
		if (validia) {
			// jos on, sitten käsitellään se
			const parseri = new XMLParser()
			saajson = parseri.parse(saa).säädata.paiva
		}
	} catch (err) { console.log(err) }
	console.log(saajson)

	res.render('sivusto.ejs', {
		uutiset: uutisjson,
		blogi: blogijson,
		saa: saajson
	})
})


app.listen(port, host, () => console.log(`${host}:${port} kuuntelee...`))

