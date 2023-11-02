const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('blog post has an id property', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})


test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'async/await simplifies making async calls',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(n => n.title)
    expect(titles).toContain(
        'async/await simplifies making async calls'
    )
})

test('if the likes property is missing, it will default to 0', async () => {
    const newBlog = {
        title: 'Default likes to zero',
        author: 'Jane Doe',
        url: 'http://example.com'
        // 注意这里没有likes属性
    }

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toBeDefined()
    expect(response.body.likes).toBe(0)
})

test('if the title and url properties are missing, the backend responds with 400 Bad Request', async () => {
    const newBlog = {
        author: 'John Doe',
        likes: 3
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).not.toContain(blogToDelete.title)
})

test('a blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const newBlog = {
        likes: 999
    }
    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(newBlog)
        .expect(200)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd[0].likes).toBe(999)
})


afterAll(() => {
    mongoose.connection.close()
})