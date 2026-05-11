const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const uri = process.env.MONGODB_URI;
const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

async function run() {
  try {
    await client.connect();

    const db = client.db("wanderlust");
    const destinationsCollections = db.collection("destinations");

    app.get("/destinations", async (req, res) => {
      const result = await destinationsCollections.find().toArray();
      res.json(result);
    });

    app.get("/destinations/:id", async (req, res) => {
      const { id } = req.params;
      const result = await destinationsCollections.findOne({
        _id: new ObjectId(id),
      });
      res.json(result);
    });

    app.patch("/destinations/:id", async (req, res) => {
      const { id } = req.params;
      const updatedData = req.body;
      console.log(updatedData);
      const result = await destinationsCollections.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData },
      );
      res.json(result);
    });

    app.delete("/destinations/:id", async (req, res) => {
      const { id } = req.params;
      const result = await destinationsCollections.deleteOne({
        _id: new ObjectId(id),
      });
      res.json(result);
      
    });

    app.post("/destinations", async (req, res) => {
      const destinationsData = req.body;
      
      const result = await destinationsCollections.insertOne(destinationsData);
      res.json(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
