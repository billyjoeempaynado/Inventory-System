import abstractView from "./abstractView.js";
import {
  addProduct,
  updateProduct,
  fetchProducts,
  displayProducts,
  debouncedSearchProducts,
  deleteProduct,
  attachProductEventListeners,

} from '../utils/productUtils.js';

import {
  fetchAndPopulateSuppliers,
  fetchAndPopulateCategories
} from '../utils/helper.js'

import {
  showAlertMessage
} from '../alerts/alerts.js'

export default class Products extends abstractView {
  constructor() {
    super();
    this.setTitle("Products");
  }

  async getHtml() {
    return `
      <div id="productsSection" class="">
        <h1 class="text-3xl mb-4 font-bold">Products</h1>
        <!-- Add Product Button -->
        <div class="flex w-full justify-between items-center">
          <div>
            <button id="addProductButton" class="mb-4 bg-blue-500 text-white px-4 py-2 rounded">Add Product</button>
          </div>
          <!-- Search Bar with Button -->
          <div class="flex mb-2 items-center space-x-0 border-2 border-gray-300 bg-white h-10 rounded-lg w-64">
            <input
              id="searchProductInput"
              class="h-full pl-2 rounded-lg text-sm focus:outline-none w-full"
              type="search" name="search" placeholder="Search">
            <button id="searchProductButton" type="button" class="bg-blue-500 text-white px-4 py-2 h-full rounded-r-lg">
              <svg class="text-white h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg"
                   version="1.1" id="Capa_1" x="0px" y="0px"
                   viewBox="0 0 56.966 56.966" style="enable-background:new 0 0 56.966 56.966;"
                   xml:space="preserve"
                   width="512px" height="512px">
                  <path
                      d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="bg-white shadow-md rounded-lg overflow-hidden">
          <table class="min-w-full bg-white">
            <thead>
              <tr>
                <th class="py-2 px-6 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Product Code</th>
                <th class="py-2 px-6 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                <th class="py-2 px-6 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Selling Price</th>
                <th class="py-2 px-6 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Price</th>
                <th class="py-2 px-6 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th class="py-2 px-6 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th class="py-2 px-6 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Reorder Level</th>
                <th class="py-2 px-6 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody id="productTableBody" class="bg-white divide-y divide-gray-200"></tbody>
          </table>
        </div>
        <div id="productPaginationControls" class="pagination-controls flex justify-center space-x-4 mt-4">
          <button id="productPrevPageButton" class="rounded px-4 py-2 bg-gray-300" disabled>Previous</button>
          <div id="productPageButtons" class="flex space-x-2"></div>
          <button id="productNextPageButton" class="rounded px-4 py-2 bg-gray-300">Next</button>
        </div>
        
        <!-- Reusable Item Modal for Add and Edit -->
        <div id="productModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center hidden">
          <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
            <h2 id="productModalTitle" class="text-2xl font-bold mb-4">Add Product</h2>
            <form id="productForm">
              <input type="hidden" id="hiddenProductId" name="hiddenProductId">
              <div class="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-12">
                <div class="sm:col-span-5">
                  <label for="productName" class="block text-gray-700">Product Name</label>
                  <input type="text" id="productName" name="productName" class="w-full border border-gray-300 rounded px-4 py-2" required>
                </div>
                <div class="sm:col-span-4">
                  <label for="quantityInStock" class="block text-gray-700">Quantity in Stock</label>
                  <input type="number" id="quantityInStock" name="quantityInStock" class="w-full border border-gray-300 rounded px-4 py-2" required>
                </div>
                <div class="sm:col-span-3">
                  <label for="productCode" class="block text-gray-700">Product Code</label>
                  <input type="text" id="productCode" name="productCode" class="w-full border border-gray-300 rounded px-4 py-2">
                </div>
              </div>
              <div class="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label for="price" class="block text-gray-700">Purchase Price</label>
                  <input type="number" id="price" name="price" class="w-full border border-gray-300 rounded px-4 py-2" required>
                </div>
                <div>
                  <label for="sellingPrice" class="block text-gray-700">Selling Price</label>
                  <input type="number" id="sellingPrice" name="sellingPrice" class="w-full border border-gray-300 rounded px-4 py-2" required>
                </div>
                <div>
                  <label for="reorderLevel" class="block text-gray-700">Reorder Level</label>
                  <input type="number" id="reorderLevel" name="reorderLevel" class="w-full border border-gray-300 rounded px-4 py-2" required>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label for="categoryDropdown" class="block text-gray-700">Category</label>
                  <select id="categoryDropdown" name="category" class="w-full border border-gray-300 rounded px-4 py-2">
                    <option value="">Select a category</option>
                  </select>
                </div>
                <div>
                  <label for="supplierDropdown" class="block text-gray-700">Supplier</label>
                  <select id="supplierDropdown" name="supplier" class="w-full border border-gray-300 rounded px-4 py-2">
                    <option value="">Select a supplier</option>
                  </select>
                </div>
              </div>
              <div class="mb-4">
                <label for="description" class="block text-gray-700">Description</label>
                <textarea id="description" name="description" class="w-full border border-gray-300 rounded px-4 py-2" rows="2"></textarea>
              </div>
              <div class="flex justify-end">
                <button type="button" id="productCancelButton" class="bg-gray-500 text-white px-4 py-2 rounded mr-2">Cancel</button>
                <button type="submit" id="productSubmitButton" class="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  }
}


function openAddProductModal() {
  const $productForm = $('#productForm');
  $productForm.attr('data-mode', 'add'); // Set form mode to 'add'
  console.log('Form mode set to:', $productForm.attr('data-mode')); // Corrected debugging log

  // Clear the input fields
  $('#productName').val('');
  $('#price').val('');
  $('#sellingPrice').val('');
  $('#reorderLevel').val('');
  $('#productCode').val('');

  // Update modal title and button text for "Add"
  $('#productModalTitle').text('Add Product');
  $('#productSubmitButton').text('Add');

  $('#productCode').prop('disabled', false); // Enable the field for new entries

  // Open the modal
  $('#productModal').removeClass('hidden');

  
}

function closeProductModal() {
  $('#productForm')[0].reset(); // Clear the form
  $('#productModal').addClass('hidden'); // Hide the modal
  $('#hiddenProductId').val(''); // Reset hidden field
}

// Initialize event listeners and fetch data when document is ready
$(document).ready(function () {
  // Initial data fetch
  fetchAndPopulateSuppliers();
  fetchAndPopulateCategories();
  fetchProducts();

  // Attach event listeners
  attachProductEventListeners(); // Ensure this is called to set up all product-related event listeners
  $('#searchProductInput').on('input', debouncedSearchProducts);
  $('#addProductButton').on('click', openAddProductModal);
  $('#productForm').on('submit', handleProductFormSubmit);

  // Close modal event listener
  $('#productCancelButton').on('click', closeProductModal);
});



async function handleProductFormSubmit(event) {
  event.preventDefault(); // Prevent default form submission
  const formMode = $('#productForm').data('mode');

  try {
    if (formMode === 'add') {
      await addProduct(); // Wait for the product to be added
    } else if (formMode === 'edit') {
      await updateProduct(); // Wait for the product to be updated
    }
    closeProductModal(); // Only close the modal if the operation was successful
  } catch (error) {
    console.error('Error handling product form submission:', error);
    showAlertMessage('An error occurred while processing your request.', 'error'); // Show error message
  }
}
