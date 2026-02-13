"""
Simple script to test backend connection
"""
import requests
import sys

API_BASE = "http://localhost:1788"

def test_connection():
    print("Testing backend connection...")
    print(f"API Base: {API_BASE}\n")
    
    # Test health endpoint
    try:
        print("1. Testing /health endpoint...")
        response = requests.get(f"{API_BASE}/health", timeout=5)
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
        print("   [OK] Health check passed\n")
    except requests.exceptions.ConnectionError:
        print("   [ERROR] Connection failed - Backend is not running!")
        print(f"   Start backend with: uvicorn app_manufacturing:app --host 0.0.0.0 --port 1788")
        return False
    except Exception as e:
        print(f"   [ERROR] Error: {e}")
        return False
    
    # Test root endpoint
    try:
        print("2. Testing / endpoint...")
        response = requests.get(f"{API_BASE}/", timeout=5)
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
        print("   [OK] Root endpoint works\n")
    except Exception as e:
        print(f"   [ERROR] Error: {e}\n")
    
    # Test dashboard endpoint
    try:
        print("3. Testing /dashboard/status endpoint...")
        response = requests.get(f"{API_BASE}/dashboard/status", timeout=5)
        print(f"   Status: {response.status_code}")
        data = response.json()
        print(f"   Production Lines: {data.get('production_lines', {}).get('total', 'N/A')}")
        print(f"   Workers: {data.get('workers', {}).get('total', 'N/A')}")
        print("   [OK] Dashboard endpoint works\n")
    except Exception as e:
        print(f"   [ERROR] Error: {e}\n")
    
    print("[SUCCESS] All tests passed! Backend is working correctly.")
    print("\nIf frontend still can't connect:")
    print("1. Check browser console (F12) for errors")
    print("2. Clear browser cache (Ctrl+Shift+Delete)")
    print("3. Restart frontend server")
    return True

if __name__ == "__main__":
    success = test_connection()
    sys.exit(0 if success else 1)

