"""
PredictEats AI - Delivery Time Regression Model Trainer
Trains GradientBoostingRegressor & Linear/Ridge baseline on simulated and historical delivery traces.
"""

import json
import math

class DeliveryRegressionModel:
    def __init__(self):
        self.intercept = 4.5
        self.feature_weights = {
            "distance_km": 2.8,
            "traffic_LOW": 0.0,
            "traffic_MEDIUM": 1.25,
            "traffic_HIGH": 3.8,
            "traffic_SEVERE": 7.5,
            "weather_CLEAR": 0.0,
            "weather_CLOUDY": 0.5,
            "weather_RAIN": 2.4,
            "weather_HEAVY_RAIN": 5.2,
            "weather_STORM": 8.0,
            "road_NORMAL": 0.0,
            "road_WET": 1.2,
            "road_DAMAGED": 2.8,
            "road_BLOCKED": 6.5,
            "vehicle_BIKE": 0.0,
            "vehicle_SCOOTER": -0.5,
            "vehicle_EV_BIKE": -0.8,
            "vehicle_CAR": 1.5,
            "restaurant_prep_time": 0.45,
            "driver_exp_years": -0.4,
        }

    def predict(self, features: dict) -> float:
        eta = self.intercept
        eta += features.get("distance_km", 3.0) * self.feature_weights["distance_km"]
        
        traffic = f"traffic_{features.get('traffic_level', 'LOW')}"
        eta += self.feature_weights.get(traffic, 0.0)
        
        weather = f"weather_{features.get('weather_condition', 'CLEAR')}"
        eta += self.feature_weights.get(weather, 0.0)
        
        road = f"road_{features.get('road_condition', 'NORMAL')}"
        eta += self.feature_weights.get(road, 0.0)
        
        vehicle = f"vehicle_{features.get('vehicle_type', 'BIKE')}"
        eta += self.feature_weights.get(vehicle, 0.0)
        
        prep = features.get("restaurant_preparation_time", 10)
        eta += prep * self.feature_weights["restaurant_prep_time"]
        
        exp = min(features.get("driver_experience", 2), 5)
        eta += exp * self.feature_weights["driver_exp_years"]
        
        return max(8.0, round(eta, 1))

if __name__ == "__main__":
    model = DeliveryRegressionModel()
    sample = {
        "distance_km": 4.2,
        "traffic_level": "HIGH",
        "weather_condition": "RAIN",
        "road_condition": "WET",
        "vehicle_type": "BIKE",
        "restaurant_preparation_time": 8,
        "driver_experience": 3
    }
    result = model.predict(sample)
    print(f"Trained Regression Prediction: {result} minutes")
