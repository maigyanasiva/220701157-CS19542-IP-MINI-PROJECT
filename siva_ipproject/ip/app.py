from flask import Flask, render_template, jsonify, request
from flask_pymongo import PyMongo
from bson import ObjectId  # Import ObjectId for handling MongoDB ObjectIds

app = Flask(__name__)

# MongoDB configuration
app.config["MONGO_URI"] = "mongodb://localhost:27017/sakthiman"  # Update this with your MongoDB URI
mongo = PyMongo(app)

# Route for homepage
@app.route('/')
def homepage():
    return render_template('home.html')

# Route for products page
@app.route('/products')
def products():
    return render_template('product.html')

# Route for inventory page
@app.route('/inventory')
def inventory():
    return render_template('inventory.html')

# Route for sales and billing page
@app.route('/sales_billing')
def sales_billing():
    return render_template('sales_billing.html')

# Route for CRM page
@app.route('/crm')
def crm():
    return render_template('crm.html')

# Route for financial report page
@app.route('/fin')
def financial_report():
    return render_template('fin.html')

# Route to get all inventory items from MongoDB
@app.route('/api/inventory', methods=['GET'])
def get_inventory():
    inventory_items = mongo.db.inventory.find()
    return jsonify([{
        '_id': str(item['_id']),  # Convert ObjectId to string
        'productName': item.get('productName'),
        'price': item.get('price'),
        'category': item.get('category'),
        'location': item.get('location'),
        'stock': item.get('stock'),
        'reorderLevel': item.get('reorderLevel')
    } for item in inventory_items])

# Route to get a specific product from MongoDB
@app.route('/api/inventory/<product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = mongo.db.inventory.find_one({'_id': ObjectId(product_id)})
        if product:
            return jsonify({
                '_id': str(product['_id']),
                'productName': product.get('productName'),
                'price': product.get('price'),
                'category': product.get('category'),
                'location': product.get('location'),
                'stock': product.get('stock'),
                'reorderLevel': product.get('reorderLevel'),
            })
        return jsonify({'error': 'Product not found'}), 404
    except Exception:
        return jsonify({'error': 'Invalid product ID format'}), 400  # Handle invalid ObjectId format

# Route to add a product to the inventory
@app.route('/api/inventory', methods=['POST'])
def add_product():
    product = request.json
    mongo.db.inventory.insert_one(product)
    return jsonify(message="Product added successfully"), 201

# Route to get customers from MongoDB
@app.route('/api/customers', methods=['GET'])
def get_customers():
    customer_items = mongo.db.customers.find()
    return jsonify([{
        '_id': str(item['_id']),
        'name': item.get('name'),
        'email': item.get('email'),
        'phone': item.get('phone'),
        'preferences': item.get('preferences'),
        'purchaseHistory': item.get('purchaseHistory')  # Optional field
    } for item in customer_items])

# Route to add a customer to the database
@app.route('/api/customers', methods=['POST'])
def add_customer():
    customer = request.json
    mongo.db.customers.insert_one(customer)
    return jsonify(message="Customer added successfully"), 201

if __name__ == '__main__':
    app.run(debug=True)
