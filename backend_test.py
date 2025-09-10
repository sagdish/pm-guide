#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Product Management Guide
Tests all endpoints including authentication, progress tracking, and tools
"""

import requests
import json
import time
from datetime import datetime
import uuid

# Configuration
BASE_URL = "https://product-pro-guide.preview.emergentagent.com/api"
TEST_USER_EMAIL = f"testuser_{int(time.time())}@example.com"
TEST_USER_PASSWORD = "SecurePassword123!"
TEST_USER_NAME = "Test User PM Guide"

class ProductManagementAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.auth_token = None
        self.user_id = None
        self.test_results = []
        
    def log_test(self, test_name, success, details="", response_data=None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat(),
            "response_data": response_data
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if details:
            print(f"   Details: {details}")
        if not success and response_data:
            print(f"   Response: {response_data}")
        print()

    def test_basic_health_check(self):
        """Test GET /api/ endpoint"""
        try:
            response = requests.get(f"{self.base_url}/")
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "version" in data:
                    self.log_test("Basic API Health Check", True, 
                                f"API responding with message: {data['message']}, version: {data['version']}")
                else:
                    self.log_test("Basic API Health Check", False, 
                                "Missing expected fields in response", data)
            else:
                self.log_test("Basic API Health Check", False, 
                            f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Basic API Health Check", False, f"Exception: {str(e)}")

    def test_legacy_status_endpoints(self):
        """Test legacy status endpoints"""
        # Test POST /api/status
        try:
            payload = {"client_name": "Test Client PM Guide"}
            response = requests.post(f"{self.base_url}/status", json=payload)
            if response.status_code == 200:
                data = response.json()
                if "id" in data and "client_name" in data:
                    self.log_test("Legacy POST /api/status", True, 
                                f"Status created with ID: {data['id']}")
                else:
                    self.log_test("Legacy POST /api/status", False, 
                                "Missing expected fields", data)
            else:
                self.log_test("Legacy POST /api/status", False, 
                            f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Legacy POST /api/status", False, f"Exception: {str(e)}")

        # Test GET /api/status
        try:
            response = requests.get(f"{self.base_url}/status")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Legacy GET /api/status", True, 
                                f"Retrieved {len(data)} status checks")
                else:
                    self.log_test("Legacy GET /api/status", False, 
                                "Response is not a list", data)
            else:
                self.log_test("Legacy GET /api/status", False, 
                            f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Legacy GET /api/status", False, f"Exception: {str(e)}")

    def test_user_registration(self):
        """Test POST /api/auth/register"""
        try:
            payload = {
                "email": TEST_USER_EMAIL,
                "password": TEST_USER_PASSWORD,
                "name": TEST_USER_NAME
            }
            response = requests.post(f"{self.base_url}/auth/register", json=payload)
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "user" in data:
                    self.auth_token = data["access_token"]
                    self.user_id = data["user"]["id"]
                    self.log_test("User Registration", True, 
                                f"User registered successfully with ID: {self.user_id}")
                else:
                    self.log_test("User Registration", False, 
                                "Missing access_token or user in response", data)
            else:
                self.log_test("User Registration", False, 
                            f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_test("User Registration", False, f"Exception: {str(e)}")

    def test_duplicate_registration(self):
        """Test duplicate user registration"""
        try:
            payload = {
                "email": TEST_USER_EMAIL,
                "password": TEST_USER_PASSWORD,
                "name": TEST_USER_NAME
            }
            response = requests.post(f"{self.base_url}/auth/register", json=payload)
            
            if response.status_code == 400:
                data = response.json()
                if "Email already registered" in data.get("detail", ""):
                    self.log_test("Duplicate Registration Prevention", True, 
                                "Correctly prevented duplicate registration")
                else:
                    self.log_test("Duplicate Registration Prevention", False, 
                                "Wrong error message", data)
            else:
                self.log_test("Duplicate Registration Prevention", False, 
                            f"Expected HTTP 400, got {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Duplicate Registration Prevention", False, f"Exception: {str(e)}")

    def test_user_login(self):
        """Test POST /api/auth/login"""
        try:
            payload = {
                "email": TEST_USER_EMAIL,
                "password": TEST_USER_PASSWORD
            }
            response = requests.post(f"{self.base_url}/auth/login", json=payload)
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "user" in data:
                    # Update token in case it's different
                    self.auth_token = data["access_token"]
                    self.log_test("User Login", True, 
                                f"Login successful for user: {data['user']['email']}")
                else:
                    self.log_test("User Login", False, 
                                "Missing access_token or user in response", data)
            else:
                self.log_test("User Login", False, 
                            f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_test("User Login", False, f"Exception: {str(e)}")

    def test_invalid_login(self):
        """Test login with invalid credentials"""
        try:
            payload = {
                "email": TEST_USER_EMAIL,
                "password": "WrongPassword123!"
            }
            response = requests.post(f"{self.base_url}/auth/login", json=payload)
            
            if response.status_code == 401:
                data = response.json()
                if "Incorrect email or password" in data.get("detail", ""):
                    self.log_test("Invalid Login Handling", True, 
                                "Correctly rejected invalid credentials")
                else:
                    self.log_test("Invalid Login Handling", False, 
                                "Wrong error message", data)
            else:
                self.log_test("Invalid Login Handling", False, 
                            f"Expected HTTP 401, got {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Invalid Login Handling", False, f"Exception: {str(e)}")

    def test_protected_route_auth_me(self):
        """Test GET /api/auth/me with authentication"""
        if not self.auth_token:
            self.log_test("Protected Route /auth/me", False, "No auth token available")
            return
            
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            response = requests.get(f"{self.base_url}/auth/me", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and "email" in data and data["email"] == TEST_USER_EMAIL:
                    self.log_test("Protected Route /auth/me", True, 
                                f"Retrieved user info for: {data['email']}")
                else:
                    self.log_test("Protected Route /auth/me", False, 
                                "Invalid user data returned", data)
            else:
                self.log_test("Protected Route /auth/me", False, 
                            f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Protected Route /auth/me", False, f"Exception: {str(e)}")

    def test_unauthorized_access(self):
        """Test protected routes without authentication"""
        try:
            response = requests.get(f"{self.base_url}/auth/me")
            
            if response.status_code == 403:
                self.log_test("Unauthorized Access Prevention", True, 
                            "Correctly blocked unauthorized access")
            else:
                self.log_test("Unauthorized Access Prevention", False, 
                            f"Expected HTTP 403, got {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Unauthorized Access Prevention", False, f"Exception: {str(e)}")

    def test_get_progress(self):
        """Test GET /api/progress"""
        if not self.auth_token:
            self.log_test("Get Progress", False, "No auth token available")
            return
            
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            response = requests.get(f"{self.base_url}/progress", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                expected_fields = ["completed_sections", "module_progress", "assessment_scores", "total_progress"]
                if all(field in data for field in expected_fields):
                    self.log_test("Get Progress", True, 
                                f"Retrieved progress with {data['total_progress']}% completion")
                else:
                    self.log_test("Get Progress", False, 
                                "Missing expected progress fields", data)
            else:
                self.log_test("Get Progress", False, 
                            f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Get Progress", False, f"Exception: {str(e)}")

    def test_update_section_progress(self):
        """Test POST /api/progress/section"""
        if not self.auth_token:
            self.log_test("Update Section Progress", False, "No auth token available")
            return
            
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            payload = {
                "section_id": "intro-to-pm",
                "module_id": "pm-basics",
                "completed": True
            }
            response = requests.post(f"{self.base_url}/progress/section", 
                                   json=payload, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "total_progress" in data:
                    self.log_test("Update Section Progress", True, 
                                f"Progress updated: {data['message']}, Total: {data['total_progress']}%")
                else:
                    self.log_test("Update Section Progress", False, 
                                "Missing expected response fields", data)
            else:
                self.log_test("Update Section Progress", False, 
                            f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Update Section Progress", False, f"Exception: {str(e)}")

    def test_submit_assessment(self):
        """Test POST /api/progress/assessment"""
        if not self.auth_token:
            self.log_test("Submit Assessment", False, "No auth token available")
            return
            
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            payload = {
                "assessment_id": "pm-basics-quiz",
                "answers": {
                    "q1": "Product Manager",
                    "q2": "User needs and business goals",
                    "q3": "Data-driven decisions"
                },
                "score": 85.5
            }
            response = requests.post(f"{self.base_url}/progress/assessment", 
                                   json=payload, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "score" in data:
                    self.log_test("Submit Assessment", True, 
                                f"Assessment submitted: {data['message']}, Score: {data['score']}")
                else:
                    self.log_test("Submit Assessment", False, 
                                "Missing expected response fields", data)
            else:
                self.log_test("Submit Assessment", False, 
                            f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Submit Assessment", False, f"Exception: {str(e)}")

    def test_rice_calculation(self):
        """Test POST /api/tools/rice-calculation"""
        if not self.auth_token:
            self.log_test("RICE Calculation", False, "No auth token available")
            return
            
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            payload = {
                "feature_name": "User Dashboard Enhancement",
                "reach": 1000.0,
                "impact": 3.0,
                "confidence": 80.0,
                "effort": 5.0
            }
            response = requests.post(f"{self.base_url}/tools/rice-calculation", 
                                   json=payload, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and "score" in data and "saved" in data:
                    expected_score = (1000 * 3 * 0.8) / 5  # 480
                    actual_score = data["score"]
                    if abs(actual_score - expected_score) < 0.01:
                        self.log_test("RICE Calculation", True, 
                                    f"RICE calculation saved with correct score: {actual_score}")
                    else:
                        self.log_test("RICE Calculation", False, 
                                    f"Incorrect RICE score calculation. Expected: {expected_score}, Got: {actual_score}")
                else:
                    self.log_test("RICE Calculation", False, 
                                "Missing expected response fields", data)
            else:
                self.log_test("RICE Calculation", False, 
                            f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_test("RICE Calculation", False, f"Exception: {str(e)}")

    def test_rice_calculation_zero_effort(self):
        """Test RICE calculation with zero effort"""
        if not self.auth_token:
            self.log_test("RICE Calculation Zero Effort", False, "No auth token available")
            return
            
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            payload = {
                "feature_name": "Zero Effort Feature",
                "reach": 500.0,
                "impact": 2.0,
                "confidence": 90.0,
                "effort": 0.0
            }
            response = requests.post(f"{self.base_url}/tools/rice-calculation", 
                                   json=payload, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("score") == 0:
                    self.log_test("RICE Calculation Zero Effort", True, 
                                "Correctly handled zero effort with score 0")
                else:
                    self.log_test("RICE Calculation Zero Effort", False, 
                                f"Expected score 0 for zero effort, got: {data.get('score')}")
            else:
                self.log_test("RICE Calculation Zero Effort", False, 
                            f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_test("RICE Calculation Zero Effort", False, f"Exception: {str(e)}")

    def test_rice_history(self):
        """Test GET /api/tools/rice-history"""
        if not self.auth_token:
            self.log_test("RICE History", False, "No auth token available")
            return
            
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            response = requests.get(f"{self.base_url}/tools/rice-history", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if "calculations" in data and isinstance(data["calculations"], list):
                    calc_count = len(data["calculations"])
                    self.log_test("RICE History", True, 
                                f"Retrieved {calc_count} RICE calculations")
                    
                    # Verify calculation structure if any exist
                    if calc_count > 0:
                        calc = data["calculations"][0]
                        required_fields = ["id", "feature_name", "reach", "impact", "confidence", "effort", "score", "created_at"]
                        if all(field in calc for field in required_fields):
                            self.log_test("RICE History Structure", True, 
                                        "RICE calculation structure is correct")
                        else:
                            self.log_test("RICE History Structure", False, 
                                        "Missing fields in RICE calculation", calc)
                else:
                    self.log_test("RICE History", False, 
                                "Missing or invalid calculations field", data)
            else:
                self.log_test("RICE History", False, 
                            f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_test("RICE History", False, f"Exception: {str(e)}")

    def test_malformed_requests(self):
        """Test various malformed requests"""
        if not self.auth_token:
            self.log_test("Malformed Request Handling", False, "No auth token available")
            return
            
        headers = {"Authorization": f"Bearer {self.auth_token}"}
        
        # Test malformed JSON
        try:
            response = requests.post(f"{self.base_url}/progress/section", 
                                   data="invalid json", headers=headers)
            if response.status_code == 422:
                self.log_test("Malformed JSON Handling", True, 
                            "Correctly rejected malformed JSON")
            else:
                self.log_test("Malformed JSON Handling", False, 
                            f"Expected HTTP 422, got {response.status_code}")
        except Exception as e:
            self.log_test("Malformed JSON Handling", False, f"Exception: {str(e)}")

        # Test missing required fields
        try:
            payload = {"section_id": "test"}  # Missing module_id and completed
            response = requests.post(f"{self.base_url}/progress/section", 
                                   json=payload, headers=headers)
            if response.status_code == 422:
                self.log_test("Missing Fields Handling", True, 
                            "Correctly rejected request with missing fields")
            else:
                self.log_test("Missing Fields Handling", False, 
                            f"Expected HTTP 422, got {response.status_code}")
        except Exception as e:
            self.log_test("Missing Fields Handling", False, f"Exception: {str(e)}")

    def test_invalid_token(self):
        """Test requests with invalid JWT token"""
        try:
            headers = {"Authorization": "Bearer invalid_token_here"}
            response = requests.get(f"{self.base_url}/auth/me", headers=headers)
            
            if response.status_code == 401:
                self.log_test("Invalid Token Handling", True, 
                            "Correctly rejected invalid JWT token")
            else:
                self.log_test("Invalid Token Handling", False, 
                            f"Expected HTTP 401, got {response.status_code}")
        except Exception as e:
            self.log_test("Invalid Token Handling", False, f"Exception: {str(e)}")

    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting Product Management Guide Backend API Tests")
        print(f"📍 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Basic health checks
        self.test_basic_health_check()
        self.test_legacy_status_endpoints()
        
        # Authentication flow
        self.test_user_registration()
        self.test_duplicate_registration()
        self.test_user_login()
        self.test_invalid_login()
        self.test_protected_route_auth_me()
        self.test_unauthorized_access()
        self.test_invalid_token()
        
        # Progress tracking
        self.test_get_progress()
        self.test_update_section_progress()
        self.test_submit_assessment()
        
        # Interactive tools
        self.test_rice_calculation()
        self.test_rice_calculation_zero_effort()
        self.test_rice_history()
        
        # Error handling
        self.test_malformed_requests()
        
        # Summary
        self.print_summary()

    def print_summary(self):
        """Print test summary"""
        print("=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  ❌ {result['test']}: {result['details']}")
        
        print("\n" + "=" * 60)

if __name__ == "__main__":
    tester = ProductManagementAPITester()
    tester.run_all_tests()