import {supabase} from "./supabaseClient.js"
import express from "express"

const app = express()

app.use(express.json())

// Read all students
app.get("/students", async (req, res) => {
    const {data, error} = await supabase.from("students").select("*")
    if (error) return res.status(500).json({error: error.message})
    res.json(data)
})

// Create new student
app.post('/create_student', async (req, res) => {

    const { name, age } = req.body;
    const { data, error } = await supabase
        .from('students')
        .insert([{ name, age }])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});

app.listen(3000, () => console.log('Server running on port 3000'));