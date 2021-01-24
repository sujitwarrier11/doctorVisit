const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const ObjectID = require('mongodb').ObjectID;

class User {
    constructor(client) {
        this.username = '';
        this.salt = '';
        this.hash = '';
        this._id = Math.random();
        this.client = client;
        this.firstName = '';
        this.lastName = '';
        this.files = [];
    }


    setPassword(password) {
        this.salt = crypto.randomBytes(16).toString('hex');
        this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    };

    validatePassword(password) {
        const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
        return this.hash === hash;
    }
    generateJWT() {
        const today = new Date();
        const expirationDate = new Date(today);
        expirationDate.setDate(today.getDate() + 60);

        return jwt.sign({
            email: this.email,
            id: this._id,
            exp: parseInt(expirationDate.getTime() / 1000, 10),
        }, 'secret');
    }

    toJson() {
        return {
            _id: this._id,
            username: this.username,
            token: this.generateJWT(),
        };
    }

    static findUser(username, client) {
        return new Promise((resolve, reject) => {

            const collection = client.db("HomeTest1").collection("test1");
            // perform actions on the collection object
            collection.findOne({ username }).then(user => {
                console.log("user", user);
                if (user) {
                    const objUser = new User(client);
                    objUser.username = user.username;
                    objUser.salt = user.salt;
                    objUser.hash = user.hash;
                    objUser.firstName = user.firstName;
                    objUser.lastName = user.lastName;
                    objUser._id = user._id;
                    resolve(objUser);
                } else {
                    reject({});
                }
            }).catch(error => {
                console.log("error promise",error);
                reject(error);
            });
        });
    }

    UpdateFiles(filePath){
        const ths = this;
        return new Promise((resolve, reject) => {
            const collection = ths.client.db("HomeTest1").collection("test1");
            console.log("user",ths._id);
            collection.findOne({ _id: ObjectID(ths._id) }).then(user => {
                console.log("user", user);
                if (user) {
                    const fileCollection = user.files || [];
                    console.log("fc",fileCollection);

                    collection.update(  { _id: ObjectID(ths._id)} , { $set: { files : [...fileCollection, filePath]  } } );
                    resolve([...fileCollection, filePath]);
                } else {
                    reject({
                        error: 'user not found.'
                    });
                }
            }).catch(error => {
                console.log("error promise",error);
                reject(error);
            });
            
        });
    }

    GetFiles(){
        const ths = this;
        return new Promise((resolve, reject) => {
            const collection = ths.client.db("HomeTest1").collection("test1");
            console.log("user",ths._id);
            collection.findOne({ _id: ObjectID(ths._id) }).then(user => {
                console.log("user", user);
                if (user) {
                    const fileCollection = user.files || [];
                    resolve(fileCollection);
                } else {
                    reject({
                        error: 'user not found.'
                    });
                }
            }).catch(error => {
                console.log("error promise",error);
                reject(error);
            });
            
        });
    }


    static findById(id, client) {
        return new Promise((resolve, reject) => {
            const collection = client.db("HomeTest1").collection("test1");
            // perform actions on the collection object
            collection.findOne({ _id: ObjectID(id) }).then(user => {
                console.log("user", user);
                if (user) {
                    const objUser = new User(client);
                    objUser.username = user.username;
                    objUser.salt = user.salt;
                    objUser.hash = user.hash;
                    objUser.firstName = user.firstName;
                    objUser.lastName = user.lastName;
                    objUser._id = user._id;
                    resolve(objUser);
                } else {
                    reject({});
                }
            }).catch(error => {
                console.log("error promise",error);
                reject(error);
            });
        });
    }

    static getUserObject(objUsr, client) {
        const objUser = new User();
        objUser.username = objUsr.username;
        if(objUsr.password){
          objUser.setPassword(objUsr.password);
        }
        objUser.client = client;
        objUser.firstName = objUsr.firstName;
        objUser.lastName = objUsr.lastName;
        objUser._id = objUsr._id;
        return objUser;
    }

    save() {
        const ths = this;
        return new Promise((resolve, reject) => {
            const collection = this.client.db("HomeTest1").collection("test1");
            const user = collection.find({ username: "test" });
            console.log("user", user);
            collection.insertOne({ username: this.username, salt: this.salt, hash: this.hash, firstName: this.firstName, lastName: this.lastName }, function (err, docsInserted) {
                console.log("docsInserted", docsInserted);
                if (err) {
                    console.log("error", err);
                    reject(err);
                }
                else{
                ths._id = docsInserted.insertedId;
                resolve(docsInserted);
                }
            });

        });
    }
}

module.exports = User;