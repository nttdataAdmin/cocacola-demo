# test_ecommerce_product_search.py

import unittest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC

# Constants
BASE_URL = "https://demo-ecommerce.com"  # Replace with actual URL

# Page Objects

class ProductListingPage:
    def __init__(self, driver):
        self.driver = driver

    # Locators (update as per actual application)
    SEARCH_INPUT = (By.ID, "search-input")
    SEARCH_BUTTON = (By.ID, "search-btn")
    SEARCH_RESULTS = (By.CSS_SELECTOR, ".product-listing .product-item")
    PAGINATION_NEXT = (By.CSS_SELECTOR, ".pagination-next")
    PAGINATION_PREV = (By.CSS_SELECTOR, ".pagination-prev")
    PAGINATION_PAGE_NUM = (By.CSS_SELECTOR, ".pagination-page")
    FACETS = (By.CSS_SELECTOR, ".facets .facet")
    CATEGORY_FACET = (By.CSS_SELECTOR, ".facet-category .facet-option")
    BRAND_FACET = (By.CSS_SELECTOR, ".facet-brand .facet-option")
    PRICE_FACET = (By.CSS_SELECTOR, ".facet-price .facet-option")
    SELLER_ATTRIBUTE_FACET = (By.CSS_SELECTOR, ".facet-seller-attribute .facet-option")
    SORT_SELECT = (By.ID, "sort-select")
    PRODUCT_DETAILS = (By.CSS_SELECTOR, ".product-item .details")
    MOBILE_MENU = (By.ID, "mobile-menu")  # For mobile tests

    def open(self):
        self.driver.get(f"{BASE_URL}/products")

    def is_search_input_visible(self):
        try:
            return self.driver.find_element(*self.SEARCH_INPUT).is_displayed()
        except:
            return False

    def search(self, keyword):
        search_input = WebDriverWait(self.driver, 10).until(
            EC.visibility_of_element_located(self.SEARCH_INPUT)
        )
        search_input.clear()
        search_input.send_keys(keyword)
        self.driver.find_element(*self.SEARCH_BUTTON).click()

    def get_search_results(self):
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_all_elements_located(self.SEARCH_RESULTS)
        )
        return self.driver.find_elements(*self.SEARCH_RESULTS)

    def get_result_texts(self):
        results = self.get_search_results()
        return [result.text for result in results]

    def get_pagination_buttons(self):
        return {
            "next": self.driver.find_element(*self.PAGINATION_NEXT),
            "prev": self.driver.find_element(*self.PAGINATION_PREV),
            "pages": self.driver.find_elements(*self.PAGINATION_PAGE_NUM)
        }

    def select_facet(self, facet_type, value):
        if facet_type == "category":
            options = self.driver.find_elements(*self.CATEGORY_FACET)
        elif facet_type == "brand":
            options = self.driver.find_elements(*self.BRAND_FACET)
        elif facet_type == "price":
            options = self.driver.find_elements(*self.PRICE_FACET)
        elif facet_type == "seller_attribute":
            options = self.driver.find_elements(*self.SELLER_ATTRIBUTE_FACET)
        else:
            options = []
        for option in options:
            if option.text.strip() == value:
                option.click()
                break

    def get_facets_displayed(self):
        return [facet.text.strip() for facet in self.driver.find_elements(*self.FACETS)]

    def select_sort_option(self, option_text):
        select = Select(self.driver.find_element(*self.SORT_SELECT))
        select.select_by_visible_text(option_text)

    def get_product_details(self, product_element):
        return product_element.find_element(By.CSS_SELECTOR, ".details").text

    def open_mobile_menu(self):
        self.driver.find_element(*self.MOBILE_MENU).click()

# Test Cases

