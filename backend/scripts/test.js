const { MongoClient } = require('mongodb');
async function run() {
  const client = new MongoClient('mongodb://127.0.0.1:27017');
  await client.connect();
  const db = client.db('BIKES');
  
  // Find a document with Ubicacion directly on FactVentas exactly
  const doc = await db.collection('FactVentas').findOne({"Ubicacion": {"$exists": true}});
  console.log("With Ubicacion:", doc != null ? "Yes" : "No");

  if(doc) {
    console.log(JSON.stringify(doc.Ubicacion, null, 2));
  } else {
    // maybe Cliente.UbicacionKey ?
    const doc2 = await db.collection('FactVentas').findOne();
    if(doc2) {
       console.log("Total keys pattern:", Object.keys(doc2));
    }
  }

  await client.close();
}
run().catch(console.dir);
