const port = 3001
const host = 'localhost'
const express = require('express')
const { blogi } = require('./kanta')

const app = express()
app.use(express.json())

app.get("/blogi", async (req, res) => {

	try {
		const blogijson = await blogi()
		res.status(200).json(blogijson)
	}
	catch (err) {
		throw err
	}
})
app.listen(port, host, () => console.log(`${host}:${port} kuuntelee...`))