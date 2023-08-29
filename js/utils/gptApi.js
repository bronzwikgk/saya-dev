class OpenAI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.endpoint = 'https://api.openai.com/v1/chat/completions';
    }

    async sendPrompt(prompt) {
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt,
                model: "gpt-3.5-turbo",
                
            })
        });

        if (response.ok) {
            const data = await response.json();
            return data.choices[0].text.trim();
        } else {
            throw new Error("Failed to fetch from OpenAI API");
        }
    }
}


export {OpenAI}
