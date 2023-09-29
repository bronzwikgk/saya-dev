class OpenAi {
    constructor() {
        this.lastRequestTime = 0
    }

    async sendToOpenAI(inputData) {
        console.log("Sent to Gpt Initiated");
        const currentTime = Date.now();
        const timeSinceLastRequest = currentTime - this.lastRequestTime;
        const delayTime = 20000 - timeSinceLastRequest;  // 20000ms = 20 seconds

        if (delayTime > 0) {
            await new Promise(resolve => setTimeout(resolve, delayTime));
        }

        try {
            let sheeUrl = "https://script.google.com/macros/s/AKfycbwG9CFoTFhcKnsuvq-gAUQ5JiJkuOP6xwXgge01f5KtNSraYyPdfly2QsXD6EUtQsmG/exec"  // Your URL
            let res = await fetch(sheeUrl, {
                method: "POST",
                headers: {
                    'Content-Type': 'text/plain',
                    "Accept-Charset": "utf-8"
                },
                body: JSON.stringify({
                    "model": "gpt-3.5-turbo",
                    "message": ` "${inputData}"`,
                    "someValue": "trail"
                })
            });
            console.log(res.data);
            let output = await res.json();
            if (output.status === "success") {
                console.log(output.data);
                this.lastRequestTime = Date.now();
                return output.data;
            }
        } catch (error) {
            console.error("Error sending data to OpenAI:", error);
        }

    }
}

export { OpenAi }