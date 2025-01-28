import React, {
    useState,
    useEffect,
    useContext
} from 'react';

import { Link as RouterLink, useLocation } from 'react-router-dom';

import {
    Card,
    CardHeader,
    CardContent,
    Container,
    Grid,
    Typography
} from '@material-ui/core';

import {
    Pagination,
    PaginationItem,
    Skeleton
} from '@material-ui/lab';

import { AlertContext } from '../../contexts/Alert';

import Post from './Post';
import { requests } from '../utils';

export default function PostList({ type, username, newTimecode }) {
    const location = useLocation();
    const { setAlertMessage } = useContext(AlertContext);
    const [postList, setPostList] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [pageCount, setPageCount] = useState(1);

    const query = new URLSearchParams(location.search);
    const page = parseInt(query.get('page') || '1', 10);

    useEffect(() => {
        getPosts();
        return () => {
            setPageCount(1);
            setPostList([]);
            setLoaded(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newTimecode, page, type]);

    const getPosts = async () => {
        const withUsername = type !== "profile" ? '' :
            ('&username=' + username)
        requests.GET(`/posts/${type}?page=${page}${withUsername}`,
            (data) => {
                const { posts, totalPages } = data;
                setPageCount(totalPages);
                setPostList(posts);
                setLoaded(true);
            }, setAlertMessage);
    }

    return (
        <Container component="main" maxWidth="sm" disableGutters>
            <Grid container style={{ height: "100%" }}
                spacing={3} justify="space-evenly" direction="column">
                {
                    (postList.length > 0) ?
                        (postList.map((post, i) =>
                            <Grid item key={i}>
                                <Post currentPost={post} />
                            </Grid>
                        )) :
                        (loaded) ?
                            <Grid item>
                                <Typography variant="h6" component="h6" align="center">
                                    {'There are no posts available.'}
                                </Typography>
                            </Grid> :
                            Array.from({ length: 10 }, (_, i) =>
                                <Grid item key={i}>
                                    <Card>
                                        <CardHeader
                                            avatar={
                                                <Skeleton animation="wave" variant="circle" width={40} height={40} />
                                            }
                                            title={
                                                <Skeleton animation="wave" height={20} width="50%" style={{ marginBottom: 6 }} />
                                            }
                                            subheader={
                                                <Skeleton animation="wave" height={20} width="50%" />
                                            }
                                        />
                                        <CardContent>
                                            <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                                            <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                                            <Skeleton animation="wave" height={10} />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )
                }
                {
                    (!(postList.length > 0)) ? null :
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
                                color="primary" disabled={!(postList.length > 0)} />
                        </Grid>
                }
            </Grid>
        </Container>
    );
};