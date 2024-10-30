export const getInitialsAndTitle = (name, gender) => {

    if (!name || !gender) {
        return ''; 
    }

    const nameParts = name.split(' ');

    const initials = nameParts.map(part => part[0].toUpperCase()).join('');

    let title;
    if (gender.toLowerCase() === 'male') {
        title = 'Sir';
    } else {
        title = "Ma'am";
    }

    return `${initials} ${title}`;
}
