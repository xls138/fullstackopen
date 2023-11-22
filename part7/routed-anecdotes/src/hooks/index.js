import { useState } from 'react'

export const useField = (type) => {
    const [value, setValue] = useState('')

    const onChange = (event) => {
        setValue(event.target.value)
    }

    const reset = () => {
        setValue('')
    }

    const input = { type, value, onChange };
    const rest = { reset };

    return {
        input,
        rest
    };
}