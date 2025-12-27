from flask import Flask, jsonify, request
from flask_cors import CORS
from services import pokemon_service

app = Flask(__name__)
CORS(app)

@app.route('/api/pokemon', methods=['GET'])
def get_pokemon():
    page = request.args.get('page', default=1, type=int)
    limit = request.args.get('limit', default=10, type=int)
    sort_order = request.args.get('sort', default='asc', type=str)
    type_filter = request.args.get('type', default=None, type=str)
    search_query = request.args.get('search', default=None, type=str)
    
    if limit not in [5, 10, 20]:
         return jsonify({"success": False, "error": "Invalid limit value. Allowed values: 5, 10, 20"}), 400

    all_data = pokemon_service.get_all_pokemon()
    
    filtered_data = pokemon_service.filter_pokemon(all_data, type_filter)
    filtered_data = pokemon_service.search_pokemon(filtered_data, search_query)
    
    sorted_data = pokemon_service.sort_pokemon(filtered_data, sort_order)
    
    pagination_result = pokemon_service.paginate_pokemon(sorted_data, page, limit)
    
    if page > pagination_result['totalPages'] and pagination_result['totalPages'] > 0:
         return jsonify({
             "success": False, 
             "error": f"Invalid page. Max page allowed is {pagination_result['totalPages']} for limit {limit}.",
             "maxPage": pagination_result['totalPages']
         }), 400

    pagination_result['data'] = pokemon_service.add_capture_status(pagination_result['data'])
    
    return jsonify({
        "success": True,
        "data": pagination_result['data'],
        "pagination": {
            "total": pagination_result['total'],
            "page": pagination_result['page'],
            "limit": pagination_result['limit'],
            "totalPages": pagination_result['totalPages'],
            "hasNext": pagination_result['hasNext'],
            "hasPrev": pagination_result['hasPrev'],
            "capturedCount": pokemon_service.get_captured_count()
        },
        "filters": {
            "sort": sort_order,
            "type": type_filter,
            "search": search_query
        }
    })

@app.route('/api/pokemon/types', methods=['GET'])
def get_types():
    all_data = pokemon_service.get_all_pokemon()
    types = pokemon_service.get_all_types(all_data)
    return jsonify({
        "success": True,
        "types": types
    })

@app.route('/api/pokemon/<int:id>/capture', methods=['POST'])
def capture_pokemon(id):
    all_data = pokemon_service.get_all_pokemon()
    pokemon = pokemon_service.get_pokemon_by_id(all_data, id)
    if not pokemon:
        return jsonify({"success": False, "error": f"Pokemon with ID {id} not found"}), 404
        
    if pokemon_service.is_captured(id):
        return jsonify({"success": False, "error": "Pokemon is already captured"}), 409

    pokemon_service.capture_pokemon(id)
    return jsonify({
        "success": True, 
        "id": id, 
        "name": pokemon['name'], 
        "captured": True,
        "message": f"{pokemon['name']} captured successfully!"
    })

@app.route('/api/pokemon/<int:id>/release', methods=['POST'])
def release_pokemon(id):
    all_data = pokemon_service.get_all_pokemon()
    pokemon = pokemon_service.get_pokemon_by_id(all_data, id)
    if not pokemon:
        return jsonify({"success": False, "error": f"Pokemon with ID {id} not found"}), 404
    
    pokemon_service.release_pokemon(id)
    return jsonify({
        "success": True, 
        "id": id, 
        "name": pokemon['name'], 
        "captured": False,
         "message": f"{pokemon['name']} released successfully!"
    })

if __name__=='__main__':
    app.run(port=8080, debug=True)
