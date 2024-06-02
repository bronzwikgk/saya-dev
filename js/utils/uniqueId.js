function generateUniqueId() {
    const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
    const machineId = Math.floor(Math.random() * 0xFFFFFF).toString(16);
    const processId = Math.floor(Math.random() * 0xFFFF).toString(16);
    const counter = Math.floor(Math.random() * 0xFFFFFF).toString(16);

    return timestamp + "00".substr(0, 6 - machineId.length) + machineId + 
           "00".substr(0, 4 - processId.length) + processId + 
           "00".substr(0, 6 - counter.length) + counter;
}



export {generateUniqueId}
