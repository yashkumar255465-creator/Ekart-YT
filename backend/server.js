import express from 'express'
import 'dotenv/config'
import connectDB from './database/db.js'
import userRoute from './routes/userRoute.js'
import cors from 'cors'


const app = express()
const PORT = process.env.PORT || 3000

//middleWare
app.use(cors())
app.use(express.json())


app.use('/api/v1/user', userRoute)
// http://localhost:3000/api/v1/user/register

app.listen(PORT, '0.0.0.0', () => {
  connectDB();
  console.log(`Server is running AT port:${PORT}`);
})