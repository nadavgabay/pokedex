import sys
import os
from typing import List, Dict, Any, Optional
import re

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import db

CACHE = None
CAPTURED = set()

def get_captured_count() -> int:
    return len(CAPTURED)

def get_all_pokemon() -> List[Dict[str, Any]]:
    global CACHE
    if CACHE is None:
        try:
            raw_data = db.get()
            for idx, p in enumerate(raw_data):
                p['id'] = idx + 1
            CACHE = raw_data
        except:
            CACHE = []
    return CACHE if CACHE else []

def get_all_types(data: List[Dict[str, Any]]) -> List[str]:
    types = set()
    for p in data:
        if p.get('type_one'):
            types.add(p['type_one'])
        if p.get('type_two'):
            types.add(p['type_two'])
    return sorted(list(types))

def filter_pokemon(data: List[Dict[str, Any]], type_filter: Optional[str]) -> List[Dict[str, Any]]:
    if not type_filter:
        return data
    return [p for p in data if p.get('type_one') == type_filter or p.get('type_two') == type_filter]

def search_pokemon(data: List[Dict[str, Any]], query: Optional[str]) -> List[Dict[str, Any]]:
    if not query:
        return data
    q = query.lower()
    return [p for p in data if q in p.get('name', '').lower()]

def sort_pokemon(data: List[Dict[str, Any]], order: str = 'asc') -> List[Dict[str, Any]]:
    reverse = (order == 'desc')
    return sorted(data, key=lambda x: x.get('number', 0), reverse=reverse)

def paginate_pokemon(data: List[Dict[str, Any]], page: int, limit: int) -> Dict[str, Any]:
    total_items = len(data)
    total_pages = (total_items + limit - 1) // limit
    
    if page < 1: page = 1
    
    start = (page - 1) * limit
    end = start + limit
    
    paginated_data = data[start:end]
    
    return {
        "data": paginated_data,
        "total": total_items,
        "page": page,
        "limit": limit,
        "totalPages": total_pages,
        "hasNext": page < total_pages,
        "hasPrev": page > 1
    }

def capture_pokemon(pokemon_id: int):
    CAPTURED.add(pokemon_id)

def release_pokemon(pokemon_id: int):
    if pokemon_id in CAPTURED:
        CAPTURED.remove(pokemon_id)

def is_captured(pokemon_id: int) -> bool:
    return pokemon_id in CAPTURED

def add_capture_status(pokemon_list: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    enriched = []
    for p in pokemon_list:
        p_copy = p.copy()
        
        p_copy['captured'] = is_captured(p.get('id'))
        
        if 'imageUrl' not in p_copy:
             name_clean = normalize_pokemon_name(p_copy['name'])
             p_copy['imageUrl'] = f"https://img.pokemondb.net/artwork/large/{name_clean}.jpg"
             
        enriched.append(p_copy)
    return enriched

def get_pokemon_by_id(data: List[Dict[str, Any]], pokemon_id: int) -> Optional[Dict[str, Any]]:
    for p in data:
        if p.get('id') == pokemon_id:
            return p
    return None

def normalize_pokemon_name(name: str) -> str:
    name = name.replace('%', '')
    name = re.sub(r'\s*(?:forme|cloak)$', '', name, flags=re.IGNORECASE)

    name = re.sub(r'\s*[A-Z][a-z]*\s*[Ss][Ii][Zz][Ee]$', '', name)

    name = re.sub(r'([a-z])([A-Z])', r'\1 \2', name)

    name = re.sub(r'([a-zA-Z])(\d)', r'\1 \2', name)

    mega_pattern = r'^(.+?)\s*Mega\s+\1(\s+(.+))?$'
    mega_match = re.match(mega_pattern, name, re.IGNORECASE)
    
    if mega_match:
        base_name = mega_match.group(1)
        suffix = mega_match.group(3)
        name = f"{base_name}-Mega-{suffix}" if suffix else f"{base_name}-Mega"
    else:
        words = name.split()
        seen = set()
        unique_words = []
        for word in words:
            lower = word.lower()
            if lower not in seen:
                seen.add(lower)
                unique_words.append(word)
        name = " ".join(unique_words)
    
    name = name.lower().strip()
    
    replacements = {
        " ": "-",
        ".": "",
        "'": "",
        "'": "",
        "♀": "-f",
        "♂": "-m",
        "é": "e",
        "á": "a",
        "í": "i",
        "ó": "o",
        "ú": "u",
    }

    for k, v in replacements.items():
        name = name.replace(k, v)

    return name