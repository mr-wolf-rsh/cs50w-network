import React, { useState, useContext } from 'react';

import { Link as RouterLink } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import {
    Avatar,
    Button,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
} from '@material-ui/core';

import { AlertContext } from '../../contexts/Alert';

import {
    UserSession,
    checkIfSameUser,
    requests
} from '../utils';

const useProfileListStyles = makeStyles((theme) => ({
    list: {
        width: '100%'
    },
    avatar: {
        background: `linear-gradient(to top left, ${theme.palette.primary.main},
            ${theme.palette.secondary.main}) `
    }
}));

export default function ProfileListItem({ currentProfile }) {
    const currentUser = UserSession.get();
    const classes = useProfileListStyles();
    const { setAlertMessage } = useContext(AlertContext);
    const [profile, setProfile] = useState(currentProfile);

    const handleButtonClick = () => setFollowOrUnfollow();

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

    return (
        <ListItem button
            component={RouterLink}
            to={`/home/profile/${profile.user.username}`}>
            <ListItemAvatar>
                <Avatar className={classes.avatar}>
                    {profile.user.firstName[0] + profile.user.lastName[0]}
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={`${profile.user.firstName} ${profile.user.lastName}`}
                secondary={`@${profile.user.username}`} />
            {
                (!Boolean(currentUser)) ? null :
                    checkIfSameUser(currentUser, profile.user) ? null :
                        <ListItemSecondaryAction>
                            <Button
                                variant={(profile.isFollowing) ? "outlined" : "contained"}
                                color="secondary"
                                onClick={handleButtonClick}
                            >
                                {(profile.isFollowing) ? 'Unfollow' : 'Follow'}
                            </Button>
                        </ListItemSecondaryAction>
            }
        </ListItem>
    );
};