class TestECommerceProductSearch(unittest.TestCase):

    def setUp(self):
        # For mobile tests, use mobile emulation
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()
        self.page = ProductListingPage(self.driver)

    def tearDown(self):
        self.driver.quit()

    # TC-001: Search Input Field Availability
    def test_search_input_field_availability(self):
        self.page.open()
        self.assertTrue(
            self.page.is_search_input_visible(),
            "Search input field should be visible on the product listing page."
        )

    # TC-002: Keyword Search Functionality
    def test_keyword_search_functionality(self):
        self.page.open()
        self.page.search("Laptop")
        results = self.page.get_result_texts()
        self.assertTrue(
            any("Laptop" in r for r in results),
            "Search results should include products matching the keyword 'Laptop'."
        )

    # TC-003: Partial Match Search
    def test_partial_match_search(self):
        self.page.open()
        self.page.search("lap")
        results = self.page.get_result_texts()
        self.assertTrue(
            any("lap" in r.lower() for r in results),
            "Search results should include products whose names contain the partial keyword 'lap'."
        )

    # TC-004: Fuzzy Match Search
    def test_fuzzy_match_search(self):
        self.page.open()
        self.page.search("laptpo")
        results = self.page.get_result_texts()
        self.assertTrue(
            any("laptop" in r.lower() for r in results),
            "Search results should include products closely matching the misspelled keyword 'laptpo'."
        )

    # TC-005: Paginated Search Results Display
    def test_paginated_search_results_display(self):
        self.page.open()
        self.page.search("phone")
        results = self.page.get_search_results()
        self.assertLessEqual(
            len(results), 20,
            "Each page should display a maximum of 20 items."
        )
        # Check pagination exists if results > 20
        pagination = self.page.get_pagination_buttons()
        self.assertTrue(
            pagination["next"].is_displayed(),
            "Pagination should be available for more than 20 results."
        )

    # TC-006: Pagination Navigation
    def test_pagination_navigation(self):
        self.page.open()
        self.page.search("phone")
        pagination = self.page.get_pagination_buttons()
        # Next page
        pagination["next"].click()
        time.sleep(2)
        self.assertTrue(
            self.page.get_search_results(),
            "User should be able to navigate to next page."
        )
        # Previous page
        pagination["prev"].click()
        time.sleep(2)
        self.assertTrue(
            self.page.get_search_results(),
            "User should be able to navigate to previous page."
        )
        # Specific page
        pagination["pages"][1].click()
        time.sleep(2)
        self.assertTrue(
            self.page.get_search_results(),
            "User should be able to navigate to specific page."
        )

    # TC-007: Filter by Category
    def test_filter_by_category(self):
        self.page.open()
        self.page.search("Laptop")
        self.page.select_facet("category", "Electronics")
        time.sleep(2)
        results = self.page.get_result_texts()
        self.assertTrue(
            all("Electronics" in r for r in results),
            "Results should only display products from selected category."
        )

    # TC-008: Filter by Brand
    def test_filter_by_brand(self):
        self.page.open()
        self.page.search("Laptop")
        self.page.select_facet("brand", "HP")
        time.sleep(2)
        results = self.page.get_result_texts()
        self.assertTrue(
            all("HP" in r for r in results),
            "Results should only display products from selected brand."
        )

    # TC-009: Filter by Price Range
    def test_filter_by_price_range(self):
        self.page.open()
        self.page.search("Laptop")
        self.page.select_facet("price", "600-700")
        time.sleep(2)
        results = self.page.get_result_texts()
        for r in results:
            price = self.extract_price(r)
            self.assertTrue(
                600 <= price <= 700,
                f"Product price {price} should be within selected price range."
            )

    # TC-010: Filter by Seller Attributes
    def test_filter_by_seller_attributes(self):
        self.page.open()
        self.page.search("Laptop")
        self.page.select_facet("seller_attribute", "Certified")
        time.sleep(2)
        results = self.page.get_result_texts()
        self.assertTrue(
            all("Certified" in r for r in results),
            "Results should only display products from sellers with selected attribute."
        )

    # TC-011: Apply Multiple Filters Simultaneously
    def test_apply_multiple_filters_simultaneously(self):
        self.page.open()
        self.page.search("Laptop")
        self.page.select_facet("category", "Electronics")
        self.page.select_facet("brand", "Dell")
        self.page.select_facet("price", "600-800")
        self.page.select_facet("seller_attribute", "Top Rated")
        time.sleep(2)
        results = self.page.get_result_texts()
        self.assertTrue(
            all(
                ("Electronics" in r and "Dell" in r and "Top Rated" in r)
                for r in results
            ),
            "Results should match all selected filters."
        )

    # TC-012: Dynamic Facet Display
    def test_dynamic_facet_display(self):
        self.page.open()
        self.page.search("Laptop")
        facets = self.page.get_facets_displayed()
        expected_facets = ["Category", "Brand", "Price Range", "Seller Attribute"]
        for ef in expected_facets:
            self.assertIn(ef, facets, f"Facet '{ef}' should be displayed.")

    # TC-013: Dynamic Facet Update on Filter Application
    def test_dynamic_facet_update_on_filter_application(self):
        self.page.open()
        self.page.search("Laptop")
        initial_facets = self.page.get_facets_displayed()
        self.page.select_facet("category", "Electronics")
        time.sleep(2)
        updated_facets = self.page.get_facets_displayed()
        self.assertNotEqual(initial_facets, updated_facets, "Facets should update dynamically.")

    # TC-014: Dynamic Facet Update on Search Term Change
    def test_dynamic_facet_update_on_search_term_change(self):
        self.page.open()
        self.page.search("Laptop")
        initial_facets = self.page.get_facets_displayed()
        self.page.search("Phone")
        time.sleep(2)
        updated_facets = self.page.get_facets_displayed()
        self.assertNotEqual(initial_facets, updated_facets, "Facets should update when search term changes.")

    # TC-015: Seller Attribute Facet Availability
    def test_seller_attribute_facet_availability(self):
        self.page.open()
        self.page.search("Laptop")
        facets = self.page.get_facets_displayed()
        self.assertIn("Seller Attribute", facets, "Seller Attribute should be displayed as a facet.")

    # TC-016: Filter by Seller Attribute Updates Results
    def test_filter_by_seller_attribute_updates_results(self):
        self.page.open()
        self.page.search("Phone")
        self.page.select_facet("seller_attribute", "Authorized")
        time.sleep(2)
        results = self.page.get_result_texts()
        self.assertTrue(
            all("Authorized" in r for r in results),
            "Results should only display products from sellers with selected attribute."
        )

    # TC-017: Comprehensive Product Information Display
    def test_comprehensive_product_information_display(self):
        self.page.open()
        self.page.search("Laptop")
        results = self.page.get_search_results()
        for product in results:
            details = product.text
            self.assertTrue(
                all(
                    field in details
                    for field in ["SKU", "Category", "Brand", "Model", "Description", "Price", "Seller"]
                ),
                "Each product should display all required information."
            )

    # TC-018: Sorting Options Availability
    def test_sorting_options_availability(self):
        self.page.open()
        self.page.search("Laptop")
        sort_select = Select(self.driver.find_element(*self.page.SORT_SELECT))
        options = [o.text for o in sort_select.options]
        expected_options = ["Relevance", "Price: Low to High", "Price: High to Low", "Newest First"]
        for eo in expected_options:
            self.assertIn(eo, options, f"Sorting option '{eo}' should be available.")

    # TC-019: Sorting Functionality
    def test_sorting_functionality(self):
        self.page.open()
        self.page.search("Laptop")
        # Price: Low to High
        self.page.select_sort_option("Price: Low to High")
        time.sleep(2)
        prices = [self.extract_price(r.text) for r in self.page.get_search_results()]
        self.assertEqual(prices, sorted(prices), "Products should be sorted by price ascending.")
        # Price: High to Low
        self.page.select_sort_option("Price: High to Low")
        time.sleep(2)
        prices = [self.extract_price(r.text) for r in self.page.get_search_results()]
        self.assertEqual(prices, sorted(prices, reverse=True), "Products should be sorted by price descending.")
        # Newest First
        self.page.select_sort_option("Newest First")
        time.sleep(2)
        # Check if sorted by date if available (not implemented here)
        # Relevance
        self.page.select_sort_option("Relevance")
        time.sleep(2)
        # Check if sorted by relevance (not implemented here)

    # TC-020: Search Response Time Under 2 Seconds
    def test_search_response_time_under_2_seconds(self):
        self.page.open()
        start_time = time.time()
        self.page.search("Shoes")  # Assume returns up to 10,000 results
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_all_elements_located(self.page.SEARCH_RESULTS)
        )
        end_time = time.time()
        response_time = end_time - start_time
        self.assertLessEqual(
            response_time, 2,
            f"Search response time should be under 2 seconds, got {response_time}."
        )

    # TC-022: Web Platform Search Accessibility
    def test_web_platform_search_accessibility(self):
        self.page.open()
        self.page.search("Laptop")
        results = self.page.get_search_results()
        self.assertTrue(
            len(results) > 0,
            "Search functionality should work on web interface."
        )

    # TC-023: Mobile Platform Search Accessibility
    def test_mobile_platform_search_accessibility(self):
        # Re-initialize driver with mobile emulation
        self.driver.quit()
        mobile_emulation = {"deviceName": "iPhone X"}
        options = webdriver.ChromeOptions()
        options.add_experimental_option("mobileEmulation", mobile_emulation)
        self.driver = webdriver.Chrome(options=options)
        self.page = ProductListingPage(self.driver)
        self.page.open()
        self.page.open_mobile_menu()
        self.page.search("Laptop")
        results = self.page.get_search_results()
        self.assertTrue(
            len(results) > 0,
            "Search functionality should work on mobile interface."
        )

    # TC-024: Consistent Search Experience Across Platforms
    def test_consistent_search_experience_across_platforms(self):
        # Web
        self.page.open()
        self.page.search("Laptop")
        web_results = self.page.get_result_texts()
        web_facets = self.page.get_facets_displayed()
        web_sort_options = [o.text for o in Select(self.driver.find_element(*self.page.SORT_SELECT)).options]
        # Mobile
        self.driver.quit()
        mobile_emulation = {"deviceName": "iPhone X"}
        options = webdriver.ChromeOptions()
        options.add_experimental_option("mobileEmulation", mobile_emulation)
        self.driver = webdriver.Chrome(options=options)
        self.page = ProductListingPage(self.driver)
        self.page.open()
        self.page.open_mobile_menu()
        self.page.search("Laptop")
        mobile_results = self.page.get_result_texts()
        mobile_facets = self.page.get_facets_displayed()
        mobile_sort_options = [o.text for o in Select(self.driver.find_element(*self.page.SORT_SELECT)).options]
        # Compare
        self.assertEqual(web_results, mobile_results, "Search results should be consistent across platforms.")
        self.assertEqual(web_facets, mobile_facets, "Facets should be consistent across platforms.")
        self.assertEqual(web_sort_options, mobile_sort_options, "Sorting options should be consistent across platforms.")

    # Utility method to extract price from product details text
    def extract_price(self, details_text):
        import re
        match = re.search(r"Price[:\s]*\$?([\d\.]+)", details_text)
        if match:
            return float(match.group(1))
        return 0.0

if __name__ == "__main__":
    unittest.main()