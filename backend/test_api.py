import requests
import time
import sys

BASE_URL = "http://localhost:8080/api"

def test_get_pokemon():
    print("Testing GET /pokemon...")
    try:
        start = time.time()
        resp = requests.get(f"{BASE_URL}/pokemon?limit=5")
        print(f"Request took {time.time() - start:.2f}s")
        data = resp.json()
        if data.get('success'):
            print(f"✅ Success. Got {len(data['data'])} items.")
            print(f"Metadata: {data['pagination']}")
        else:
            print(f"❌ Failed: {data}")
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False
    return True

def test_filter():
    print("Testing Filter type=Fire...")
    resp = requests.get(f"{BASE_URL}/pokemon?type=Fire&limit=5")
    data = resp.json()
    items = data.get('data', [])
    if not items:
        print("❌ No items found for Fire filter")
        return
    
    all_fire = all(p['type_one'] == 'Fire' or p['type_two'] == 'Fire' for p in items)
    if all_fire:
        print("✅ Filter works.")
    else:
        print("❌ Filter failed. Found non-Fire types.")

def test_capture_release():
    print("Testing Capture/Release...")
    # Capture Charizard (ID 6)
    # Note: DB has multiple entries for ID 6 (Charizard, Mega X, Mega Y).
    # Capture should capture all of them if we capture by ID 6?
    # Our service captures by ID. 
    resp = requests.post(f"{BASE_URL}/pokemon/6/capture")
    if resp.json().get('success'):
        print("✅ Captured ID 6.")
    else:
        print(f"❌ Capture failed: {resp.text}")
    
    # Verify in list
    resp = requests.get(f"{BASE_URL}/pokemon?limit=20")
    data = resp.json()['data']
    # Check all pokemon with number 6
    charizards = [p for p in data if p['number'] == 6]
    if not charizards:
        print("❌ Charizard not found in first page?")
    else:
        all_captured = all(c['captured'] for c in charizards)
        if all_captured:
            print(f"✅ Verified captured status for {len(charizards)} entries of ID 6.")
        else:
            print(f"❌ detailed status: {[c['captured'] for c in charizards]}")

    # Release
    resp = requests.post(f"{BASE_URL}/pokemon/6/release")
    if resp.json().get('success'):
        print("✅ Released ID 6.")
    else:
         print("❌ Release failed.")
         
    # Verify released
    resp = requests.get(f"{BASE_URL}/pokemon?limit=20")
    data = resp.json()['data']
    charizards = [p for p in data if p['number'] == 6]
    all_released = all(not c['captured'] for c in charizards)
    if all_released:
        print("✅ Verified released status in list.")
    else:
        print("❌ Could not verify released status in list.")

if __name__ == "__main__":
    # Give server a moment
    print("Waiting for server...")
    time.sleep(2)
    if test_get_pokemon():
        test_filter()
        test_capture_release()
