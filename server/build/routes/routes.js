"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureRoutes = void 0;
const main_class_1 = require("../main-class");
const User_1 = require("../model/User");
const Class_1 = require("../model/Class");
const configureRoutes = (passport, router) => {
    router.get('/', (req, res) => {
        let myClass = new main_class_1.MainClass();
        res.status(200).send('Hello, World!');
    });
    router.get('/callback', (req, res) => {
        let myClass = new main_class_1.MainClass();
        myClass.monitoringCallback((error, result) => {
            if (error) {
                res.write(error);
                res.status(400).end();
            }
            else {
                res.write(result);
                res.status(200).end();
            }
        });
    });
    router.get('/promise', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let myClass = new main_class_1.MainClass();
        /* myClass.monitoringPromise().then((data: string) => {
            res.write(data);
            res.status(200).end();
        }).catch((error: string) => {
            res.write(error);
            res.status(400).end();
        }); */
        // async-await
        try {
            const data = yield myClass.monitoringPromise();
            res.write(data);
            res.status(200).end();
        }
        catch (error) {
            res.write(error);
            res.status(400).end();
        }
    }));
    router.get('/observable', (req, res) => {
        let myClass = new main_class_1.MainClass();
        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        res.setHeader('Transfer-Encoding', 'chunked');
        myClass.monitoringObservable().subscribe({
            next(data) {
                res.write(data);
            }, error(error) {
                res.status(400).end(error);
            }, complete() {
                res.status(200).end();
            }
        });
    });
    router.post('/login', (req, res, next) => {
        passport.authenticate('local', (error, user) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            }
            else {
                if (!user) {
                    res.status(400).send('User not found.');
                }
                else {
                    req.login(user, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send('Internal server error.');
                        }
                        else {
                            res.status(200).send(user);
                        }
                    });
                }
            }
        })(req, res, next);
    });
    router.post('/register', (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;
        const address = req.body.address;
        const nickname = req.body.nickname;
        const user = new User_1.User({ email: email, password: password, name: name, address: address, nickname: nickname, admin: false });
        user.save().then(data => {
            res.status(200).send(data);
        }).catch(error => {
            res.status(500).send(error);
        });
    });
    router.post('/logout', (req, res) => {
        if (req.isAuthenticated()) {
            req.logout((error) => {
                if (error) {
                    console.log(error);
                    res.status(500).send('Internal server error.');
                }
                res.status(200).send('Successfully logged out.');
            });
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    });
    router.post('/deleteUser', (req, res) => {
        const email = req.body.email;
        User_1.User.deleteOne({ email: email }).then(data => {
            res.status(200).send(data);
        }).catch(error => {
            res.status(500).send(error);
        });
    });
    router.get('/getAllUsers', (req, res) => {
        if (req.isAuthenticated()) {
            const query = User_1.User.find();
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            });
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    });
    router.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        const query = User_1.User.findOne({ email: email });
        query.then(data => {
            const isAdmin = data === null || data === void 0 ? void 0 : data.admin;
            res.status(200).send(isAdmin);
        }).catch(error => {
            console.log(error);
            res.status(500).send('Internal server error.');
        });
    });
    //subscribe to class
    router.post('/makeAdmin', (req, res) => {
        const email = req.body.email;
        const isAdmin = req.body.isAdmin;
        User_1.User.findOne({ email: email }).then(data => {
            if (data) {
                data.admin = isAdmin;
                data.save().then(() => {
                    res.status(200).send("User admin state changed successfully");
                }).catch(error => {
                    res.status(500).send(error);
                });
            }
        }).catch(error => {
            res.status(500).send(error);
        });
    });
    //create class
    router.post('/createClass', (req, res) => {
        const id = req.body.id;
        const participants = req.body.participants;
        const start = new Date(req.body.start);
        const duration = req.body.duration;
        const maxPeople = req.body.maxPeople;
        const description = req.body.description;
        const type = req.body.type;
        const difficulty = req.body.difficulty;
        const fitnessclass = new Class_1.Class({
            id: id, participants: participants, start: start,
            duration: duration, maxPeople: maxPeople, description: description, type: type, difficulty: difficulty
        });
        fitnessclass.save().then(data => {
            res.status(200).send(data);
        }).catch(error => {
            res.status(500).send(error);
        });
    });
    //delete class
    router.post('/deleteClass', (req, res) => {
        const id = req.body.id;
        Class_1.Class.deleteOne({ id: id }).then(data => {
            res.status(200).send(data);
        }).catch(error => {
            res.status(500).send(error);
        });
    });
    //subscribe to class
    router.post('/subscribeToClass', (req, res) => {
        const email = req.body.email;
        const id = req.body.id;
        Class_1.Class.findOne({ id: id }).then(data => {
            data === null || data === void 0 ? void 0 : data.participants.push(email);
            data === null || data === void 0 ? void 0 : data.save().then(() => {
                res.status(200).send("Subscribed to class successfully");
            }).catch(error => {
                res.status(500).send(error);
            });
        }).catch(error => {
            res.status(500).send(error);
        });
    });
    //unsubscribe from class
    router.post('/unsubscribe', (req, res) => {
        const email = req.body.email;
        const id = req.body.id;
        Class_1.Class.findOne({ id: id }).then(data => {
            const index = data === null || data === void 0 ? void 0 : data.participants.indexOf(email, 0);
            if (index) {
                if (index > -1) {
                    data === null || data === void 0 ? void 0 : data.participants.splice(index, 1);
                }
            }
            data === null || data === void 0 ? void 0 : data.save().then(() => {
                res.status(200).send("Unsubscibed successfully");
            }).catch(error => {
                res.status(500).send(error);
            });
        }).catch(error => {
            res.status(500).send(error);
        });
    });
    //get all classes
    router.get('/getAllClasses', (req, res) => {
        if (req.isAuthenticated()) {
            const query = Class_1.Class.find();
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            });
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    });
    router.post('/deleteAllClasses', (req, res) => {
        const query = Class_1.Class.deleteMany();
        query.then(data => {
            res.status(200).send(data);
        }).catch(error => {
            console.log(error);
            res.status(500).send(error);
        });
    });
    router.get('/checkAuth', (req, res) => {
        if (req.isAuthenticated()) {
            res.status(200).send(true);
        }
        else {
            res.status(500).send(false);
        }
    });
    return router;
};
exports.configureRoutes = configureRoutes;
