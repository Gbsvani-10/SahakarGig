from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
import uvicorn

app = FastAPI(title="SahakarGig AI Engine")

class DemandRequest(BaseModel):
    service_type: str
    historical_daily_counts: list[int] # e.g. [12, 14, 15, 18, 20, 22, 25]

class AllocationRequest(BaseModel):
    available_workers: int
    predicted_demand: int
    worker_skill_score: float

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "AI Engine"}

@app.post("/predict-demand")
def predict_demand(data: DemandRequest):
    if len(data.historical_daily_counts) < 3:
        raise HTTPException(status_code=400, detail="Insufficient historical data (minimum 3 points required).")
    
    # Train simple predictive model on time-series sequence
    X = np.array(range(len(data.historical_daily_counts))).reshape(-1, 1)
    y = np.array(data.historical_daily_counts)
    
    model = LinearRegression()
    model.fit(X, y)
    
    # Predict next time step (tomorrow)
    next_day_index = np.array([[len(data.historical_daily_counts)]])
    predicted_count = max(0, int(round(model.predict(next_day_index)[0])))
    
    return {
        "service_type": data.service_type,
        "predicted_demand_tomorrow": predicted_count,
        "trend_slope": round(float(model.coef_[0]), 2)
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)