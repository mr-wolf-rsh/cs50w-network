import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import {
    Container,
    Grid,
    Paper,
    Typography
} from '@material-ui/core';

import { joinClassNames } from '../components/utils'

const useWelcomeStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.grey[800],
        backgroundImage: 'url(https://source.unsplash.com/random)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: '100%',
        height: '100%',
        padding: 10,
        "& .MuiGrid-container": {
            height: '100%'
        }
    },
    typography: {
        WebkitTextStroke: "1px white",
        color: theme.palette.primary.main,
        textAlign: 'center'
    },
    fontTitle: {
        fontSize: '6em'
    },
    fontSubtitle: {
        fontSize: '4em'
    }
}));

export default function Welcome() {
    const classes = useWelcomeStyles();

    return (
        <Container component="main" disableGutters style={{ height: '100%' }}>
            <Paper className={classes.root} elevation={4}
                style={{ backgroundImage: "https://picsum.photos/1266/692.jpg?blur=3" }}>
                <Grid container
                    direction="column" justify="space-around">
                    <Grid item>
                        <Typography className={joinClassNames(classes.typography,
                            classes.fontTitle)} component="h2" variant="h2">
                            {'Welcome to Network!'}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography className={joinClassNames(classes.typography,
                            classes.fontSubtitle)} component="h3" variant="h3">
                            {'This is the place where you can connect to people and interact with them'}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}