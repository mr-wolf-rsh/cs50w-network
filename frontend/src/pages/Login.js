import React, { useContext } from 'react';

import { Link as RouterLink, useHistory } from "react-router-dom";

import {
    Button,
    Grid,
    Link,
    TextField
} from '@material-ui/core';

import { useForm } from "react-hook-form";

import { AlertContext } from '../contexts/Alert';

import SignInUp from '../components/sign-in-up';
import {
    UserSession,
    requests,
    joinClassNames
} from '../components/utils';

export default function Login() {
    const history = useHistory();
    const { register, handleSubmit, errors } = useForm({
        defaultValues: {
            email: '',
            password: '',
        }
    });
    const { setAlertMessage } = useContext(AlertContext);

    const handleSubmitButton = loginForm => signIn(loginForm);

    const signIn = async (loginForm) => {
        const { email, password } = loginForm;

        const body = {
            email,
            password
        };

        requests.POST("/login", body,
            (data) => {
                const loggedUser = data.user;
                UserSession.set(loggedUser);
                history.push('/home');
            }, setAlertMessage);
    };

    return (
        <SignInUp
            title={'Account Login'}
            form={(classes) => {
                return (
                    <form className={classes.form} noValidate
                        onSubmit={handleSubmit(handleSubmitButton)} method="POST">
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    id="email"
                                    name="email"
                                    label="Email Address"
                                    fullWidth
                                    inputRef={register({
                                        required: {
                                            value: true,
                                            message: "Email address is required."
                                        },
                                        pattern: {
                                            value: /^\w+@\w+\.\w+$/,
                                            message: "Must be a valid email address."
                                        }
                                    })}
                                    error={Boolean(errors.email)}
                                    helperText={errors.email && errors.email.message}
                                    variant="outlined"
                                    margin="normal"
                                    inputProps={{ style: { textAlign: 'center' } }}
                                    type="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="password"
                                    name="password"
                                    label="Password"
                                    fullWidth
                                    inputRef={register({
                                        required: {
                                            value: true,
                                            message: "Password is required."
                                        }
                                    })}
                                    error={Boolean(errors.password)}
                                    helperText={errors.password && errors.password.message}
                                    variant="outlined"
                                    margin="normal"
                                    inputProps={{ style: { textAlign: 'center' } }}
                                    type="password"
                                />
                            </Grid>
                        </Grid>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth
                            className={joinClassNames(classes.buttonSubmit, classes.fontSize16)}
                        >
                            {'Sign In'}
                        </Button>
                    </form>
                )
            }}
            link={
                <React.Fragment>
                    {"Don't have an account? "}
                    <Link component={RouterLink} to="/register">
                        {"Register here!"}
                    </Link>
                </React.Fragment>
            }
        />
    );
};