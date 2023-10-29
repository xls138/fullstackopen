const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

describe('total likes', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
        }
    ]

    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(5)
    })

    const listWithMultipleBlogs = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'First Blog',
            author: 'First Author',
            url: 'http://www.first.com',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f9',
            title: 'Second Blog',
            author: 'Second Author',
            url: 'http://www.second.com',
            likes: 10,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f0',
            title: 'Third Blog',
            author: 'Third Author',
            url: 'http://www.third.com',
            likes: 15,
            __v: 0
        }
    ]

    test('when list has multiple blogs, equals the likes of all', () => {
        const result = listHelper.totalLikes(listWithMultipleBlogs)
        expect(result).toBe(30)
    })
})

describe('favorite blog', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'First Blog',
            author: 'First Author',
            url: 'http://www.first.com',
            likes: 5,
            __v: 0
        }
    ]

    test('when list has only one blog, equals the blog itself', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        expect(result).toEqual(listWithOneBlog[0])
    })

    const listWithMultipleBlogs = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'First Blog',
            author: 'First Author',
            url: 'http://www.first.com',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f9',
            title: 'Second Blog',
            author: 'Second Author',
            url: 'http://www.second.com',
            likes: 10,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f0',
            title: 'Third Blog',
            author: 'Third Author',
            url: 'http://www.third.com',
            likes: 15,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f1',
            title: 'Fourth Blog',
            author: 'Fourth Author',
            url: 'http://www.fourth.com',
            likes: 5,
            __v: 0
        }
    ]

    test('when list has multiple blogs, equals the blog with most likes', () => {
        const result = listHelper.favoriteBlog(listWithMultipleBlogs)
        expect(result).toEqual(listWithMultipleBlogs[2])
    })

    const listWithNoBlogs = []

    test('when list has no blogs, equals an empty object', () => {
        const result = listHelper.favoriteBlog(listWithNoBlogs)
        expect(result).toEqual({})
    })
})

describe('mostBlogs', () => {
    test('returns the author with the most blogs', () => {
        const blogs = [
            { author: 'Alice', title: 'Alice Blog 1' },
            { author: 'Bob', title: 'Bob Blog 1' },
            { author: 'Alice', title: 'Alice Blog 2' },
            { author: 'Charlie', title: 'Charlie Blog 1' },
            { author: 'Bob', title: 'Bob Blog 2' },
            { author: 'Bob', title: 'Bob Blog 3' },
        ]

        const result = listHelper.mostBlogs(blogs)
        expect(result).toEqual({
            author: 'Bob',
            blogs: 3
        })
    })

    test('returns null for an empty array', () => {
        const blogs = []

        const result = listHelper.mostBlogs(blogs)
        expect(result).toBeNull()
    })

    test('if multiple authors have the same number of blogs, returns one of them', () => {
        const blogs = [
            { author: 'Alice', title: 'Alice Blog 1' },
            { author: 'Bob', title: 'Bob Blog 1' },
        ]

        const result = listHelper.mostBlogs(blogs)
        expect(result).toHaveProperty('author')
        expect(result.blogs).toBe(1)
    })
})


describe('mostLikes', () => {
    test('finds the author with the most likes', () => {
        const blogs = [
            { author: 'Alice', likes: 5 },
            { author: 'Bob', likes: 15 },
            { author: 'Alice', likes: 25 },
            { author: 'Charlie', likes: 8 },
        ]

        const result = listHelper.mostLikes(blogs)
        expect(result).toEqual({
            author: 'Alice',
            likes: 30 // Alice 总共有30个喜欢
        })
    })

    test('returns null for empty array', () => {
        const blogs = []

        const result = listHelper.mostLikes(blogs)
        expect(result).toBeNull()
    })

    test('if two authors have the same likes, returns the first one', () => {
        const blogs = [
            { author: 'Alice', likes: 20 },
            { author: 'Bob', likes: 20 },
        ]

        const result = listHelper.mostLikes(blogs)
        expect(result).toEqual({
            author: 'Alice',
            likes: 20
        })
    })
})


