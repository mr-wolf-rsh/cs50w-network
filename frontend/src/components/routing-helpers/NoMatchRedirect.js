import React from 'react';

import { Route, Redirect } from "react-router-dom";

export default function NoMatchRedirect({ ...rest }) {
    return (
        <Route path="*" {...rest}
            render={({ location }) => {
                return <Redirect to={{
                    pathname: "/notfound",
                    state: { referrer: location.pathname }
                }} />;
            }} />
    );
};