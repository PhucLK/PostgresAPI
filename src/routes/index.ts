import express, { NextFunction, Request, Response } from 'express'
import { Article, ArticleStore } from '../models/index'
import jwt from 'jsonwebtoken'

//const store = new ArticleStore()

const index = async (_req: Request, res: Response) => {
    try {
        ArticleStore.index()
    } catch (error) {
        console.log(error);
        
    }
    //const articles = await ArticleStore.index()
    //res.json(articles)
}

const show = async (req: Request, res: Response) => {
    const article = await ArticleStore.show(req.params.id)
    res.json(article)
}

const create = async (req: Request, res: Response) => {
    try {
        const article: Article = {
            id: req.body.id,
            title: req.body.title,
            content: req.body.content,
        }

        const newArticle = await ArticleStore.create(article)
        res.json(newArticle)
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}

const destroy = async (req: Request, res: Response) => {
    const deleted = await ArticleStore.delete(req.body.id)
    res.json(deleted)
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