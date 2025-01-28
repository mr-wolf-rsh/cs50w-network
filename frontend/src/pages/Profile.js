import React, { useState, useEffect } from 'react';

import {
    Route,
    Switch,
    Link as RouterLink,
    Redirect,
    useRouteMatch,
    useLocation,
    useParams,
    generatePath
} from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';

import {
    AppBar,
    Container,
    Grid,
    Tab,
    Tabs
} from '@material-ui/core';

import PostList from '../components/post';
import { ProfileList, ProfilePanel } from '../components/profile';
import { NoMatchRedirect } from '../components/routing-helpers';
import { checkPathValue } from '../components/utils';

const useProfileStyles = makeStyles({
    tabpanel: {
        width: "100%",
        height: 'fit-content',
        padding: 15
    }
});

export default function Profile() {
    const classes = useProfileStyles();
    const { pathname } = useLocation();
    const { path } = useRouteMatch();
    const { username } = useParams();
    const [tabValue, setTabValue] = useState(false);

    useEffect(() => {
        const routes = ['posts', 'following', 'followers'];
        setTabValue(checkPathValue(
            generatePath(path, { username }), pathname, routes));
        return () => setTabValue(false);
    }, [username, path, pathname]);

    return (
        <Container component="main" maxWidth="md" disableGutters>
            <Grid container direction="column"
                spacing={3} justify="space-between">
                <Grid item>
                    <ProfilePanel username={username}
                        newTimecode={'00000000000000'} />
                </Grid>
                <Grid item>
                    <AppBar position="static" color="inherit">
                        <Tabs
                            value={tabValue}
                            onChange={(_event, newTabValue) => setTabValue(newTabValue)}
                            variant="fullWidth"
                            indicatorColor="secondary"
                            textColor="secondary"
                        >
                            <Tab component={RouterLink}
                                label="Posts"
                                to={`${generatePath(path, { username })}/posts`}
                                value={`${generatePath(path, { username })}/posts`} />
                            <Tab component={RouterLink}
                                label="Following"
                                to={`${generatePath(path, { username })}/following`}
                                value={`${generatePath(path, { username })}/following`} />
                            <Tab component={RouterLink}
                                label="Followers"
                                to={`${generatePath(path, { username })}/followers`}
                                value={`${generatePath(path, { username })}/followers`} />
                        </Tabs>
                    </AppBar>
                    <div className={classes.tabpanel}>
                        <Switch>
                            <Route exact path={`${path}`}>
                                <Redirect to={`${generatePath(path, { username })}/posts`} />
                            </Route>
                            <Route exact path={`${path}/posts`}>
                                <PostList type={'profile'} username={username} />
                            </Route>
                            <Route exact path={`${path}/following`}>
                                <ProfileList type={'following'} username={username} />
                            </Route>
                            <Route exact path={`${path}/followers`}>
                                <ProfileList type={'followers'} username={username} />
                            </Route>
                            <NoMatchRedirect />
                        </Switch>
                    </div>
                </Grid>
            </Grid>
        </Container>
    );
}