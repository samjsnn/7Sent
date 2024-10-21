import axios from 'axios';

const fetchStockData = async (symbol: string) => {
  try {
    const response = await axios.get(`https://www.alphavantage.co/query`, {
      params: {
        function: 'TIME_SERIES_INTRADAY',
        symbol,
        interval: '5min',
        apikey: process.env.STOCK_API_KEY,
      },
    });

    const data = response.data['Time Series (5min)'];
    if (data) {
      const latestTimestamp = Object.keys(data)[0];
      const latestData = data[latestTimestamp];
      return {
        symbol,
        price: parseFloat(latestData['4. close']),
        timestamp: latestTimestamp,
      };
    } else {
      throw new Error('No data found');
    }
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error);
    throw error;
  }
};

export default fetchStockData;
