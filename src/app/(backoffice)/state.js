"use client";

import { createContext, useState } from "react";

export const StateContext = createContext();

export const StateProvider = ({ children }) => {
    const [divisionId, setDivisionId] = useState("");

    return (
        <StateContext.Provider value={{ divisionId, setDivisionId }}>
            {children}
        </StateContext.Provider>
    );
};