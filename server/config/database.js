const { MongoClient } = require('mongodb');
const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url, {
    socketTimeoutMS: 9000
});
const connection = async () => {
    await client.connect();
    const db = client.db("chatting_app");
    return db;
}

module.exports = connection();