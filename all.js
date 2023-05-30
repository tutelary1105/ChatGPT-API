const apiUrl = 'https://api.openai.com/v1/chat/completions';
const token = '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';

const messages = [
    {
        role: 'user',
        content: '你今後的對話中，請你扮演我的聊天機器人，請使用繁體中文進行回覆',
    },
];

const openAiRequest = async (message) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    
    try {
        const { data } = await axios.post (
            apiUrl,
            {
                messages,
                model: 'gpt-3.5-turbo',
                max_tokens: 200,
            },  
            config,
        );
        const { message } = data.choices[0];
        return message;
    } catch (error) {}
};

// createTemplate
const createChatMessageTemplate = (data) =>
    data.map((item,index) => {
        if (index === 0) return '';

        if (item.role ==='user') {
            return `<div class="d-flex align-items-start mb-4">
                <p class="bg-body-secondary p-3 m-0 rounded flex-fill">
                    ${item.content.replace(/\n/g, '<br />')}
                </p>
                <img src="./images/user.png" width="60" alt="">
            </div>`;
        } else {
            return `<div class="d-flex align-items-start mb-4">
                <img src="./images/chatgpt-logo.png" width="60" alt="">
                <p class="bg-body-secondary p-3 m-0 rounded flex-fill">
                    ${item.content.replace(/\n/g, '<br />')}
                </p>
            </div>`;
        }     
    }).join('');

const form = document.querySelector('form');
form.addEventListener('submit', async(e) => {
    e.preventDefault();
    const chatElement = document.querySelector('#chat');
    const chatInputElement = document.querySelector('#chatInput');

    chatInputElement.disabled = true;
    messages.push({
        role: 'user',
        content: chatInputElement.value,
    });

    const content = await openAiRequest(messages);
    messages.push(content);
    chatElement.innerHTML = createChatMessageTemplate(messages);

    chatInputElement.value = '';
    chatInputElement.disabled = false;
    chatElement.scrollTop = chatElement.scrollHeight;
});