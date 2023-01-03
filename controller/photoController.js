import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'


import mongodb from "../lib/mongodb.js";
// import { ObjectId } from "mongodb.js";
const collection = mongodb.collection("photos");

const db = new Low(new JSONFile("data/db.json"))


export const getAllPhotos = async (req, res) => {
    const photos = await collection.find().toArray();
    res.json(photos);

}

export const getPhoto = async (req, res) => {
    await db.read()
    const value = db.data.photos.find(a => a.id === +req.params.id)

    if(!value) {
        res.status(404).send("Not found")
        return
    }
    res.json(value)
}

export const editPhoto = async (req, res) => {
    await db.read()

    const index = db.data.photos.findIndex(a => a.id === +req.params.id)

    if(index < 0) {
        res.status(404).send("Not found")
        return
    }

    db.data.photos[index] = { ...db.data.photos[index], ...req.body }

    await db.write()

    res.send(`${req.params.id} updated`);
}

export const deletePhoto = async (req, res) => {
    await db.read()
    const index = db.data.photos.findIndex(a => a.id === +req.params.id)

    if(index < 0) {
        res.status(404).send("Not found")
        return
    }

    db.data.photos.splice(index, 1)

    

    db.write()

    res.status(202).send(`${req.params.id} deleted`)
}

export const savePhoto = async (req, res) => {
     // Neue Einträge erstellen wir mit insertOne().
    // Die Methode löst mit einem Objekt auf, das u.a. die neue ID enthält.
    const result = await collection.insertOne({ ...req.body });
    res.status(201).json(result);

    await db.read()

    const nextId = Math.max(...db.data.photos.map(a => a.id)) + 1
    
    db.data.photos.push({id: nextId, ...req.body})

    db.write()

    res.send(`${nextId}`)
}