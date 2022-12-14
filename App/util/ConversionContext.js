import React, { createContext, useEffect, useState } from "react";
import { Alert } from "react-native";

import { api } from "./api";

export const ConversionContext = createContext();

const DEFAULT_BASE_CURRENCY = "USD"
const DEFAULT_QUOTE_CURRENCY = "GBP"

export const ConversionContextProvider = ({ children }) => {
  const [baseCurrency, _setBaseCurrency] = useState(DEFAULT_BASE_CURRENCY);
  const [quoteCurrency, setQuoteCurrency] = useState(DEFAULT_QUOTE_CURRENCY);
  const [date, setDate] = useState();
  const [rates, setRates] = useState({});
  const [isLoading, setIsLoading] = useState(true)

  const setBaseCurrency = currency => {
    setIsLoading(true)
    return api(`/latest?base=${currency}`)
      .then( res => {
        _setBaseCurrency(currency);
        setDate(res.date);
        setRates(res.rates);
      })
      .catch( err => {
        Alert.alert("Sorry smthing went wrong", err.message)
      })
      .finally( () => {
        setIsLoading(false)
      })
  };

  const swapCurrencies = () => {
    setBaseCurrency(quoteCurrency); // мы можем прописать это так без третьеё переменной тк
    setQuoteCurrency(baseCurrency); // тк setState асинхронны
  };

  const contextValue = {
    baseCurrency,
    quoteCurrency,
    setBaseCurrency,
    setQuoteCurrency,
    swapCurrencies,
    date,
    rates,
    isLoading,
  };

  useEffect( () => {
    setBaseCurrency(DEFAULT_BASE_CURRENCY)
  }, [])

  return (
    <ConversionContext.Provider value={contextValue}>
      {children}
    </ConversionContext.Provider>
  );
};
