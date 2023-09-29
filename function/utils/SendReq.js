let url = 'http://localhost:4000/'
class SendReq{
    async send(id, method,action, body) {
        this.ids = this.getIdsFromURL()
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'), // assuming the token is stored in localStorage
                    'docid': this.ids.rootId
                },
                action:action,
                entityId:id,
                data: body
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`API Request Failed: ${text}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error making API request:", error);
            return null;
        }
    }
}


export {SendReq}