from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import RedirectResponse
from .auth_router import router as auth_router

app = FastAPI(
	title='Journal api',
	description="Api service for personal journaling app",
	version="0.01",
)

origins = [
	"*",
]

app.add_middleware(
	CORSMiddleware,
	allow_origins=origins,
	allow_methods=["GET", "POST"],
	allow_headers=["*"],
)

@app.get("/",)
def main():
	return RedirectResponse(url="/docs/")

app.include_router(auth_router)
