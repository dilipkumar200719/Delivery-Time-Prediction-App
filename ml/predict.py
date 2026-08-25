"""
PredictEats AI - ML Inference CLI & Service Gateway
"""

import sys
import json
from train_regression import DeliveryRegressionModel
from train_classifier import DeliveryClassifierModel

def run_inference(features: dict):
    reg = DeliveryRegressionModel()
    clf = DeliveryClassifierModel()
    
    eta = reg.predict(features)
    classification = clf.predict_status_and_probability(features)
    
    return {
        "predicted_eta_minutes": eta,
        "delay_probability": classification["delay_probability"],
        "delivery_status": classification["delivery_status"],
        "risk_score": classification["risk_score"],
        "confidence": classification["confidence"]
    }

if __name__ == "__main__":
    test_input = {
        "distance_km": 4.2,
        "traffic_level": "HIGH",
        "weather_condition": "RAIN",
        "road_condition": "WET",
        "vehicle_type": "BIKE",
        "restaurant_preparation_time": 8,
        "driver_experience": 3
    }
    print(json.dumps(run_inference(test_input), indent=2))
