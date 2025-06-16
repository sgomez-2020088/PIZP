import User from '../src/user/user.model.js'
import { encrypt } from '../utils/encrypt.js'


export const createDefaultAdmin = async () => {
    try {
        const adminEmail = "admin@default.com"
        const existingAdmin = await User.findOne({ email: adminEmail })

        if (!existingAdmin) {
            const hashedPassword = await encrypt("123.sd/")
            const adminUser = new User({
                name: "Admin",
                surname: "Default",
                email: adminEmail,
                DPI: 3852261360101,
                password: hashedPassword,
                phone: "123456789",
                role: "ADMIN",
                status: true
            })

            await adminUser.save()
        }
    } catch (err) {
        console.error(err)
    }
}