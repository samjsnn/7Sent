import React, {useEffect, useState} from 'react';
import axios from 'axios';

interface Stock {
    symbol: string;
    price: number;
    timestamp: string;
}

const StockList: React.FC = () => {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios.get('http://localhost:5001/api/stocks')
        .then((response) => {
            setStocks(response.data);
        })
        .catch((err) => {
            setError('Failed to fetch stock data');
            console.error(err);
        });
    }, []);

    return (
        <div>
            <h1> Mag 7 Stock Prices</h1>
            {error && <p style={{color: 'red' }}>{error}</p>}
            <ul>
                {stocks.map((stock) => (
                    <li key={stock.symbol}>
                        <strong>{stock.symbol}</strong>: ${stock.price.toFixed(2)} at {new Date(stock.timestamp).toLocaleTimeString()}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StockList;