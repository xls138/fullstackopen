const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

beforeAll(async () => {
    await User.deleteMany({})
    const user = {
        username: 'test',
        name: 'test user',
        password: 'password'
    }
    await api
        .post('/api/users')
        .send(user)
        .expect(201)
})

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

describe('when there is initially some blogs saved', () => {

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('blog post has an id property', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body[0].id).toBeDefined()
    })
})

describe('Addition of a new blog', () => {

    test('a valid blog can be added', async () => {
        const loginUser = {
            username: 'test',
            password: 'password'
        }

        const loginResponse = await api
            .post('/api/login')
            .send(loginUser)
            .expect(200)

        const newBlog = {
            title: 'async/await simplifies making async calls',
            author: 'Michael Chan',
            url: 'https://reactpatterns.com/',
            likes: 7
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `bearer ${loginResponse.body.token}`)
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
        const loginUser = {
            username: 'test',
            password: 'password'
        }

        const loginResponse = await api
            .post('/api/login')
            .send(loginUser)
            .expect(200)

        const newBlog = {
            title: 'Default likes to zero',
            author: 'Jane Doe',
            url: 'http://example.com'
            // 注意这里没有likes属性
        }

        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `bearer ${loginResponse.body.token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        expect(response.body.likes).toBeDefined()
        expect(response.body.likes).toBe(0)
    }, 10000)

    test('if the title and url properties are missing, the backend responds with 400 Bad Request', async () => {
        const loginUser = {
            username: 'test',
            password: 'password'
        }

        const loginResponse = await api
            .post('/api/login')
            .send(loginUser)
            .expect(200)

        const newBlog = {
            author: 'John Doe',
            likes: 3
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `bearer ${loginResponse.body.token}`)
            .expect(400)
        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })
})

test('a blog can be deleted', async () => {
    const loginUser = {
        username: 'test',
        password: 'password'
    }

    const loginResponse = await api
        .post('/api/login')
        .send(loginUser)
        .expect(200)

    const newBlog = {
        title: 'async/await simplifies making async calls',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${loginResponse.body.token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[blogsAtStart.length - 1]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `bearer ${loginResponse.body.token}`)
        .expect(204)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).not.toContain(blogToDelete.title)
}, 10000)

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

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('username must be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('creation fails with proper statuscode and message if username is less than 3 characters', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'ro',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('username must be at least 3 characters long')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('creation fails with proper statuscode and message if password is less than 3 characters', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'sa',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('password must be at least 3 characters long')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toEqual(usersAtStart)
    })
})


afterAll(() => {
    mongoose.connection.close()
})