    import express from 'express'
    import fetch from 'node-fetch'
    import cors from 'cors'
    import {MongoClient} from 'mongodb'
import path from 'path'
import { fileURLToPath } from 'url'
    class User {
        constructor(username, password) {
            this.username = username;
            this.password = password;
        }
    }
    const url = 'mongodb://localhost:27017';
    const client = new MongoClient(url);
    await client.connect();
    const db = client.db("db");
    const collection = db.collection("users");
    const users = await collection.find().toArray();
    console.log(users);
    const app = express();
    app.use(express.json());
    app.use(cors());
    app.post('/register', async(req, res) => {
        const {UserLogin, userPassword} = req.body;
        try {
            const user = new User(UserLogin, userPassword);
            
            const result = await collection.find({username: UserLogin}).toArray();
            switch(result.length) {
                case 0 : 
                await collection.insertOne(user);
                return res.json({success:true});
                default: return res.json({success: false});
            }
            
        } catch(error) {
            console.error(error);
        }

    });
    app.post('/login', async(req, res) => {
        const {UserLogin, userPassword} = req.body;
        try {
            const user = new User(UserLogin, userPassword);
            const result = await collection.find({username : UserLogin}).toArray();
            if(result.length == 0) {
                return res.json({success:false});
            }
            else {
                if(result[0].password == user.password) {
                    return res.json({success:true});
                }
                else {
                    return res.json({success:false});
                }
            }
        }
            
        catch(error) {console.error(error);}
    });
    app.get('/user', async(req, res) => {
        try {
        const Res = await fetch("https://randomuser.me/api/");
        if(!Res.ok) {
            throw new Error("Internal server error!");
        }
        const data = await Res.json();
        res.json(data);
    } catch(error) {
        console.error(error);
    }
    });
app.post('/save-user', async(req, res) => {
        const {gender, name, phoneNumber, image,password, age, UserLogin} = req.body;
        try {
            const checker = await collection.find({savedUsers : {gender, name, phoneNumber, image, password, age, UserLogin}}).toArray();
            console.log(checker[0]);
            if(checker.length > 0) {
                return res.json({message : "This user has been alredy saved"});
            }
            await collection.updateOne(
                {username : UserLogin},
                {$push:{
                savedUsers : {gender, name, phoneNumber, image,password, age, UserLogin}}},
                {upsert: true},
            );
            const users = await collection.find({username: UserLogin}).toArray();
            for(let i = 0; i < users[0].savedUsers.length; i++) { 
            console.log(users[0].savedUsers[i]);
            }
            return res.json({success : true})
        }
        catch(error) {
            console.log(error);
        }
});
app.post('/load-saved-users', async(req, res) => {
    const {UserLogin} = req.body;
    console.log(req.body);
    try {
        const user = await collection.find({username : UserLogin}).toArray();
        console.log(user[0]);
        if(user[0].savedUsers.length > 0) {
        return res.json({savedUsers : user[0].savedUsers});
        }
        else {
            return res.json({success: false});
        }
    } catch(error) {
        console.error(error);
    }
        
});
app.post('/delete-saved-user', async(req, res) => {
    const {UserLogin, deleteUser} = req.body;
    console.log(deleteUser);
    try {
        await collection.updateOne({
            username : UserLogin
        },
        {$pull : {savedUsers : {
            name: deleteUser}}}
    );
    const target = await collection.find({username : UserLogin}).toArray();
    console.log(target[0].savedUsers.length);
    return res.json({message: "User was successfully deleted!"});

    } catch(error) {
        console.error(error);
    }
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PATH = path.join(__dirname, "..", "dist");
    app.use(express.static(PATH));
    app.get(/^\/(?!api).*/, (req, res) => {
        res.sendFile(path.join(PATH,"index.html"));
    });
    app.listen(3000);