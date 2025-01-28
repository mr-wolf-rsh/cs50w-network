import React, { useState, createContext } from 'react';

const AlertContext = createContext();

const AlertContextProvider = ({ children }) => {
    const [alertMessage, setAlertMessage] = useState({ message: '', type: '' });
    const context = {
        alertMessage,
        setAlertMessage: (message) => {
            setAlertMessage({
                message: message.message,
                type: (Boolean(message.type)) ? message.type : 'error'
            });
        }
    };
    return (
        <AlertContext.Provider value={context}>
            {children}
        </AlertContext.Provider>
    );
};

export {
    AlertContext,
    AlertContextProvider
};