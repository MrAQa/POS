const express = require('express');
const cors = require('cors');

const moment = require('moment');
require('moment-timezone');

const bodyParser = require('body-parser');
const app = express();

const Post = require('./Models/models'); // Import the Mongoose model

// Middleware for parsing JSON data
app.use(bodyParser.json());
app.use(cors());

// Your MongoDB connection code will be added later
require('./db');

// API Endpoint to create a new post
app.post('/api/posts', (req, res) => {
    const { date, totalAmount, Items } = req.body; // Extract date, totalAmount, and Items from req.body

    const newPost = new Post({ createdAt: new Date(), date, totalAmount, Items });
    // Save the new post to the database
    newPost.save()
        .then(savedPost => {
            res.status(201).json(savedPost);
        })
        .catch(error => {
            // Handle the error and send an appropriate response
            console.error('Error saving post:', error);
            res.status(500).json({ error: 'Error creating the post' });
        });
});



app.get('/api/posts', async (req, res) => {

    try {
        // Fetch data from the database collection (replace 'your_collection_name' with your actual collection name)
        const posts = await Post.find();

        // Respond with the posts as JSON
        res.json(posts);

        // Respond with the data as JSON
        // res.json(data);
    } catch (error) {
        console.error('Error fetching data from the database:', error);
        res.status(500).json({ error: 'Error fetching data from the database' });
    }
});


app.get('/api/allposts', async (req, res) => {
    try {
        const { type, date, createdAt } = req.query;
        let posts;
        const filter = {};
        // If the 'type' query parameter is present, filter by type
        if (type) {
            posts = await Post.find({ 'Items.type': type });
        } else {
            posts = await Post.find();
        }
        if (date) {
            filter.date = date;
        }
        if (createdAt) {
            // Convert the createdAt date string to a Date object
            const createdAtDate = new Date(createdAt);
            // Query posts created on the specific createdAt date
            filter.createdAt = {
                $gte: createdAtDate,
                $lt: new Date(createdAtDate.getTime() + 24 * 60 * 60 * 1000) // Next day
            };
        }


        posts = await Post.find(filter);
        // Filter Food items from all posts
        const foodItems = posts.flatMap(post => post.Items.filter(item => item.type === 'Pizza  ' || item.type === 'Deals' || item.type === 'Pasta' || item.type === 'Fries'));

        // Calculate the sum of prices for each item type
        const totalPriceByType = foodItems.reduce((acc, item) => {
            if (!acc[item.type]) {
                acc[item.type] = 0;
            }
            acc[item.type] += item.price * item.quantity;
            return acc;
        }, {});

        // Respond with the posts and the sum of prices for all item types as JSON
        res.json({ totalPriceByType });
    } catch (error) {
        console.error('Error fetching data from the database:', error);
        res.status(500).json({ error: 'Error fetching data from the database' });
    }
});


// Today Data


app.get('/api/todaydata', async (req, res) => {
    try {
        const { type, date } = req.query;
        let posts;

        // Create a filter object to use with the MongoDB query
        const filter = {};

        // If the 'type' query parameter is present, filter by type
        if (type) {
            filter['Items.type'] = type;
        }

        // If the 'date' query parameter is present, filter by date string match
        if (date) {
            // Parse the date string using moment.js to get the start and end of the day
            const startDate = moment(date, 'YYYY-MM-DD').startOf('day').toDate();
            const endDate = moment(date, 'YYYY-MM-DD').endOf('day').toDate();

            // Use $expr and $regex to filter by date string match
            filter.$expr = {
                $and: [
                    {
                        $gte: ['$date', startDate]
                    },
                    {
                        $lte: ['$date', endDate]
                    }
                ]
            };
        }

        // Fetch posts from the database based on the filter
        posts = await Post.find(filter);

        // Filter Food items from all posts
        const foodItems = posts.flatMap(post => post.Items.filter(item => item.type === 'Food' || item.type === 'Juice' || item.type === 'Others' || item.type === 'Chai'));

        // Calculate the sum of prices for each item type
        const totalPriceByType = foodItems.reduce((acc, item) => {
            if (!acc[item.type]) {
                acc[item.type] = 0;
            }
            acc[item.type] += item.price * item.quantity;
            return acc;
        }, {});

        // Respond with the posts and the sum of prices for all item types as JSON
        res.json({ posts, totalPriceByType });
    } catch (error) {
        console.error('Error fetching data from the database:', error);
        res.status(500).json({ error: 'Error fetching data from the database' });
    }
});


app.get('/api/sales', async (req, res) => {
    try {
        // Fetch all posts
        const posts = await Post.find({});

        // Aggregate total sales by item type
        const totalPriceByType = posts.reduce((acc, post) => {
            post.Items.forEach(item => {
                if (item.type === 'Pizza' || item.type === 'Deals' || item.type === 'Pasta' || item.type === 'Fries') {
                    if (!acc[item.type]) acc[item.type] = 0;
                    acc[item.type] += item.price * item.quantity;
                }
            });
            return acc;
        }, {});

        // Respond with the aggregated sales data
        res.json(totalPriceByType);
    } catch (error) {
        console.error('Error fetching sales data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



const port = 8200; // You can use any port number you prefer

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
