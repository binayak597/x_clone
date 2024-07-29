export function timeSincePost(timestamp) {
    const now = new Date(); //current time
    const postDate = new Date(timestamp);
    const timeDifference = now - postDate;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
        return "Just now";
    } else if (minutes < 60) {
        return `${minutes}m`;
    } else if (hours < 24) {
        return `${hours}h`;
    } else if (days < 7) {
        return `${days}d`;
    } else {
        const weeks = Math.floor(days / 7);
        if (weeks < 4) {
            return `${weeks}w`;
        } else {
            const months = Math.floor(days / 30);
            if (months < 12) {
                return `${months}month`;
            } else {
                const years = Math.floor(days / 365);
                return `${years}y`;
            }
        }
    }
}

