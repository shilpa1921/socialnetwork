import { useState } from "react";
import axios from "axios";

export function useAuthSubmit(url, fields) {
    const [error, setError] = useState(false);

    function submit() {
        axios
            .post(url, fields)
            .then(({ data }) =>
                data.success ? location.replace("/") : setError(true)
            );
    }
    return [error, submit];
}

export function useStatefulFields() {
    const [fields, setFields] = useState({});

    function handleChange({ target }) {
        setFields({
            ...fields,
            [target.name]: target.value,
        });
    }

    return [fields, handleChange];
}
