export const setFileNoValue = (str) => {
    const spcialCharactersOfFileNo = ['/', ':', '*', '?', '<', '>', '\\', '|', '"'];
    for (let i = 0; i < spcialCharactersOfFileNo.length; i++) {
        const element = spcialCharactersOfFileNo[i];
        if (str.includes(element)) {
            str = str.slice(0, -1);
        }
    }
    return str;
}
export const formatIndianRupees = (number) => {
    return number.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
}