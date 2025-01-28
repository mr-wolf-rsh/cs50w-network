import React from 'react';

import { useParams } from "react-router-dom";

import {
    Container,
    Grid,
    Typography
} from '@material-ui/core';

import PostList from '../components/post';

export default function FollowingPosts() {
    const { username } = useParams();

    return (
        <Container component="main" maxWidth="sm" disableGutters>
            <Grid container direction="column" spacing={3}>
                <Grid item>
                    <Typography variant="h4" component="h4" align="center">
                        {'Posts from people you are following'}
                    </Typography>
                </Grid>
                <Grid item>
                    <PostList type={'following'} username={username}
                        newTimecode={'00000000000000'} />
                </Grid>
            </Grid>
        </Container>
    );
}