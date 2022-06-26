import express, { Request, Response } from 'express'
import { Article, ArticleStore } from '../models/index'
import jwt from 'jsonwebtoken'

//const store = new ArticleStore()

const index = async (_req: Request, res: Response) => {
    try {
        const articles = await ArticleStore.index()
        res.json(articles)
    } catch (error: any) {
        res.status(500)
        res.json(error.toString())
    }
}

const show = async (req: Request, res: Response) => {
    try {
        const article = await ArticleStore.show(req.params.id)
        res.json(article)
    } catch (error: any) {
        res.status(500)
        res.json(error.toString())
    }
}

const create = async (req: Request, res: Response) => {
    try {
        console.log(req.body);

        const article: Article = {
            title: req.body.title,
            content: req.body.content
        }

        const newArticle = await ArticleStore.create(article)
        res.json(newArticle)
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}

const destroy = async (req: Request, res: Response) => {
    const id = req.params.id
    const deleted = await ArticleStore.delete(id)
    if (deleted) {
        res.status(200)
        res.json({ 'message': 'Delete record successfully' })
    } else {
        res.status(500)
        res.json({ 'message': 'Can not delete record' })
    }

}

const verifyAuthToken = (req: Request, res: Response, next: Function) => {
    try {
        const authorizationHeader = req.headers.authorization! || ' '
        const token = authorizationHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET!)

        next()
    } catch (error) {
        res.status(401)
    }
}

const articleRoutes = (app: express.Application) => {
    app.get('/articles', index)
    app.get('/articles/:id', show)
    app.post('/articles', create)
    app.delete('/articles/:id', destroy)
}

export default articleRoutes