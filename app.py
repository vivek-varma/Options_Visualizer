from flask import Flask, request, jsonify
import numpy as np
import scipy.stats as si

app = Flask(__name__)

# Black-Scholes Option Pricing Model
def black_scholes(S, K, T, r, sigma, option_type="call"):
    d1 = (np.log(S / K) + (r + 0.5 * sigma ** 2) * T) / (sigma * np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)

    if option_type == "call":
        price = S * si.norm.cdf(d1) - K * np.exp(-r * T) * si.norm.cdf(d2)
    else:
        price = K * np.exp(-r * T) * si.norm.cdf(-d2) - S * si.norm.cdf(-d1)

    return price

# API Endpoint to Get Option Prices
@app.route('/option_price', methods=['GET'])
def get_option_price():
    S = float(request.args.get('S'))
    K = float(request.args.get('K'))
    T = float(request.args.get('T'))
    r = float(request.args.get('r'))
    sigma = float(request.args.get('sigma'))
    option_type = request.args.get('type', 'call')

    price = black_scholes(S, K, T, r, sigma, option_type)
    
    return jsonify({"option_price": price})

if __name__ == '__main__':
    app.run(debug=True)