import { Book, BookStore } from '../models/index';

//const store = new BookStore()

describe("Book Model", () => {
    it('should have an index method', () => {
        expect(BookStore.index).toBeDefined();
    });

    it('should have a show method', () => {
        expect(BookStore.show).toBeDefined();
    });

    it('should have a create method', () => {
        expect(BookStore.create).toBeDefined();
    });

    it('should have a update method', () => {
        expect(BookStore.update).toBeDefined();
    });

    it('should have a delete method', () => {
        expect(BookStore.delete).toBeDefined();
    });

    it('create method should add a book', async () => {
        
        const result = await BookStore.create({
            title: 'Bridge to Terabithia',
            totalPages: 250,
            author: 'Katherine Paterson',
            summary: 'Childrens'
        });
        expect(result).toEqual({
            title: 'Bridge to Terabithia',
            totalPages: 250,
            author: 'Katherine Paterson',
            summary: 'Childrens'
        });
    });

    it('index method should return a list of books', async () => {
        const result = await BookStore.index();
        expect(result).toEqual([{
            title: 'Bridge to Terabithia',
            totalPages: 250,
            author: 'Katherine Paterson',
            summary: 'Childrens'
        }]);
    });

    it('show method should return the correct book', async () => {
        const result = await BookStore.show("1");
        expect(result).toEqual({
            title: 'Bridge to Terabithia',
            totalPages: 250,
            author: 'Katherine Paterson',
            summary: 'Childrens'
        });
    });

    it('delete method should remove the book', async () => {
        BookStore.delete("1");
        const result = await BookStore.index()

        expect(result).toEqual([]);
    });
});