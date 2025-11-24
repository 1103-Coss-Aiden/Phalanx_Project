import os
import time
from groq import Groq


class GroqClient:
    def __init__(self, model_name="llama-3.3-70b-versatile", configs=None) -> None:
        """
        Wrapper for Groq's native chat completion API.
        """
        self.model_name = model_name

        api_key = os.getenv("GROQ_API_KEY")
        if api_key is None:
            raise ValueError("Missing GROQ_API_KEY environment variable.")

        # Initialize real Groq SDK client
        self.client = Groq(api_key=api_key)

        # Default generation config
        self.config = {
            "temperature": 1.0,
            "top_p": 1.0,
            # example: "max_tokens": 256
        }
        if configs:
            self.config.update(configs)

        self.raw_response = None

    def _format_messages(self, user_message, system_message=None):
        if system_message:
            return [
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message},
            ]
        return [{"role": "user", "content": user_message}]

    def query(self, user_message, system_message=None, **kwargs):
        start = time.time()
        timeout = 60

        while True:
            try:
                response = self.client.chat.completions.create(
                    model=self.model_name,
                    messages=self._format_messages(user_message, system_message),
                    **kwargs,
                )
                self.raw_response = response
                return response.choices[0].message.content

            except Exception as e:
                print("Groq API Error:", e)

            if time.time() - start > timeout:
                print("Timed out after 60 seconds.")
                return None

            time.sleep(5)

    def __call__(self, user_message, system_message=None):
        return self.query(user_message, system_message, **self.config)


if __name__ == "__main__":
    groq = GroqClient()
    print(groq("whats apple in arabic"))
