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

LAST_MTIME = 0

def get_all_pokemon() -> List[Dict[str, Any]]:
    global CACHE, LAST_MTIME

    try:
        current_mtime = os.path.getmtime(db.DB_PATH)
    except OSError:
        current_mtime = 0

    # If cache is empty or file changed, reload
    if CACHE is None or current_mtime != LAST_MTIME:
        try:
            raw_data = db.get()
            for idx, p in enumerate(raw_data):
                p['id'] = idx + 1
            CACHE = raw_data
            LAST_MTIME = current_mtime
        except Exception as e:
            print(f"Error fetching DB: {e}")
            if CACHE is None: CACHE = []
            
    return CACHE if CACHE else []

def get_all_types(data: List[Dict[str, Any]]) -> List[str]:
    types = set()
    for p in data:
        if p.get('type_one'):
            types.add(p['type_one'])
        if p.get('type_two'):
            types.add(p['type_two'])
    return sorted(list(types))

def filter_pokemon(data: List[Dict[str, Any]], type_filter: Optional[str], captured_only: bool = False) -> List[Dict[str, Any]]:
    filtered = data
    if type_filter:
        filtered = [p for p in filtered if p.get('type_one') == type_filter or p.get('type_two') == type_filter]
    
    if captured_only:
        filtered = [p for p in filtered if is_captured(p.get('id'))]
        
    return filtered

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
    # remove % and 'forme' suffixes
    clean_name = re.sub(r'%|\s*forme$', '', name, flags=re.IGNORECASE)
    
    # handle "GourgeistSmall Size" -> "Gourgeist"
    # word characters (the name)
    # followed by Small/Average/Large/Super
    # followed by " Size"
    # and keeps only the first part.
    clean_name = re.sub(r'([a-zA-Z]+)(?:Small|Average|Large|Super|Pumpkaboo) Size$', r'\1', clean_name, flags=re.IGNORECASE)

    # handle Mega Evolutions (e.g. "Venusaur Mega Venusaur" -> "Venusaur-Mega")
    mega_match = re.match(r'^(.+?)\s*Mega\s+\1(\s+(.+))?$', clean_name, re.IGNORECASE)
    if mega_match:
        base_name = mega_match.group(1)
        suffix = mega_match.group(3)
        clean_name = f"{base_name} Mega {suffix}" if suffix else f"{base_name} Mega"

    # handle CamelCase and LetterDigit boundaries (insert spaces)
    clean_name = re.sub(r'([a-z])([A-Z])', r'\1 \2', clean_name)
    clean_name = re.sub(r'([a-zA-Z])(\d)', r'\1 \2', clean_name)

    # deduplicate words and normalize to lowercase slug
    words = re.split(r'[\s-]+', clean_name)
    unique_words = []
    seen = set()
    for w in words:
        w_lower = w.lower()
        if w_lower and w_lower not in seen:
            seen.add(w_lower)
            unique_words.append(w_lower)
    
    clean_name = '-'.join(unique_words)

    # Final character replacements for URL safety
    replacements = {
        '.': '', "'": '', '"': '',
        '♀': '-f', '♂': '-m',
        'é': 'e', 'á': 'a', 'í': 'i', 'ó': 'o', 'ú': 'u'
    }
    
    for k, v in replacements.items():
        clean_name = clean_name.replace(k, v)
        
    # Collapse multiple hyphens and trim
    clean_name = re.sub(r'-+', '-', clean_name).strip('-')

    return clean_name