import secrets
import uvicorn
from fastapi import Depends, FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi import FastAPI, Request, Depends, HTTPException, status


#from config.config_routes import router as config_router
#from rosters.roster_routes import router as roster_router
# from itsm.itsm_connector_routes import router as itsm_router
# from database.vectordb_connector_routes import router as vectordb_router
#from database.sqldatabase_connector_routes import router as sqldb_router
from knowledge_management.knowledge_assistant_routes import router as knowledge_assistant_router
from resolution_management.resolution_assist_routes import router as resolution_assist_router
from change_management.change_management_routes import router as change_management_router
from change_management.file_upload_routes import router as upload_router
from llm_app.llm_routes import router as llm_router


from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(docs = "/documentation", redoc_url = None)
security = HTTPBasic()

# Replace with your actual frontend origin
origins = [
"http://172.31.12.205:3000",
"http://13.52.182.207:80"
]

MAX_BYTES = 1024 * 1024 * 50  # 50MB limit

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,              # Must NOT be ["*"] when credentials are used
    allow_credentials = True,             # This enables cookies, auth headers, etc.
    allow_methods = ["*"],                # Adjust if needed
    allow_headers = ["*"],                # Adjust if needed
)

# Reject large uploads early if Content-Length is known
@app.middleware("http")
async def limit_upload_size(request, call_next):
    if request.url.path == "/upload_image":
        cl = request.headers.get("content-length")
        if cl:
            try:
                if int(cl) > MAX_BYTES:
                    return JSONResponse(status_code=413, content={"detail": "File too large"})
            except ValueError:
                pass
    return await call_next(request)


def authenticate(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = secrets.compare_digest(credentials.username, "rest")
    correct_password = secrets.compare_digest(credentials.password, "!fi$5*4KlHDdRwdbup%ix")
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username


# app.include_router(itsm_router, prefix = '/itsm', tags = ['ITSM - ServiceNOW'], dependencies=[Depends(authenticate)])
#app.include_router(roster_router, prefix = '/rosters', tags = ['Roster - ExcelData'], dependencies=[Depends(authenticate)])
#app.include_router(sqldb_router, prefix = '/database', tags = ['SQL Database - PosgreSQL'], dependencies=[Depends(authenticate)])
#app.include_router(config_router, prefix = '/configurations', tags = ['Config - Database'], dependencies=[Depends(authenticate)])
# app.include_router(vectordb_router, prefix = '/vector_database', tags = ['Vector Database - PosgreSQL'], dependencies=[Depends(authenticate)])
app.include_router(knowledge_assistant_router, prefix = '/kb_management', tags = ['Knowledge Assistant'], dependencies=[Depends(authenticate)])
app.include_router(resolution_assist_router, prefix  = '/resolution_management', tags = ['Resolution Management'], dependencies=[Depends(authenticate)])
app.include_router(change_management_router, prefix  = '/change_management', tags = ['Change Management'], dependencies=[Depends(authenticate)])
app.include_router(upload_router, prefix  = '/remote_file_management', tags = ['File Upload Management'], dependencies=[Depends(authenticate)])
app.include_router(llm_router, prefix  = '/llm', tags = ['LLM Responses'], dependencies=[Depends(authenticate)])

# Handling Pydantic Validation exceptions
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code = 422,
        content={
            "code": 422,
            "error": {
                "messsage": "Payload validation failed",
                "details": exc.errors(),
                "endpoint": request.url.path
            },
        },
    )
