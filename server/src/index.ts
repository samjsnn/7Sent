import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2';
import fetchStockData from './services/fetchStockData';

dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

// db connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to db:', err);
    } else {
        console.log('Connected to db');
    }
});

app.get('/', (req, res) => {
    res.send('7Sent API is running');

});

app.get('/api/stocks', async (req, res) => {
    try {
        console.log('Fetching stock data...');
        const symbols = ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'META', 'TSLA'];
        const stockData = await Promise.all(
            symbols.map(async (symbol) => await fetchStockData(symbol))
        );

        //store fetched data in db
        stockData.forEach((stock) => {
            const { symbol, price, timestamp } = stock;
            db.query(
                'INSERT INTO stocks (symbol, price, timestamp)  VALUES (?, ?, ?)', 
                [symbol, price, timestamp],
                (err) => {
                    if (err) {
                        console.error('Error inserting ${symbol}  data:', err);
                    }
                }
            );
        });
        res.json(stockData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stock data'});
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

