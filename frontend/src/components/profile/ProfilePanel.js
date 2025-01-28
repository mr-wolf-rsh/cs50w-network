import React, {
    useState,
    useEffect,
    useContext
} from 'react';

import { Link as RouterLink } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';

import {
    Avatar,
    Button,
    Card,
    CardContent,
    Grid,
    Link,
    Typography
} from '@material-ui/core';

import Skeleton from '@material-ui/lab/Skeleton';

import EventNoteIcon from '@material-ui/icons/EventNote';

import { AlertContext } from '../../contexts/Alert';

import {
    UserSession,
    joinClassNames,
    checkIfSameUser,
    requests
} from '../utils';

const useProfileHeaderStyles = makeStyles((theme) => ({
    avatarSize: {
        width: theme.spacing(20),
        height: theme.spacing(20),
        margin: 'auto'
    },
    avatarStyle: {
        fontSize: 36,
        background: `linear-gradient(to bottom right, ${theme.palette.primary.main},
            ${theme.palette.secondary.main})`
    }
}));

export default function ProfilePanel({ username }) {
    const currentUser = UserSession.get();
    const classes = useProfileHeaderStyles();
    const { setAlertMessage } = useContext(AlertContext);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        getProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [username]);

    const handleButtonClick = () => setFollowOrUnfollow();

    const getProfile = async () => {
        requests.GET(`/profiles/${username}`,
            (data) => {
                const newProfile = data.profile;
                setProfile(newProfile);
            }, setAlertMessage);
    }

    const setFollowOrUnfollow = async () => {
        const body = {
            type: profile.isFollowing ? 'unfollow' : 'follow'
        };

        requests.PUT(`/profiles/${profile.user.username}`, body,
            (data) => {
                const newProfile = data.profile;
                setProfile(newProfile);
            }, setAlertMessage);
    }

    let avatar, content;

    if (!Boolean(profile)) {
        avatar = <Skeleton animation="wave" variant="circle" className={classes.avatarSize} />;
        content =
            <React.Fragment>
                <Grid item align="center">
                    <Skeleton animation="wave" height={20} width="50%" style={{ marginBottom: 6 }} />
                    <Skeleton animation="wave" height={20} width="50%" />
                </Grid>
                <Grid item>
                    <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                    <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                    <Skeleton animation="wave" height={10} />
                </Grid>
            </React.Fragment>;
    } else {
        avatar =
            <Avatar className={joinClassNames(classes.avatarSize, classes.avatarStyle)}>
                {profile.user.firstName[0] + profile.user.lastName[0]}
            </Avatar>;
        content =
            <React.Fragment>
                <Grid item>
                    <Typography variant="h4" component="h4" align="center">
                        {`${profile.user.firstName} ${profile.user.lastName}`}
                    </Typography>
                    <Typography variant="h6" component="h6" color="textSecondary" align="center">
                        <Link color="inherit" component={RouterLink} to={`/home/profile/${profile.user.username}`}>
                            {`@${profile.user.username}`}
                        </Link>
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="body1" component="div">
                        <Grid container spacing={1} justify="center">
                            <Grid item>
                                <EventNoteIcon />
                            </Grid>
                            <Grid item>
                                {`Joined on ${profile.user.dateJoined}`}
                            </Grid>
                        </Grid>
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="body1" component="div">
                        <Grid container spacing={1} justify="space-around">
                            <Grid item>
                                <strong>{`${profile.totalPosts}`}</strong>
                                {' posts'}
                            </Grid>
                            <Grid item>
                                <strong>{`${profile.totalFollowing}`}</strong>
                                {' following'}
                            </Grid>
                            <Grid item>
                                <strong>{`${profile.totalFollowers}`}</strong>
                                {' followers'}
                            </Grid>
                        </Grid>
                    </Typography>
                </Grid>
                {
                    (!Boolean(currentUser)) ? null :
                        checkIfSameUser(currentUser, profile.user) ? null :
                            <Grid item>
                                <Button
                                    variant={(profile.isFollowing) ? "outlined" : "contained"}
                                    color="secondary"
                                    fullWidth
                                    style={{ fontSize: 16 }}
                                    onClick={handleButtonClick}
                                >
                                    {(profile.isFollowing) ? 'Unfollow' : 'Follow'}
                                </Button>
                            </Grid>
                }
            </React.Fragment>;
    }

    return (
        <Card className={classes.borderProfile} elevation={4}>
            <CardContent>
                <Grid container>
                    <Grid item container sm={2}>
                        {avatar}
                    </Grid>
                    <Grid item sm={10}
                        container spacing={2}
                        direction="column" justify="space-around"
                        style={{ padding: '0 5% ' }}>
                        {content}
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};