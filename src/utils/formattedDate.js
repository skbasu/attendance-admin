export const convertToDate = (timestamp) => {
    if(!timestamp){
        return '00-00-0000';
    }    
    // Create a new Date object from the timestamp
    const date = new Date(timestamp);

    // Extract the year, month, day, and time
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const day = date.getDate().toString().padStart(2, '0');
    
    // Return the formatted date
    return `${day}-${month}-${year}`;
}
