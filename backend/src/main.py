from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import RedirectResponse
from .routes.auth_router import router as auth_router
from .routes.user_router import router as user_router
from .routes.journal_router import router as journal_router
from .routes.category_router import router as category_router

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
	allow_methods=["GET", "POST", "PUT", "DELETE"],
	allow_headers=["*"],
)

@app.get("/", include_in_schema=False)
def main():
	return RedirectResponse(url="/docs/")

app.include_router(auth_router,  tags=["auth"])
app.include_router(user_router, tags=["users"])
app.include_router(journal_router, tags=["journals"])
app.include_router(category_router, tags=["categories"])
