const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const { title, url, author, likes } = request.body

    const user = request.user

    // 检查title和url是否存在
    if (!title || !url) {
        return response.status(400).json({ error: 'title or url missing' })
    }
    const blog = new Blog({
        title: title,
        author: author,
        url: url,
        likes: likes,
        user: user._id
    })

    const savedBlog = await blog.save()
    // Add the saved blog's id to the user's blogs array
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    const user = request.user
    const userid = user._id
    if (blog.user.toString() === userid.toString()) {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } else {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body
    const blog = {
        likes: body.likes
    }
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)
})

blogsRouter.post('/:id/comments', async (request, response) => {
    const { comment } = request.body // 获取评论内容
    if (!comment) {
        return response.status(400).json({ error: 'comment missing' })
    }

    const blog = await Blog.findById(request.params.id) // 根据ID查找博客
    if (blog) {
        blog.comments = blog.comments.concat(comment) // 添加新评论
        const updatedBlog = await blog.save()
        response.status(201).json(updatedBlog)
    } else {
        response.status(404).end()
    }
})

module.exports = blogsRouter

