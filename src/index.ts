import express from 'express'
import cors from 'cors';
import articleRoutes from './routes/index'
import bodyParser  from 'body-parser'


const app = express()
const port = 3000

app.use(cors())
app.use(bodyParser.json())

articleRoutes(app)
//app.use('/api', image)

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`)
})

export default app
