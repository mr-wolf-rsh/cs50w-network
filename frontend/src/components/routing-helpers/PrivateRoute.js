import React, { useEffect, useContext } from 'react';

import { Route, Redirect } from "react-router-dom";

import { AlertContext } from '../../contexts/Alert';

import { UserSession } from '../utils';

export default function PrivateRoute({ children, ...rest }) {
    const currentUser = UserSession.get();
    const { setAlertMessage } = useContext(AlertContext);

    useEffect(() => {
        if (!Boolean(currentUser)) {
            setAlertMessage({
                message: "You've been redirected to Login!",
                type: "info"
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Route {...rest} render={() => {
            if (Boolean(currentUser)) {
                return children;
            }
            return <Redirect to="/login" />;
        }} />
    );
};