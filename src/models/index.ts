// @ts-ignore
import client from '../database/index'
import bcrypt from 'bcrypt'

type Book = {
  title: string;
  author: string;
  totalPages: number;
  summary: string;
}

type Article = {
  title: string;
  content: string;
}
type User = {
  username: string;
  password: string;
}

class BookStore {

  static async index(): Promise<Book[]> {
    try {
      // @ts-ignore
      const conn = await client.connect()
      const sql = 'SELECT * FROM books'

      const result = await conn.query(sql)

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not get books. Error: ${err}`)
    }
  }

  static async show(id: string): Promise<Book> {
    try {
      const sql = 'SELECT * FROM books WHERE id=($1)'
      // @ts-ignore
      const conn = await client.connect()

      const result = await conn.query(sql, [id])

      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not find book ${id}. Error: ${err}`)
    }
  }

  static async create(b: Book): Promise<Book> {
    try {
      const sql = 'INSERT INTO books (title, author, total_pages, summary) VALUES($1, $2, $3, $4) RETURNING *'
      // @ts-ignore
      const conn = await client.connect()

      const result = await conn
        .query(sql, [b.title, b.author, b.totalPages, b.summary])

      const book = result.rows[0]

      conn.release()

      return book
    } catch (err) {
      throw new Error(`Could not add new book ${b.title}. Error: ${err}`)
    }
  }

  static async update(b: Book, id: string): Promise<Book> {
    try {
      const sql = 'UPDATE books set title=$1, author=$2, total_pages=$3, summary=$4 RETURNING *'
      // @ts-ignore
      const conn = await client.connect()

      const result = await conn.query(sql, [b.title, b.author, b.totalPages, b.summary])
      const book = result.rows[0]

      conn.release()

      return book
    } catch (err) {
      throw new Error(`Could not add new book ${b.title}. Error: ${err}`)
    }
  }

  static async delete(id: string): Promise<Book> {
    try {
      const sql = 'DELETE FROM books WHERE id=($1)'
      // @ts-ignore
      const conn = await client.connect()

      const result = await conn.query(sql, [id])

      const book = result.rows[0]

      conn.release()

      return book
    } catch (err) {
      throw new Error(`Could not delete book ${id}. Error: ${err}`)
    }
  }
}

class ArticleStore {
  static async index(): Promise<Article[]> {
    try {
      // @ts-ignore
      const conn = await client.connect()
      const sql = 'SELECT * FROM articles'

      const result = await conn.query(sql)

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not get articles. Error: ${err}`)
    }
  }

  static async show(id: string): Promise<Article> {
    try {
      const sql = 'SELECT * FROM articles WHERE id=($1)'
      // @ts-ignore
      const conn = await client.connect()

      const result = await conn.query(sql, [id])

      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not find article ${id}. Error: ${err}`)
    }
  }

  static async create(b: Article): Promise<Article> {
    try {
      const sql = 'INSERT INTO articles (title, content) VALUES($1, $2) RETURNING *'
      // @ts-ignore
      const conn = await client.connect()

      const result = await conn
        .query(sql, [b.title, b.content])

      const book = result.rows[0]

      conn.release()

      return book
    } catch (err) {
      throw new Error(`Could not add new article ${b.title}. Error: ${err}`)
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      const sql = 'DELETE FROM articles WHERE id=($1)'
      // @ts-ignore
      const conn = await client.connect()

      const result = await conn.query(sql, [id])
      console.log(result);

      conn.release()
      if (result.rowCount === 1) {
        return true
      }
      return false;

    } catch (err) {
      return false;
      //throw new Error(`Could not delete article ${id}. Error: ${err}`)
    }
  }
}


const pepper = 'sfdsdf'
const saltRounds = 'sdft3'

class UserStore {
  // static authenticate(username: string, password: string) {
  //     throw new Error('Method not implemented.');
  // }
  static async create(u: User): Promise<User> {
    try {
      // @ts-ignore
      const conn = await client.connect()
      const sql = 'INSERT INTO users (username, password_digest) VALUES($1, $2) RETURNING *'

      const hash = bcrypt.hashSync(
        u.password + pepper,
        parseInt(saltRounds)
      );

      const result = await conn.query(sql, [u.username, hash])
      const user = result.rows[0]

      conn.release()

      return user
    } catch (err) {
      throw new Error(`unable create user (${u.username}): ${err}`)
    }
  }
  static async authenticate(username: string, password: string): Promise<User | null> {
    // @ts-ignore
    const conn = await client.connect()
    const sql = 'SELECT password_digest FROM users WHERE username=($1)'

    const result = await conn.query(sql, [username])

    console.log(password + pepper)

    if (result.rows.length) {

      const user = result.rows[0]

      console.log(user)

      if (bcrypt.compareSync(password + pepper, user.password_digest)) {
        return user
      }
    }

    return null
  }
}

export { Book, BookStore, Article, ArticleStore, User, UserStore }