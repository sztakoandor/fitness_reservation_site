import { Router, Request, Response, NextFunction } from 'express';
import { MainClass } from '../main-class';
import { PassportStatic } from 'passport';
import { User } from '../model/User';
import { Class } from '../model/Class';

export const configureRoutes = (passport: PassportStatic, router: Router): Router => {

    router.get('/', (req: Request, res: Response) => {
        let myClass = new MainClass();
        res.status(200).send('Hello, World!');
    });

    router.get('/callback', (req: Request, res: Response) => {
        let myClass = new MainClass();
        myClass.monitoringCallback((error, result) => {
            if (error) {
                res.write(error);
                res.status(400).end();
            } else {
                res.write(result);
                res.status(200).end();
            }
        });
    });

    router.get('/promise', async (req: Request, res: Response) => {
        let myClass = new MainClass();
        /* myClass.monitoringPromise().then((data: string) => {
            res.write(data);
            res.status(200).end();
        }).catch((error: string) => {
            res.write(error);
            res.status(400).end();
        }); */


        // async-await
        try {
            const data = await myClass.monitoringPromise();
            res.write(data);
            res.status(200).end();
        } catch (error) {
            res.write(error);
            res.status(400).end();
        }
    });


    router.get('/observable', (req: Request, res: Response) => {
        let myClass = new MainClass();
        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        res.setHeader('Transfer-Encoding', 'chunked');

        myClass.monitoringObservable().subscribe({
            next(data: string) {
                res.write(data);
            }, error(error: string) {
                res.status(400).end(error);
            }, complete() {
                res.status(200).end();
            }
        });
    });

    router.post('/login', (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('local', (error: string | null, user: typeof User) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            } else {
                if (!user) {
                    res.status(400).send('User not found.');
                } else {
                    req.login(user, (err: string | null) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send('Internal server error.');
                        } else {
                            res.status(200).send(user);
                        }
                    });
                }
            }
        })(req, res, next);
    });

    router.post('/register', (req: Request, res: Response) => {
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;
        const address = req.body.address;
        const nickname = req.body.nickname;
        const user = new User({ email: email, password: password, name: name, address: address, nickname: nickname, admin: false });
        user.save().then(data => {
            res.status(200).send(data);
        }).catch(error => {
            res.status(500).send(error);
        })
    });

    router.post('/logout', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            req.logout((error) => {
                if (error) {
                    console.log(error);
                    res.status(500).send('Internal server error.');
                }
                res.status(200).send('Successfully logged out.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    router.post('/deleteUser', (req: Request, res: Response) => {
        const email = req.body.email;
        User.deleteOne({email: email}).then(data => {
            res.status(200).send(data);
        }).catch(error => {
            res.status(500).send(error);
        })
    });

    router.get('/getAllUsers', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const query = User.find();
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    router.post('/isAdmin', (req: Request, res: Response) => {
            const email = req.body.email;
            const query = User.findOne({email: email});
            query.then(data => {
                const isAdmin = data?.admin;
                res.status(200).send(isAdmin);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            })
    });

    //subscribe to class
    router.post('/makeAdmin', (req: Request, res: Response) => {
        const email = req.body.email;
        const isAdmin = req.body.isAdmin;
        User.findOne({email : email}).then(data => {
            if (data){
                data.admin = isAdmin;
                data.save().then(() => {
                    res.status(200).send("User admin state changed successfully");
                }).catch(error => {
                    res.status(500).send(error);
                })
            }
        }).catch(error => {
            res.status(500).send(error);
        })
        
    });


    //create class
    router.post('/createClass', (req: Request, res: Response) => {//n st d n n
        const id = req.body.id;
        const participants: string[] = [];
        const start = new Date(req.body.start);
        const duration = req.body.duration;
        const maxPeople = req.body.maxPeople;
        const description = req.body.description;
        const type = req.body.type;
        const difficulty = req.body.difficulty;
        const fitnessclass = new Class({
            id: id, participants: participants, start: start,
            duration: duration, maxPeople: maxPeople, description: description, type: type, difficulty: difficulty
        });
        fitnessclass.save().then(data => {
            res.status(200).send(data);
        }).catch(error => {
            res.status(500).send(error);
        })
    });


    //delete class
    router.post('/deleteClass', (req: Request, res: Response) => {
        const id = req.body.id;
        Class.deleteOne({id: id}).then(data => {
            res.status(200).send(data);
        }).catch(error => {
            res.status(500).send(error);
        })
    });


    //subscribe to class
    router.post('/subscribeToClass', (req: Request, res: Response) => {
        const email = req.body.email;
        const id = req.body.id;
        Class.findOne({id : id}).then(data => {
            data?.participants.push(email);
            data?.save().then(() => {
                res.status(200).send("Subscribed to class successfully");
            }).catch(error => {
                res.status(500).send(error);
            })
        }).catch(error => {
            res.status(500).send(error);
        })
        
    });

    //unsubscribe from class
    router.post('/unsubscribe', (req: Request, res: Response) => {
        const email = req.body.email;
        const id = req.body.id;
        Class.findOne({id : id}).then(data => {

            const index = data?.participants.indexOf(email, 0);
            if (index) {
                if (index > -1){
                    data?.participants.splice(index, 1);
                }
            }      
            data?.save().then(() => {
                res.status(200).send("Unsubscibed successfully");
            }).catch(error => {
                res.status(500).send(error);
            })
        }).catch(error => {
            res.status(500).send(error);
        })
        
    });


    //get all classes
    router.get('/getAllClasses', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const query = Class.find();
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    router.post('/deleteAllClasses', (req: Request, res: Response) => {
            const query = Class.deleteMany();
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send(error);
            })
    });



    router.get('/checkAuth', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            res.status(200).send(true);
        } else {
            res.status(500).send(false);
        }
    });

    return router;
}