import React from "react";

import { Link as RouterLink, useLocation } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';

import { Grid, Link } from '@material-ui/core';

const useNoMatchStyles = makeStyles({
    root: {
        margin: 20,
        width: "100%"
    },
});

export default function NoMatch() {
    const classes = useNoMatchStyles();
    const location = useLocation();

    return (
        <div className={classes.root}>
            <h3>
                <Grid container spacing={2}>
                    <Grid item>
                        No match for <code>{location.state?.referrer || "/notfound"}</code>
                    </Grid>
                    <Grid item>
                        {'-'}
                    </Grid>
                    <Grid item>
                        <Link component={RouterLink} to="/home">
                            {"Return to Home!"}
                        </Link>
                    </Grid>
                </Grid>
            </h3>
        </div>
    );
};