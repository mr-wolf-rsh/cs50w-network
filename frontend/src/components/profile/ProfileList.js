import React, {
    useState,
    useEffect,
    useContext
} from 'react';

import { Link as RouterLink, useLocation } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import {
    Container,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography
} from '@material-ui/core';

import {
    Pagination,
    PaginationItem,
    Skeleton
} from '@material-ui/lab';

import { AlertContext } from '../../contexts/Alert';

import ProfileListItem from './ProfileListItem';

import { requests } from '../utils';

const useProfileListStyles = makeStyles((theme) => ({
    list: {
        width: '100%'
    },
    avatar: {
        background: `linear-gradient(to top left, ${theme.palette.primary.main},
            ${theme.palette.secondary.main}) `
    }
}));

export default function ProfileList({ type, username }) {
    const classes = useProfileListStyles();
    const location = useLocation();
    const { setAlertMessage } = useContext(AlertContext);
    const [profileList, setProfileList] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [pageCount, setPageCount] = useState(1);

    const query = new URLSearchParams(location.search);
    const page = parseInt(query.get('page') || '1', 10);

    useEffect(() => {
        getFollowersOrFollowing();
        return () => {
            setPageCount(1);
            setProfileList([]);
            setLoaded(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, type, username]);

    const getFollowersOrFollowing = async () => {
        requests.GET(`/profiles/${username}/${type}?page=${page}`,
            (data) => {
                const { profiles, totalPages } = data;
                setPageCount(totalPages);
                setProfileList(profiles);
                setLoaded(true);
            }, setAlertMessage);
    }

    return (
        <Container component="main" maxWidth="sm" disableGutters>
            <Grid container style={{ height: "100%" }}
                spacing={3} justify="space-evenly" direction="column">
                <Grid item>
                    {
                        (profileList.length > 0) ?
                            <List dense className={classes.list}>
                                {
                                    (profileList.map((profile, i) =>
                                        <ProfileListItem key={i} currentProfile={profile} />
                                    ))
                                }
                            </List> :
                            (loaded) ?
                                <Typography variant="h6" component="h6" align="center">
                                    {
                                        (type === "followers") ?
                                            `${username} doesn't have any followers.` :
                                            `${username} is not following anyone.`
                                    }
                                </Typography> :
                                <List dense className={classes.list}>
                                    {
                                        Array.from({ length: 10 }, (_, i) =>
                                            <ListItem key={i} button>
                                                <ListItemAvatar>
                                                    <Skeleton animation="wave" variant="circle" width={40} height={40} />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Skeleton animation="wave" style={{ marginBottom: 6 }} />
                                                    }
                                                    secondary={
                                                        <Skeleton animation="wave" />
                                                    } />
                                            </ListItem>
                                        )
                                    }
                                </List>
                    }
                </Grid>
                {
                    (!(profileList.length > 0)) ? null :
                        <Grid item style={{ margin: '20px auto' }}>
                            <Pagination
                                count={pageCount} size="large"
                                page={page}
                                renderItem={(item) => (
                                    <PaginationItem
                                        component={RouterLink}
                                        to={`${location.pathname}${item.page === 1 ? '' : `?page=${item.page}`}`}
                                        {...item}
                                    />
                                )}
                                showFirstButton showLastButton
                                color="primary" />
                        </Grid>
                }
            </Grid>
        </Container>
    );
};