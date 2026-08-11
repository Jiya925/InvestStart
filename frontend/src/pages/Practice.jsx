import { useEffect, useMemo, useState } from "react";

const STARTING_CASH = 10000;

const ASSETS = ["SPY", "QQQ", "VTI", "VXUS", "BND"];

function Practice() {
  const [prices, setPrices] = useState({});
  const [cash, setCash] = useState(STARTING_CASH);

  const [holdings, setHoldings] = useState({
    SPY: {
      shares: 0,
      cost: 0,
    },
    QQQ: {
      shares: 0,
      cost: 0,
    },
    VTI: {
      shares: 0,
      cost: 0,
    },
    VXUS: {
      shares: 0,
      cost: 0,
    },
    BND: {
      shares: 0,
      cost: 0,
    },
  });

  const [selectedTicker, setSelectedTicker] = useState("SPY");
  const [shares, setShares] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchPrices() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/practice/prices"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch prices");
      }

      const data = await response.json();

      setPrices(data);
    } catch (error) {
      console.error(error);

      setError(
        "Unable to load current market prices."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
  fetchPrices();

  const interval = setInterval(() => {
    fetchPrices();
  }, 30000);

  return () => {
    clearInterval(interval);
  };
}, []);

  const portfolioValue = useMemo(() => {
    return ASSETS.reduce((total, ticker) => {
      const price = prices[ticker]?.price || 0;
      const quantity = holdings[ticker]?.shares || 0;

      return total + price * quantity;
    }, 0);
  }, [prices, holdings]);

  const totalValue = cash + portfolioValue;

  const profitLoss = totalValue - STARTING_CASH;

  function buyStock() {
    const price = prices[selectedTicker]?.price;

    if (!price || Number(shares) <= 0) {
      return;
    }

    const cost = price * Number(shares);

    if (cost > cash) {
      setError(
        "You don't have enough cash for this purchase."
      );
      return;
    }

    setCash((currentCash) =>
      currentCash - cost
    );

    setHoldings((currentHoldings) => ({
      ...currentHoldings,

      [selectedTicker]: {
        shares:
          currentHoldings[selectedTicker].shares +
          Number(shares),

        cost:
          currentHoldings[selectedTicker].cost +
          cost,
      },
    }));

    setError(null);
  }

  function sellStock() {
    const quantityOwned =
      holdings[selectedTicker].shares;

    if (Number(shares) <= 0) {
      return;
    }

    if (Number(shares) > quantityOwned) {
      setError(
        `You only own ${quantityOwned} shares of ${selectedTicker}.`
      );
      return;
    }

    const price =
      prices[selectedTicker]?.price;

    const proceeds =
      price * Number(shares);

    setCash((currentCash) =>
      currentCash + proceeds
    );

    setHoldings((currentHoldings) => {

      const currentHolding =
        currentHoldings[selectedTicker];

      const remainingShares =
        currentHolding.shares -
        Number(shares);

      if (remainingShares === 0) {
        return {
          ...currentHoldings,

          [selectedTicker]: {
            shares: 0,
            cost: 0,
          },
        };
      }

      const averageCost =
        currentHolding.cost /
        currentHolding.shares;

      const remainingCost =
        averageCost *
        remainingShares;

      return {
        ...currentHoldings,

        [selectedTicker]: {
          shares: remainingShares,
          cost: remainingCost,
        },
      };
    });

    setError(null);
  }

  return (
    <div className="practice-page">

      <h1>Practice</h1>

      <p className="page-description">
        Practice investing with $10,000 of virtual money.
        Buy and sell investments without risking real money.
      </p>

      {loading && (
        <p>Loading current market prices...</p>
      )}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {!loading && (
        <>

          <div className="practice-summary">

            <div>
              <span>Total Portfolio Value</span>

              <strong>
                ${totalValue.toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </strong>
            </div>

            <div>
              <span>Cash Available</span>

              <strong>
                ${cash.toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </strong>
            </div>

            <div>
              <span>Invested</span>

              <strong>
                ${portfolioValue.toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </strong>
            </div>

            <div>
              <span>Profit / Loss</span>

              <strong>
                {profitLoss >= 0 ? "+" : ""}
                ${profitLoss.toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </strong>
            </div>

          </div>


          <div className="practice-trade-card">

            <h2>Trade</h2>

            <label>
              Investment

              <select
                value={selectedTicker}
                onChange={(e) =>
                  setSelectedTicker(e.target.value)
                }
              >

                {ASSETS.map((ticker) => (
                  <option
                    key={ticker}
                    value={ticker}
                  >
                    {ticker}
                  </option>
                ))}

              </select>

            </label>


            <div className="current-price">

              <span>
                Current Price
              </span>

              <strong>
                $
                {prices[selectedTicker]?.price?.toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </strong>

            </div>


            <label>
              Shares

              <input
                type="number"
                min="1"
                step="1"
                value={shares}
                onChange={(e) =>
                  setShares(e.target.value)
                }
              />

            </label>


            <div className="trade-buttons">

              <button onClick={buyStock}>
                Buy
              </button>

              <button onClick={sellStock}>
                Sell
              </button>

            </div>


            <button
              className="refresh-button"
              onClick={fetchPrices}
            >
              Refresh Prices
            </button>

          </div>


          <div className="holdings-card">

            <h2>Your Holdings</h2>

            {ASSETS.map((ticker) => {
              const quantity = holdings[ticker].shares;
              const cost = holdings[ticker].cost;
              const price = prices[ticker]?.price || 0;

              const value = quantity * price;

              const averageCost =
                quantity > 0 ? cost / quantity : 0;

              const gain = value - cost;

              const returnPercent =
                cost > 0 ? (gain / cost) * 100 : 0;

              return (
                <div
                  className="holding-item"
                  key={ticker}
                >
                  <div>
                    <strong>{ticker}</strong>

                    <span>
                      {quantity} shares
                    </span>
                  </div>

                  <div className="holding-details">
                    <span>
                      Avg. Cost: $
                      {averageCost.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>

                    <span>
                      Current: $
                      {price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>

                    <span>
                      {gain >= 0 ? "+" : ""}
                      ${gain.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      {" "}
                      ({returnPercent >= 0 ? "+" : ""}
                      {returnPercent.toFixed(2)}%)
                    </span>
                  </div>

                  <strong>
                    ${value.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </strong>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default Practice;