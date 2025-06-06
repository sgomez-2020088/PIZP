import User from '../src/user/user.model.js'

export const exitEmailUser = async(email)=>{
    const alreadyEmail = await User.findOne({email})
    if(alreadyEmail){
        console.error(`Email ${email} is already`)
        throw new Error(`Email ${email} is already`)
    }
}

export const existDpi = async(DPI)=>{
    const alreadyDpi = await User.findOne({DPI})
    if( alreadyDpi){
        console.error(`DPI ${DPI} is already`)
        throw new Error(`DPI ${DPI} is alredy`)
    }
}

export const existUser = async(userInformation)=>{
    const alreadyUser = await User.findOne({
        $or:[
            {email: userInformation},
            {username: userInformation}
        ]
    })
    if(!alreadyUser){
        console.error(`User not found `)
        throw new Error(`User not found`)
    }
}
export const findUser = async(id)=>{
    try{
        const userExist = await User.findById(id)
        if(!userExist) return false
        return userExist
    }catch(err){
        console.error(err)
        return false
    }
}