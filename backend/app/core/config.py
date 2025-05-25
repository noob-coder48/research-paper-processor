import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    mongodb_url: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017/researchdb")
    secret_key: str = os.getenv("SECRET_KEY", "supersecret")
    algorithm: str = os.getenv("ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")

settings = Settings()