import bcrypt from 'bcrypt'
import sequelize from '../connections/database'
import User from '../models/User'

async function createAdmin() {
    try {
        await sequelize.authenticate()

        const email = 'admin@example.com'
        const password = 'Admin@12345'

        const existingAdmin = await User.findOne({
            where: { email },
        })

        if (existingAdmin) {
            console.log('Admin already exists')
            process.exit(0)
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await User.create({
            firstName: 'Super',
            lastName: 'Admin',
            email,
            password: hashedPassword,
            isAdmin: true,
            isSeller: false,
            sellerRequestStatus: 'none',
        })

        console.log('Admin created successfully')
        console.log('Email:', email)
        console.log('Password:', password)

        process.exit(0)
    } catch (error) {
        console.error('Failed to create admin:', error)
        process.exit(1)
    }
}

createAdmin()