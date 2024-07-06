
import os
from dotenv import load_dotenv
from pathlib import Path
from typing import Optional

try:
	from pydantic import BaseSettings
except ImportError:
	from pydantic_settings import BaseSettings
from pydantic import ConfigDict

class Config(BaseSettings):
	model_config = ConfigDict(_env_file=None) ## only load from environment variables
	postgres_url: str
	jwt_secret_key: str
	jwt_algorithm: str = 'HS256'
	jwt_token_expire: int = 30
	jwt_refresh_token_days: int = 7

config = Config()