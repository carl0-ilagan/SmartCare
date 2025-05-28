"use client"

import { createContext, useContext, useState } from "react"

const CallContext = createContext({})

export const useCall = () => useContext(CallContext)

export const CallProvider = ({ children }) => {
  const [incomingCall, setIncomingCall] = useState(null)

  const value = {
    incomingCall,
    setIncomingCall,
  }

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>
}
