import os
from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import json
from fastapi.responses import JSONResponse

from mangum import Mangum


load_dotenv()
app = FastAPI()

origins = [
    "http://localhost:3000",  # update with your Next.js URL if different
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # Allows specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/generate_meal_plan", response_class=JSONResponse)
def get_meal_plan():
    file_path = os.path.join(os.path.dirname(__file__), "meal_plan.json")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="meal_plan.json not found")
    try:
        with open(file_path, "r") as f:
            data = json.load(f)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
