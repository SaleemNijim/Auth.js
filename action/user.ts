
// Step 2: Setting Up MongoDB Connection
// "Creating the User Registration Handler


'use server'

import { connectDB } from "@/lib/db"
import { User } from "@/models/users"
import { redirect } from "next/navigation"
import { hash } from "bcryptjs"
import { CredentialsSignin } from "next-auth"
import { signIn } from "@/auth"

const login = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
        await signIn("credentials", {
            redirect: false,
            callbackUrl: "/",
            email,
            password,
        });
    } catch (error) {
        const someError = error as CredentialsSignin;
        return someError.cause;
    }
    redirect("/");
};


const register = async (formData: FormData) => {

    const firstName = formData.get('firstname')
    const lastName = formData.get('lastname')
    const email = formData.get('email')
    const password = formData.get('password')

    if (!firstName || !lastName || !email || !password) {
        throw new Error("Please Fill All Fields")
    }

    await connectDB()

    // exisitong  user 
    const exitingUSer = await User.findOne({ email })

    // if (exitingUSer) throw new Error("User Already Exists")

    const hashedPassword = await hash(password, 12)

    await User.create({ firstName, lastName, email, password: hashedPassword })
    console.log("User Created Successfully");

    redirect('/login')

}

const fetchAllUsers = async () => {
    await connectDB();
    const users = await User.find({})

    return users
}

export { register, login, fetchAllUsers };