///////////////////////////////
// DEPENDENCIES
////////////////////////////////
require("dotenv").config()
const express = require("express")
const PORT = 3001 //process.env.PORT|| 3001
const mongoose = require("mongoose")
const app = express()
const cors = require("cors")
const morgan = require("morgan")
const Babies = require('./models/BabySchema')
// const Diapers = require('./models/DiaperSchema')
const Feeding = require('./models/FeedSchema')


mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const cxn = mongoose.connection

//Setup mongoose connection messages
cxn.on("open", () => console.log("The Mongo Connection is Open"))
    .on("close", () => console.log("The Mongo Connection is Closed"))
    .on("error", (err) => console.log(err))

///////////////////////////////
// MODELS
////////////////////////////////



//Middleware
app.use(express.json())
app.use("/static", express.static("static"))
app.use(cors());
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true })) // parse html form bodies into req.body




// Routes
app.get("/", (req, res) => {
    res.send("Hello Bebés del Mundo Mundialón!")
})
//Babies Index Route
app.get("/babies", async (req, res) => {
    try {
        //send all babies
        res.json(await Babies.find({}))
    } catch (error) {
        //send error
        res.status(400).json(error)
    }
})

//BABIES
//SEED
app.get("/babies/seed", async (req, res) => {
    //delete the peeps
    await Babies.remove({}).catch((err) => res.send(err))
    //add your sample baby
    const babes = await Babies.create([
        { babyName: "Mateo Emiliano VG", birthday: "2021-10-15", image: "https://i.imgur.com/WkQk7H5.jpg", parents: "Rebecca Velarde Glaser and Ramon Velarde Glaser" }
    ]).catch((err) => res.send(err))
    res.json(babes)
})

//Index
app.get("/babies/", async (req, res) => {
    try {
        res.json(await Babies.find({}))
    } catch (error) {
        res.status(400).json(error)
    }
});
//Create
app.post("/babies/", async (req, res) => {
    try {
        res.json(await Babies.create(req.body))
    } catch (error) {
        res.status(400).json(error)
    }

})


//Show
app.get("/babies/:id", async (req, res) => {
    try {
        const baby= await Babies.findById(req.params.id)
        const feed= await Feeding.find({baby:req.params.id}).populate()
        res.json({baby,feed})
    } catch (error) {
        res.status(400).json(error)
    }
})



//Delete
app.delete("/Babies/:id", async (req, res) => {
    try {
        res.json(await Babies.findByIdAndDelete(req.params.id))
    } catch (error) {
        res.status(400).json(error)
    }
})

//Update Route
app.put("/babies/:id", async (req, res) => {
    try {
        res.json(await Babies.findByIdAndUpdate(req.params.id, req.body)
        ) // new:true is not required...
    } catch (error) {
        res.status(400).json(error)
    }
})




///////////////////////////////////////////////////////////////////////////////
//Diaper
// app.get("/diapers/seed", async (req, res) => {
//     //delete the peeps
//     await Diapers.remove({}).catch((err) => res.send(err))
//     //add your sample baby
//     const diaper = await Diapers.create([
//         {
//             typeofWaste: "both",
//             amountOfNo1: "barely",
//             amountOfNo2: "poopzilla"
//         }
//     ]).catch((err) => res.send(err))
//     res.json(diaper)
// })

// // Index Diapers
// app.get("/diapers", async (req, res) => {
//     try {
//         res.json(await Diapers.find({}))
//     } catch (error) {
//         res.status(400).json(error)
//     }
// })
// //Create
// app.post("/diapers/", async (req, res) => {
//     try {
//         res.json(await Diapers.create(req.body))
//     } catch (error) {
//         res.status(400).json(error)
//     }

// })


// //Show
// app.get("/diapers/:id", async (req, res) => {
//     try {
//         res.json(await Diapers.findById(req.params.id))
//     } catch (error) {
//         res.status(400).json(error)
//     }
// })



// //Delete
// app.delete("/diapers/:id", async (req, res) => {
//     try {
//         res.json(await Diapers.findByIdAndDelete(req.params.id))
//     } catch (error) {
//         res.status(400).json(error)
//     }
// })

// //Update Route
// app.put("/diapers/:id", async (req, res) => {
//     try {
//         res.json(await Diapers.findByIdAndUpdate(req.params.id, req.body)
//         ) // new:true is not required...
//     } catch (error) {
//         res.status(400).json(error)
//     }
// })


///////////////////////////////////////////////////////////////////////////////
// Feedings

// app.get("/feeding/seed", async (req, res) => {
//     //delete the peeps
//     await Feeding.remove({}).catch((err) => res.send(err))
//     //add your sample baby
//     const feed = await Feeding.create([
//         {
//             user: "Mateo", milk: "breast milk", BreastTime: "7 min"
//         }
//     ]).catch((err) => res.send(err))
//     res.json(feed)

app.get("/feeding", async (req, res) => {
    try {
        res.json(await Feeding.find({}))
    } catch (error) {
        res.status(400).json(error)
    }
})

//Create
app.post("/babies/:id/feeding/", async (req, res) => {
    try {
        const id = req.params.id;
        const newFeeding =
            //    res.json(await Feeding.create(req.body))
            new Feeding({
                milk: req.body.milk,
                bottleAmount: req.body.bottleAmount,
                BreastTime: req.body.BreastTime,
                baby: id
            })
        res.json(newFeeding)
        await newFeeding.save();
        const babyRelated = await Babies.findById(id);
        babyRelated.feeding.push(newFeeding)
        await babyRelated.save()
    } catch (error) {
        res.status(400).json(error)
    }

})

//Show
app.get("/feeding/:id", async (req, res) => {
    try {
        res.json(await Feeding.findById(req.params.id))
    } catch (error) {
        res.status(400).json(error)
    }
})



//Delete
app.delete("/feeding/:id", async (req, res) => {
    try {
        res.json(await Diapers.findByIdAndDelete(req.params.id))
    } catch (error) {
        res.status(400).json(error)
    }
})

//Update Route
app.put("/feeding/:id", async (req, res) => {
    try {
        res.json(await Feeding.findByIdAndUpdate(req.params.id, req.body)
        ) // new:true is not required...
    } catch (error) {
        res.status(400).json(error)
    }
})



//Listener
app.listen(PORT, () => console.log(`listening on port ${PORT} chido y agusto compadrito!!`))

