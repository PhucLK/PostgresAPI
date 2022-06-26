import { Request, Response } from 'express'
import { Book, BookStore } from '../models/index'
import jwt from 'jsonwebtoken'

const create = async (req: Request, res: Response) => {
    try {
        const authorizationHeader = req.headers.authorization! || ' '
        const token = authorizationHeader.split(' ')[1]
        jwt.verify(token, process.env.TOKEN_SECRET!)
    } catch (err) {
        res.status(401)
        res.json('Access denied, invalid token')
        return
    }

    try {
        const book: Book = {
            title: req.body.title,
            author: req.body.author,
            totalPages: req.body.total_pages,
            summary: req.body.summary
        }

        const newBook = await BookStore.create(book)
        res.json(newBook)
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}

const destroy = async (req: Request, res: Response) => {
    try {
        const authorizationHeader = req.headers.authorization! || ' '
        const token = authorizationHeader.split(' ')[1]
        jwt.verify(token, process.env.TOKEN_SECRET!)
    } catch (err) {
        res.status(401)
        res.json('Access denied, invalid token')
        return
    }

    try {
        const deleted = await BookStore.delete(req.body.id)
        res.json(deleted)
    } catch (error) {
        res.status(400)
        res.json({ error })
    }
}