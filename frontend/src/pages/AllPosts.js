import React, { useState, useContext } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import {
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    TextField,
    Typography
} from '@material-ui/core';

import { useForm } from "react-hook-form";

import { AlertContext } from '../contexts/Alert';

import PostList from '../components/post';

import { UserSession, requests } from '../components/utils';

const useAllPostsStyles = makeStyles({
    textarea: {
        width: "100%",
        fontSize: 16,
        marginBottom: 6
    }
});

export default function AllPosts() {
    const currentUser = UserSession.get();
    const classes = useAllPostsStyles();
    const { setAlertMessage } = useContext(AlertContext);
    const [timecode, setTimecode] = useState('00000000000000');
    const { register, handleSubmit, errors, reset } = useForm({
        defaultValues: {
            content: ''
        }
    });

    const handleSaveButtonClick = postForm => savePost(postForm);

    const savePost = async (postForm) => {
        const { content } = postForm;

        const body = {
            content: content
        };

        requests.POST('/posts', body,
            (data) => {
                const newPost = data.post;
                setTimecode(newPost.timecode);
                reset({ content: '' });
            }, setAlertMessage);
    };

    return (
        <Container component="main" maxWidth="sm" disableGutters>
            <Grid container direction="column" spacing={3}>
                <Grid item>
                    <Typography variant="h4" component="h4" align="center">
                        {'All Posts'}
                    </Typography>
                </Grid>
                {
                    (!Boolean(currentUser)) ? null :
                        <Grid item>
                            <Card elevation={4}>
                                <CardContent>
                                    <form noValidate onSubmit={handleSubmit(handleSaveButtonClick)} method="POST">
                                        <Typography variant="h6" component="h6">
                                            {'Post a new entry here!'}
                                        </Typography>
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
                                            variant="contained" color="secondary">Save</Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </Grid>
                }
                <Grid item>
                    <PostList type={'all'} newTimecode={timecode} />
                </Grid>
            </Grid>
        </Container>
    );
}