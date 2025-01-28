import React, {
    useState,
    useEffect
} from 'react';

import {
    Link as RouterLink,
    useRouteMatch,
    useLocation
} from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';

import {
    Button,
    Paper,
    Tabs,
    Tab,
    Toolbar,
    Tooltip
} from '@material-ui/core';

import PeopleIcon from '@material-ui/icons/People';


import MenuUser from './MenuUser';
import { UserSession, checkPathValue } from '../utils';

const useSidebarStyles = makeStyles((theme) => ({
    root: {
        height: "100vh",
        flexDirection: 'column',
        padding: 0,
        position: 'fixed'
    },
    tabs: {
        width: 240,
        height: "100%",
        "& .PrivateTabIndicator-vertical-11": {
            width: "2.5px",
            boxShadow: "0px 0px 3px 0px rgba(0,0,0,0.65)"
        },
        "& .MuiTabs-flexContainerVertical": {
            height: "100%",
            justifyContent: 'center'
        },
        "& .Mui-selected": {
            color: theme.palette.secondary.main
        },
        "& a": {
            fontSize: 16,
            fontWeight: 'bold',
            borderRight: '2.5px solid rgba(0, 0, 0, 0.12);',
        }
    },
    title: {
        justifyContent: 'center',
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.secondary.main,
        padding: theme.spacing(3),
        width: "100%",
        fontWeight: 'bold'
    },
    brand: {
        fontWeight: 'bold',
        padding: theme.spacing(3),
        fontSize: 20,
        borderRadius: 0,
        borderWidth: 3,
        background: `radial-gradient(circle, ${theme.palette.primary.main} 0%,
            ${theme.palette.secondary.main} 100%)`
    },
    menuItem: {
        opacity: 'initial !important',
        color: theme.palette.primary.main
    }
}));

export default function Sidebar() {
    const currentUser = UserSession.get();
    const classes = useSidebarStyles();
    const { pathname } = useLocation();
    const { path } = useRouteMatch();
    const [tabValue, setTabValue] = useState(false);

    useEffect(() => {
        const routes = ['all-posts'];
        if (Boolean(currentUser)) {
            routes.push(...[
                'following-posts',
                `profile/${currentUser.username}`
            ]);
        }
        setTabValue(checkPathValue(path, pathname, routes));
        return () => setTabValue(false);
    }, [currentUser, path, pathname]);

    return (
        <Toolbar className={classes.root} component={Paper} square elevation={4}>
            <Tooltip title="Home" placement="right" arrow >
                <Button className={classes.brand} color="secondary"
                    variant="contained" fullWidth startIcon={<PeopleIcon />}
                    onClick={(_event) => setTabValue(false)}
                    component={RouterLink} to={`${path}`}>
                    {'Network'}
                </Button>
            </Tooltip>
            <Tabs
                orientation="vertical"
                value={tabValue}
                onChange={(_event, newTabValue) => setTabValue(newTabValue)}
                className={classes.tabs}
                variant="fullWidth"
                centered
            >
                <Tab component={RouterLink}
                    label="All Posts"
                    to={`${path}/all-posts`}
                    value={`${path}/all-posts`} />
                {
                    (!Boolean(currentUser)) ? null :
                        [
                            <Tab component={RouterLink}
                                label="Following Posts"
                                to={`${path}/following-posts`}
                                value={`${path}/following-posts`} />,
                            <Tab component={RouterLink}
                                label="My Profile"
                                to={`${path}/profile/${currentUser.username}`}
                                value={`${path}/profile/${currentUser.username}`} />
                        ].map((TabInTabs, index) => React.cloneElement(TabInTabs, { key: index }))
                }
            </Tabs>
            <MenuUser classes={classes} />
        </Toolbar>
    );
};