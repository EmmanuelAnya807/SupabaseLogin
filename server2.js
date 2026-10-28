import {supabase} from "../day2_day3/supabaseClient.js"
import express from "express"
import cors from "cors"

const app = express()

app.use(express.json())
app.use(cors())

const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({
            message: "Unauthorized."
        })
    }

    const token = authHeader.split(" ")[1]
    const {data: {user}, error} = await supabase.auth.getUser(token)

    if (error || !user) {
        return res.status(401).json({
            message: "Unauthorized."
        }) 
    }
    req.user = user
    next()
}

app.get("/users", async (req, res) => {
    const {data, error} = await supabase
        .from("user_login")
        .select("*")

    if (error) {
        return res.status(500).json({
            message: "Couldn't get users.",
            error: error.message
        })
    }

    res.json(data)
})


app.post("/signup", async (req, res) => {
    const {email, password} = req.body

    if (!email || !password) {
        return res.status(400).json({
            email: "Email is required.",
            password: "Password is required."
        })
    }

    const {data, error} = await supabase.auth.signUp({
        email: email,
        password: password
    })

    if (error) {
        return res.status(400).json({
            message: "User not created.",
            error: error.message
        })
    }

    return res.status(200).json({
        message: "Account created successfully; check your email for confirmation!",
        data: data
    })
})


app.post("/login", async (req, res) => {
    const {email, password} = req.body

    if (!email || !password) {
        return res.status(400).json({
            email: "Email is required.",
            password: "Password is required."
        })
    }

    const {data, error} = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })

    if (error) {
        return res.status(400).json({
            message: "User not signed in.",
            error: error.message
        })
    }

    return res.status(200).json({
        message: "Login successfull.",
        data: data
    })
})


app.post("/signout", async(req, res) => {
    const {error} = await supabase.auth.signOut()

    if (error) {
        return res.status(400).json({
            message: "Unable to sign out.",
            error: error.message
        })
    }

    return res.status(200).json({
        message: "Logout successfull.",
    })
})

app.listen(3000, () => {
    console.log("Server running on port 3000.")
})