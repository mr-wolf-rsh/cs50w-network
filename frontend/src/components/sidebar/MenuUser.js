import React, { useState, useContext } from 'react';

import { Link as RouterLink, useHistory } from "react-router-dom";

import {
    Button,
    Divider,
    Menu,
    MenuItem,
    Tooltip
} from '@material-ui/core';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { AlertContext } from '../../contexts/Alert';

import { UserSession, requests } from '../utils';

export default function MenuUser({ classes }) {
    const currentUser = UserSession.get();
    const history = useHistory();
    const { setAlertMessage } = useContext(AlertContext);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleLogout = () => logout();

    const logout = async () => {
        requests.GET("/logout", () => {
            history.push('/login');
            UserSession.remove();
        }, setAlertMessage);
    }

    return (
        <React.Fragment>
            <Tooltip title="Account" placement="right" arrow >
                <Button className={classes.brand} color="secondary" variant="contained"
                    fullWidth onClick={(event) => { setAnchorEl(event.currentTarget) }}>
                    <AccountCircleIcon fontSize="large" />
                </Button>
            </Tooltip>
            <Menu
                getContentAnchorEl={null}
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => { setAnchorEl(null) }}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'left',
                }}
            >
                {
                    ((Boolean(currentUser)) ?
                        [
                            <MenuItem disabled className={classes.menuItem}>
                                {`${currentUser.firstName} ${currentUser.lastName}`}
                            </MenuItem>,
                            <MenuItem disabled style={{ fontSize: '0.9rem' }}>
                                {`@${currentUser.username}`}
                            </MenuItem>,
                            <Divider />,
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        ] :
                        [
                            <MenuItem disabled>
                                {'Not signed in'}
                            </MenuItem>,
                            <Divider />,
                            <MenuItem component={RouterLink} to="/login">Login</MenuItem>,
                            <MenuItem component={RouterLink} to="/register">Register</MenuItem>
                        ]).map((ItemInMenu, index) => React.cloneElement(ItemInMenu, { key: index }))
                }
            </Menu>
        </React.Fragment>
    );
};