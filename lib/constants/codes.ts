export const chat = {
  completionPython: `
    from alleai.core import AlleAIClient
client = AlleAIClient(api_key="your api key")
chat = client.chat.completion({
    "models": ["gpt-4o", "deepseek-r1", "claude-3.5-sonnet"],
    "messages": [
        {
            "system": [
                {
                    "type": "text",
                    "text": "You are a helpful assistant."
                }
            ]
        },
        {
            "user": [
                {
                    "type": "text",
                    "text": "What is photosynthesis?"
                }
            ]
        }
    ]
})
`,
  requestFormat: `

{
    "models": ["gpt-4o", "claude-3.5-sonnet"],
    "messages": [
      {
        "system": {
          "type": "text",
          "text": "You are a helpful assistant."
        },
        "user": {
          "type": "text",
          "text": "Hello, how are you?"
        }
      }
    ],
    "response_format": {
      "type": "text",
      "model_specific": {
        "gpt-4o": "text",
        "claude-3.5-sonnet": "text"
      }
    },
    "temperature": 0.7,
    "max_tokens": 1000,
    "stream": false
}
`,
completionNode:`

`
};
