"use client";

import { createContext, useState } from "react";

export const StateContext = createContext();

export const StateProvider = ({ children }) => {
    const [divisionName, setDivisionName] = useState("");
    const [divisionId, setDivisionId] = useState("");

    return (
        <StateContext.Provider value={{ divisionName, setDivisionName, divisionId, setDivisionId }}>
            {children}
        </StateContext.Provider>
    );
};