import mongoose from 'mongoose'

const connectDB = (url) => {
    return mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex:true
    })
}

export default connectDB


