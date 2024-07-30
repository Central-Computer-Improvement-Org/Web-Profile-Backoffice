"use client";

import { createContext, useState } from "react";

export const StateContext = createContext();
export const StateProvider = ({ children }) => {
    const [divisionName, setDivisionName] = useState("");
    const [divisionId, setDivisionId] = useState("");
    const [projectName, setProjectName] = useState("");
    const [projectId, setProjectId] = useState("");
    const [memberName, setMemberName] = useState("");
    const [memberNim, setMemberNim] = useState("");
    const [awardName, setAwardName] = useState("");
    const [awardId, setAwardId] = useState("");
    const [newsName, setNewsName] = useState("");
    const [newsId, setNewsId] = useState("");
    const [eventName, setEventName] = useState("");
    const [eventId, setEventId] = useState("");

    return (
        <StateContext.Provider
            value={{ divisionName, setDivisionName, divisionId, setDivisionId, projectName, setProjectName, projectId, setProjectId, memberName, setMemberName, memberNim, setMemberNim, awardName, setAwardName, awardId, setAwardId, newsName, setNewsName, newsId, setNewsId, eventName, setEventName, eventId, setEventId }}>
            {children}
        </StateContext.Provider>
    )
};