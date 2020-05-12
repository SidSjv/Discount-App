export const getCurrentTime = () => {
    var d = new Date(); // for now

    let h = d.getHours(); // => 9
    let m = d.getMinutes(); // =>  30
    let s = d.getSeconds(); // => 51

    let currentTime = `${h}:${m}:${s}`;
    return currentTime;
};
