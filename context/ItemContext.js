// ItemContext.js
import React, { createContext, useState } from 'react';

export const ItemContext = createContext();

export const ItemProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addItem = (newItem) => {
    setItems((prevItems) => [...prevItems, newItem]);
  };

  const updateItemStatus = (id, status) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, status: status } : item
      )
    );
  };

  return (
    <ItemContext.Provider value={{ items, addItem, updateItemStatus }}>
      {children}
    </ItemContext.Provider>
  );
};