import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import {
    Avatar,
    Container,
    Grid,
    Typography
} from '@material-ui/core';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

const useSignInUpStyles = makeStyles((theme) => ({
    flexContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1.6),
        backgroundColor: theme.palette.secondary.main,
    },
    buttonSubmit: {
        margin: theme.spacing(5, 0, 3),
        padding: theme.spacing(2)
    },
    form: {
        width: '100%'
    },
    fontSize16: {
        fontSize: 16
    }
}));

export default function SignInUp({ title, form, link }) {
    const classes = useSignInUpStyles();

    return (
        <Container component="main" maxWidth="xs"
            style={{ "margin": "auto" }} disableGutters>
            <div className={classes.flexContainer}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {title}
                </Typography>
                {form(classes)}
                <Grid container justify="center">
                    <Grid item align="center" className={classes.fontSize16}>
                        {link}
                    </Grid>
                </Grid>
            </div>
        </Container>
    );
};