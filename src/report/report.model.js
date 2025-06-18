import { Schema, model } from "mongoose"

const reportSchema = Schema(
    {
        typeCrime: {
            type: String,
            required: [true, 'Type crime is required'],
            enum: ['Asalto', 'Secuestro', 'Asesinato','Trafico de drogas','Desaparición forzada','Extorsión','Acoso',],
        },
        address: {
            type: String,
            required: [true, 'Address is required'],
            maxLength: [100, 'Can´t be overcome 100 characters']
        },
        lat:{
            type: Number,
            required:[true, 'Latitude is required'],
        },
        lng:{
            type: Number,
            required:[true, 'Longitude is required'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            maxLength: [500, 'Can´t be overcome 500 characters'],
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User is required'],
    
        },
    }
)
reportSchema.methods.toJSON = function(){
    const { __v,  ...report } = this.toObject()
    return report
}


export default model('Report', reportSchema)

//Borra este de aca - Se actualiza modelo report