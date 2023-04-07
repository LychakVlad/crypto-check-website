import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Pagination from './Pagination';
import cn from 'classnames';
import Loading from './Loading';

const List = ({ search, setCurrentPage, currentPage }) => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coinsPerPage] = useState(10);

  const [selectedSort, setSelectedSort] = useState('');

  useEffect(() => {
    const fetchCoins = async () => {
      setLoading(true);
      const res = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&sparkline=false&locale=en`
      );
      setCoins(res.data);
      setLoading(false);
    };

    fetchCoins();
  }, []);

  const sortedCoins = useMemo(() => {
    if (selectedSort) {
      [...coins].sort((a, b) => a[selectedSort].localeCompare(b[selectedSort]));
    }
    return coins;
  }, [selectedSort, coins]);

  console.log(coins);

  const sortedAndSearchedPosts = useMemo(() => {
    return sortedCoins.filter((coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, sortedCoins]);

  const indexOfLastCoin = currentPage * coinsPerPage;
  const indexOfFirstCoin = indexOfLastCoin - coinsPerPage;
  const currentCoin = sortedAndSearchedPosts.slice(
    indexOfFirstCoin,
    indexOfLastCoin
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className=" bg-zinc-800 rounded-xl px-10 max-w-screen-xl mx-auto text-2xl text-neutral-300">
          <div className="grid  grid-cols-6 p-6 max-h-20 text-3xl font-bold  border-b-neutral-300 border-b-4 items-start">
            <p>Logo</p>
            <p>Rank</p>
            <p>Title</p>
            <p>Symbol</p>
            <p>Price</p>
            <p>Change 24h</p>
          </div>
          {currentCoin.map(
            ({
              market_cap_rank,
              name,
              symbol,
              current_price,
              price_change_24h,
              image,
            }) => (
              <div className="flex flex-col" key={market_cap_rank}>
                <div className="grid  grid-cols-6 items-center p-6 max-h-20 border-b-neutral-300 border-b-2">
                  <img
                    src={image}
                    alt="icon"
                    style={{ width: 40 }}
                    className="flex items-center"
                  />
                  <div>{market_cap_rank}</div>
                  <div>{name}</div>
                  <div>{symbol.toUpperCase()}</div>
                  <div>{current_price.toFixed(3)}$</div>
                  <div
                    className={cn('text-green-600', {
                      'text-red-600': price_change_24h < 0,
                    })}
                  >
                    {price_change_24h.toFixed(4)}$
                  </div>
                </div>
              </div>
            )
          )}
          <Pagination
            coinsPerPage={coinsPerPage}
            totalCoins={sortedAndSearchedPosts.length}
            paginate={paginate}
          />
        </div>
      )}
    </>
  );
};

export default List;
