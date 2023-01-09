
import mongodb from "../lib/mongodb.js";
import { ObjectId } from "mongodb";
const collection = mongodb.collection("photos");




export const getAllPhotos = async (req, res) => {
    const photos = await collection.find().toArray();
    res.json(photos);

}

export const getPhoto = async (req, res) => {
    
    const value = await collection.findOne({ _id: ObjectId(req.params.id) })

    if(!value) {
        res.status(404).send("Not found")
        return
    }
    res.json(value)
}

export const replacePhoto = async (req, res) => {
    const id = req.params.id;
    const document = { ...req.body };
    const result = await collection.replaceOne(
        { _id: ObjectId(id) },
        document,
        // {
        //     // wollen wir einen Datensatz, den wir nicht gefunden haben, neu anlegen,
        //     // können wir dies mit der Option upsert: true machen.
        //     // upsert liefert uns als result eine Übersicht,
        //     // ob ein Datensatz aktualisiert oder angelegt wurde.
        //     upsert: true,
        // },
    );

    res.status(200).json(result);
}
export const updatePhoto = async (req, res) => {
    const id = req.params.id;
    const data = { ...req.body };

    // Bei PATCH Requests wollen wir einen Datensatz nur modifizieren.
    // Daher verwenden wir hier die Methode updateOne().
    // Wie auch bei replaceOne() übergeben wir hier zuerst einen Filter.
    // Danach folgt allerdings ein Objekt mit sog. "Field Update Operators".
    // Geben wir $set den Wert unserer neuen Properties,
    // Wird das Dokument um diese Properties erweitert oder - falls bereits vorhanden - geändert.
    const result = await collection.updateOne(
        { _id: ObjectId(id) },
        {
            $set: data,
        },
    );

    res.status(200).json(result); // eigentlich 204, wegen result aber "nur" 200
}

export const deletePhoto = async (req, res) => {
    await collection.deleteOne({ _id: ObjectId(req.params.id)})

    res.status(202).end()
}

export const savePhoto = async (req, res) => {
    const result = await collection.insertOne({ ...req.body });
    res.status(201).json(result);
}