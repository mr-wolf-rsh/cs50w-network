import React, {
    useState,
    useEffect,
    useContext
} from 'react';

import { Snackbar } from '@material-ui/core';

import Alert from '@material-ui/lab/Alert';

import { AlertContext } from '../../contexts/Alert';

export default function AlertNotification() {
    const { alertMessage } = useContext(AlertContext);
    const [open, setOpen] = useState(true);

    useEffect(() => {
        if (alertMessage.message.length > 0) {
            setOpen(true);
        }
    }, [alertMessage]);

    if (alertMessage.message.length === 0) return <></>;

    const handleClose = (_, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Alert variant="filled" onClose={handleClose}
                severity={alertMessage.type} style={{ fontSize: 16 }}>
                {alertMessage.message}
            </Alert>
        </Snackbar>
    );
};