export default function validator(values, errors, setErrors) {
    if (values.name === '') {
        setErrors({ ...errors, name: 'Trong' })
    }
}