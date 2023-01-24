const mongoose = require('mongoose')
const express = require('express')
const authRouter = require('./authRouter')
const PORT = process.env.PORT || 8080
const DB_connect = 'mongodb+srv://user:user@cluster0.zuxb6t1.mongodb.net/?retryWrites=true&w=majority'



const app  = express()

app.use(express.json())
app.use('/auth', authRouter)


const start = async () => {
    try{
        mongoose.set("strictQuery", true)
        await mongoose.connect(DB_connect)
        app.listen(PORT, ()=>{
            console.log(`Server started at port ${PORT}`)
        })
    }
    catch (e) {
        console.log(e)
    }
}

start()

