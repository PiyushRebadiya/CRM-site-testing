export const addressFieldChange = (str) => {
    return str.slice(-1) === ',' ? str.slice(0, -1) : str;
}