const _ = require('lodash')

const dummy = () => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }
    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const reducer = (favorite, item) => {
        return favorite.likes > item.likes ? favorite : item
    }
    return blogs.reduce(reducer, {})
}

const mostBlogs = (blogs) => {
    // 使用 countBy 函数按作者名计数博客条目
    const authorCounts = _.countBy(blogs, 'author')

    // 使用 maxBy 函数找到拥有最多博客条目的作者
    const topAuthor = _.maxBy(_.keys(authorCounts), (author) => authorCounts[author])

    // 如果 topAuthor 是 undefined（例如当 blogs 数组为空时），则返回 null
    if (!topAuthor) {
        return null
    }

    // 返回拥有最多博客的作者和他们的博客数量
    return {
        author: topAuthor,
        blogs: authorCounts[topAuthor]
    }
}

const mostLikes = (blogs) => {
    // 首先，将博客数组转换成作者和其博客喜欢数的数组
    const authorLikes = _(blogs)
        .groupBy('author') // 按作者分组
        //objs是一个数组，包含每个作者的博客对象,key是作者名
        .map((objs, key) => ({
            'author': key,
            'likes': _.sumBy(objs, 'likes') // 计算每个作者博客喜欢数的总和
        }))
        .value()

    // 然后，找出喜欢数最多的作者对象
    const mostLikedAuthor = _.maxBy(authorLikes, 'likes')

    // 如果没有找到，即博客数组为空，则返回null或者其他你想返回的值
    if (!mostLikedAuthor) {
        return null
    }

    // 返回包含作者和其博客喜欢数总和的对象
    return mostLikedAuthor
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}