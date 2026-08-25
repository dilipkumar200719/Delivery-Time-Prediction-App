"""
PredictEats AI - Delivery Delay Classifier Model
Classifies delivery outcome into ON_TIME, POSSIBLE_DELAY, HIGH_DELAY and outputs calibrated delay probability.
"""

import math

class DeliveryClassifierModel:
    def predict_status_and_probability(self, features: dict) -> dict:
        risk = 10
        traffic = features.get("traffic_level", "LOW")
        if traffic == "MEDIUM": risk += 15
        elif traffic == "HIGH": risk += 35
        elif traffic == "SEVERE": risk += 55

        weather = features.get("weather_condition", "CLEAR")
        if weather == "RAIN": risk += 15
        elif weather == "HEAVY_RAIN": risk += 30
        elif weather == "STORM": risk += 50

        road = features.get("road_condition", "NORMAL")
        if road == "WET": risk += 10
        elif road == "DAMAGED": risk += 20
        elif road == "BLOCKED": risk += 40

        risk = min(99, max(5, risk))
        z = (risk - 42) / 16.0
        prob = round(1.0 / (1.0 + math.exp(-z)), 2)

        if prob >= 0.65 or risk >= 60:
            status = "HIGH_DELAY"
        elif prob >= 0.32 or risk >= 35:
            status = "POSSIBLE_DELAY"
        else:
            status = "ON_TIME"

        return {
            "delay_probability": prob,
            "delivery_status": status,
            "risk_score": risk,
            "confidence": round(0.95 - (0.1 if risk > 60 else 0.02), 2)
        }

if __name__ == "__main__":
    clf = DeliveryClassifierModel()
    sample = {
        "traffic_level": "HIGH",
        "weather_condition": "RAIN",
        "road_condition": "WET"
    }
    print(clf.predict_status_and_probability(sample))
