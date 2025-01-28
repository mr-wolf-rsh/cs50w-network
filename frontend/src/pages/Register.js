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

export default function Register() {
    const history = useHistory();
    const { register, handleSubmit, errors, getValues } = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmation: ''
        }
    });
    const { setAlertMessage } = useContext(AlertContext);

    const handleSubmitButton = registerForm => signUp(registerForm);

    const signUp = async (registerForm) => {
        const { firstName, lastName,
            email, password, confirmation } = registerForm;

        const body = {
            firstName,
            lastName,
            email,
            password,
            confirmation
        };

        requests.POST("/register", body,
            (data) => {
                const loggedUser = data.user;
                UserSession.set(loggedUser);
                history.push('/home');
            }, setAlertMessage);
    };

    return (
        <SignInUp
            title={'Register now!'}
            form={
                (classes) => {
                    return (
                        <form className={classes.form} noValidate
                            onSubmit={handleSubmit(handleSubmitButton)} method="POST">
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        id="firstName"
                                        name="firstName"
                                        label="First Name"
                                        fullWidth
                                        inputRef={register({
                                            required: {
                                                value: true,
                                                message: "First name is required."
                                            }
                                        })}
                                        error={Boolean(errors.firstName)}
                                        helperText={errors.firstName && errors.firstName.message}
                                        variant="outlined"
                                        margin="normal"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        id="lastName"
                                        name="lastName"
                                        label="Last Name"
                                        fullWidth
                                        inputRef={register({
                                            required: {
                                                value: true,
                                                message: "Last name is required."
                                            }
                                        })}
                                        error={Boolean(errors.lastName)}
                                        helperText={errors.lastName && errors.lastName.message}
                                        variant="outlined"
                                        margin="normal"
                                    />
                                </Grid>
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
                                        type="password"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="confirmation"
                                        name="confirmation"
                                        label="Password Confirmation"
                                        fullWidth
                                        inputRef={register({
                                            required: {
                                                value: true,
                                                message: "Password confirmation is required."
                                            },
                                            validate: value => value === getValues("password") ||
                                                "Password confirmation must be the same as Password."
                                        })}
                                        error={Boolean(errors.confirmation)}
                                        helperText={errors.confirmation && errors.confirmation.message}
                                        variant="outlined"
                                        margin="normal"
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
                                {'Sign Up'}
                            </Button>
                        </form>
                    )
                }
            }
            link={
                <React.Fragment>
                    {"Already have an account? "}
                    <Link component={RouterLink} to="/login">
                        {"Sign in here!"}
                    </Link>
                </React.Fragment>
            }
        />
    );
};