import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import scipy.stats as si

app = Flask(__name__)
CORS(app)  # Fix CORS

# Black-Scholes Option Pricing Model
def black_scholes(S, K, T, r, sigma, option_type="call"):
    d1 = (np.log(S / K) + (r + 0.5 * sigma ** 2) * T) / (sigma * np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)

    if option_type == "call":
        price = S * si.norm.cdf(d1) - K * np.exp(-r * T) * si.norm.cdf(d2)
    else:
        price = K * np.exp(-r * T) * si.norm.cdf(-d2) - S * si.norm.cdf(-d1)

    return price

# API Route with Forced CORS Headers
@app.route('/option_price', methods=['GET'])
def get_option_price():
    try:
        S = float(request.args.get('S'))
        K = float(request.args.get('K'))
        T = float(request.args.get('T'))
        r = float(request.args.get('r'))
        sigma = float(request.args.get('sigma'))
        option_type = request.args.get('type', 'call')

        price = black_scholes(S, K, T, r, sigma, option_type)

        # Explicitly add CORS headers
        response = jsonify({"option_price": price})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "GET, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        return response
    except Exception as e:
        return jsonify({"error": str(e)}), 400  # Handle errors gracefully
    
@app.route('/option_greeks', methods=['GET'])
def get_option_greeks():
    try:
        S = float(request.args.get('S'))
        K = float(request.args.get('K'))
        T = float(request.args.get('T'))
        r = float(request.args.get('r'))
        sigma = float(request.args.get('sigma'))
        option_type = request.args.get('type', 'call')

        # Calculate Greeks
        d1 = (np.log(S / K) + (r + 0.5 * sigma ** 2) * T) / (sigma * np.sqrt(T))
        d2 = d1 - sigma * np.sqrt(T)

        delta = si.norm.cdf(d1) if option_type == "call" else si.norm.cdf(d1) - 1
        gamma = si.norm.pdf(d1) / (S * sigma * np.sqrt(T))
        vega = S * si.norm.pdf(d1) * np.sqrt(T) / 100
        theta = (- (S * si.norm.pdf(d1) * sigma) / (2 * np.sqrt(T))
                 - r * K * np.exp(-r * T) * si.norm.cdf(d2 if option_type == "call" else -d2)) / 365
        rho = (K * T * np.exp(-r * T) * si.norm.cdf(d2 if option_type == "call" else -d2)) / 100

        return jsonify({"delta": delta, "gamma": gamma, "vega": vega, "theta": theta, "rho": rho})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))  # Bind to Render-assigned port
    app.run(host="0.0.0.0", port=port, debug=True)
