// src/context/RecommendationContext.js
import { createContext, useState, useContext } from 'react';

const RecommendationContext = createContext();

export const RecommendationProvider = ({ children }) => {
  const [selectedHouseId, setSelectedHouseId] = useState(null);
  
  return (
    <RecommendationContext.Provider value={{ selectedHouseId, setSelectedHouseId }}>
      {children}
    </RecommendationContext.Provider>
  );
};

export const useRecommendation = () => useContext(RecommendationContext);