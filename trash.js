const { MongoClient } = require("mongodb");
// Connection URL
const url =
  "mongodb+srv://abhinavNodeHelloWorld:PasswordNode@helloworldcluster.np5ar.mongodb.net/";
const client = new MongoClient(url);

// Database Name
const dbName = "helloWorldDb";

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const collection = db.collection("helloWorldColl");

  const insertResult = await collection.insertMany([]);
  const findResult = await collection.find({}).toArray();

  return "done.";
}

// app.get("/feed", async (req, res) => {
//   try {
//     const users = await Users.find({});
//     res.send(users);
//   } catch (e) {
//     res.status(500).send("Something went wrong!! " + e.message);
//   }
// });
// app.post("/user", async (req, res) => {
//   try {
//     const users = await Users.find({ emailId: req.body.emailId });
//     res.send(users);
//   } catch (e) {
//     res.status(500).send("Something went wrong!! " + e.message);
//   }
// });

// app.delete("/user", async (req, res) => {
//   try {
//     await Users.findOneAndDelete({ emailId: req.body.emailId });
//     res.send("User deleted successfully");
//   } catch (e) {
//     res.status(500).send("Something went wrong!! " + e.message);
//   }
// });

// app.delete("/user", async (req, res) => {
//   try {
//     await Users.findOneAndDelete({ emailId: req.body.emailId });
//     res.send("User deleted successfully");
//   } catch (e) {
//     res.status(500).send("Something went wrong!! " + e.message);
//   }
// });

// app.patch("/user/:userId", async (req, res) => {
//   try {
//     const allowed_Keys = [
//       "firstName",
//       "lastName",
//       "password",
//       "age",
//       "gender",
//       "photoUrl",
//       "about",
//       "skills",
//     ];
//     isAllowed = Object.keys(req.body).every((v) => allowed_Keys.includes(v));
//     if (!isAllowed) throw new Error("Not allowed to update given data");
//     await Users.findByIdAndUpdate(req.params?.userId, req.body);
//     res.send("User Updated successfully");
//   } catch (e) {
//     res.status(500).send("Something went wrong!! " + e.message);
//   }
// });

// app.put("/user", async (req, res) => {
//   try {
//     await Users.findOneAndUpdate({ emailId: req.body.emailId }, req.body);
//     res.send("User Updated successfully");
//   } catch (e) {
//     res.status(500).send("Something went wrong!! " + e.message);
//   }
// });

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
