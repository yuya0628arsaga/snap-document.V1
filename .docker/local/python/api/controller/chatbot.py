from api.models.chatbot_engine import ChatbotEngine
def answer(question):
    chatbot_engine = ChatbotEngine()
    return chatbot_engine.make_answer(question)
