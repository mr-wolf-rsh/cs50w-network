import React, { useState, useContext } from 'react';

import { Link as RouterLink } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';

import {
    Avatar,
    Badge,
    Button,
    Card,
    CardHeader,
    CardContent,
    Grid,
    IconButton,
    Link,
    TextField,
    Tooltip,
    Typography
} from '@material-ui/core';

import {
    Clear,
    Delete,
    Edit,
    StarBorderRounded,
    StarHalfRounded,
    StarRounded
} from '@material-ui/icons';

import { useForm } from "react-hook-form";

import { AlertContext } from '../../contexts/Alert';

import {
    UserSession,
    checkIfSameUser,
    requests
} from '../utils';

const usePostStyles = makeStyles((theme) => ({
    root: {
        margin: "auto",
        transition: '0.2s',
        '&:hover': {
            transform: 'scale(1.01)',
            boxShadow: `0 2px 4px 0 ${theme.palette.primary.main}`
        }
    },
    avatar: {
        background: `linear-gradient(to bottom right, ${theme.palette.primary.main},
            ${theme.palette.secondary.main}) `
    },
    deleteIcon: {
        color: theme.palette.error.main
    },
    editIcon: {
        color: theme.palette.info.light
    },
    likeIcon: {
        color: theme.palette.secondary.main
    },
    textarea: {
        width: "100%",
        fontSize: 16,
        marginBottom: 6
    }
}));

export default function Post({ currentPost }) {
    const currentUser = UserSession.get();
    const classes = usePostStyles();
    const { setAlertMessage } = useContext(AlertContext);
    const [post, setPost] = useState(currentPost);
    const [editMode, setEditMode] = useState(false);
    const { register, handleSubmit, errors, reset } = useForm({
        defaultValues: {
            content: post.content
        }
    });

    const handleLikeIconClick = () => updatePost('like', !post.liked);

    const handleSaveButtonClick = postForm => {
        updatePost('content', postForm.content)
        reset({ content: '' });
    };

    const updatePost = (type, value) => {
        const body = {
            timecode: post.timecode,
            username: post.user.username,
            type: type,
            value: value
        };

        requests.PUT('/posts', body,
            (data) => {
                const newPost = data.post;
                setEditMode(false);
                setPost(newPost);
            }, setAlertMessage);
    };

    return (
        <Card className={classes.root} elevation={4}>
            <CardHeader
                avatar={
                    <Avatar className={classes.avatar}>
                        {post.user.firstName[0] + post.user.lastName[0]}
                    </Avatar>
                }
                action={
                    (!Boolean(currentUser)) ?
                        <Tooltip title="Sign in to like this post!" placement="right" arrow >
                            <StarHalfRounded className={classes.likeIcon} />
                        </Tooltip> :
                        <React.Fragment>
                            <Tooltip title="Like!" placement="left" arrow >
                                <IconButton onClick={handleLikeIconClick}>
                                    <Badge badgeContent={post.totalLikes}
                                        color="primary" max={999}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                        }}
                                    >
                                        {
                                            (post.liked) ?
                                                <StarRounded className={classes.likeIcon} /> :
                                                <StarBorderRounded className={classes.likeIcon} />
                                        }
                                    </Badge>
                                </IconButton>
                            </Tooltip>
                            {
                                (!checkIfSameUser(currentUser, post.user)) ? null :
                                    [
                                        <Tooltip title={(editMode) ? "Cancel" : "Edit"} placement="bottom" arrow >
                                            <IconButton onClick={() => setEditMode(!editMode)}>
                                                {
                                                    (editMode) ?
                                                        <Clear className={classes.editIcon} /> :
                                                        <Edit className={classes.editIcon} />
                                                }
                                            </IconButton>
                                        </Tooltip>,
                                        <Tooltip title="Delete" placement="right" arrow >
                                            <IconButton>
                                                <Delete className={classes.deleteIcon} />
                                            </IconButton>
                                        </Tooltip>
                                    ].map((ActionsInCard, index) => React.cloneElement(ActionsInCard, { key: index }))
                            }
                        </React.Fragment>
                }
                title={
                    <Typography variant="h6" component="h6">
                        {`${post.user.firstName} ${post.user.lastName}`}
                    </Typography>
                }
                subheader={
                    <Typography variant="body1" color="textSecondary" component="div">
                        <Grid container spacing={1}>
                            <Grid item>
                                <Link color="inherit" component={RouterLink} to={`/home/profile/${post.user.username}`}>
                                    {`@${post.user.username}`}
                                </Link>
                            </Grid>
                            <Grid item>
                                {'·'}
                            </Grid>
                            <Grid item>
                                {post.createdAt}
                            </Grid>
                        </Grid>
                    </Typography>
                }
            />
            <CardContent>
                {
                    (editMode) ?
                        <React.Fragment>
                            <form noValidate onSubmit={handleSubmit(handleSaveButtonClick)} method="POST">
                                <TextField className={classes.textarea} helperText={'Max characters: 200'}
                                    multiline inputProps={{ maxLength: 200 }} rows={3}
                                    inputRef={register({
                                        required: {
                                            value: true,
                                            message: "Content is required."
                                        },
                                        maxLength: {
                                            value: 200,
                                            message: "Must not exceed 200 characters."
                                        }
                                    })}
                                    error={Boolean(errors.content)}
                                    variant="outlined" name="content" />
                                <Button style={{ fontSize: 16 }}
                                    fullWidth type="submit"
                                    variant="contained" color="primary">Save</Button>
                            </form>
                        </React.Fragment> :
                        <Typography variant="body1" component="p">{post.content}</Typography>
                }
            </CardContent>
        </Card>
    );
};