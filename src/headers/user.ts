import { Request, Response } from 'express'
import { User, UserStore } from '../models/index'
import jwt from 'jsonwebtoken'

const authenticate = async (req: Request, res: Response) => {
    const user: User = {
        username: req.body.username,
        password: req.body.password,
    }
    try {
        const u = await UserStore.authenticate(user.username, user.password)
        var token = jwt.sign({ user: u }, process.env.TOKEN_SECRET!);
        res.json(token)
    } catch (error) {
        res.status(401)
        res.json({ error })
    }
}

const create = async (req: Request, res: Response) => {
    const user: User = {
        username: req.body.username,
        password: req.body.password,
    }
    try {
        const newUser = await UserStore.create(user)
        var token = jwt.sign({ user: newUser }, process.env.TOKEN_SECRET!);
        res.json(token)
    } catch (err: any) {
        res.status(400)
        res.json({ user, err })
    }
}



const update = async (req: Request, res: Response) => {
    const user: User = {
        username: req.body.username,
        password: req.body.password,
    }
    try {
        const authorizationHeader = req.headers.authorization || ''
        const token = authorizationHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET!)
        if (!decoded) {
            throw new Error('User id does not match!')
        }
    } catch (err: any) {
        res.status(401)
        res.json({ err })
        return
    }

    try {
        const updated = await UserStore.create(user)
        res.json(updated)
    } catch (err: any) {
        res.status(400)
        res.json({ user, err })
    }

}