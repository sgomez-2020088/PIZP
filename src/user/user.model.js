import { Schema, model } from "mongoose"

const userSchema = Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            maxLength: [25, 'Can´t be overcome 25 characters']
        },
        surname: {
            type: String,
            required: [true, 'Surname is required'],
            maxLength: [25, 'Can´t be overcome 25 characters']
        },
        phone: {
            type: String,
            required: [true, 'Phone is required'],
            maxLength: [13, 'Can´t be overcome 13 characters'],
            minLength: [8, 'Phone must be 8 characters']
        },
        DPI: {
            type: Number,
            required: [true, 'DPI is required'],
            unique: true,
            maxLength: [13, 'Can´t be overcome 13 characters']
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'Email is required']
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            maxLength: [100, 'Can´t be overcome 100 characters'],
            minLength: [8, 'Password must be 8 characters']
        },
        role: {
            type: String,
            required: [true, 'Role is required'],
            uppercase: true,
            enum: ['ADMIN','USER']
        },
        status: {
            type: Boolean,
            defualt: true
        }
    }
)

userSchema.methods.toJSON = function(){
    const { __v, password, _id, ...user } = this.toObject()
    user.uid = _id
    return user
}

export default model('User', userSchema)