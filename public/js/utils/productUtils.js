import {
  fetchAndPopulateSuppliers,
  fetchAndPopulateCategories
} from '../utils/helper.js'

import {
  showAlertMessage
} from '../alerts/alerts.js'

// Pagination settings
export let currentPage = 1;
const productsPerPage = 6;

export async function addProduct() {
  const productName = $('#productName').val().trim();
  const quantityInStock = $('#quantityInStock').val().trim();
  const price = $('#price').val().trim();
  const sellingPrice = $('#sellingPrice').val().trim();
  const reorderLevel = $('#reorderLevel').val().trim();
  const productCode = $('#productCode').val().trim();
  const supplierId = $('#supplierDropdown').val();  // Capture supplier ID
  const categoryId = $('#categoryDropdown').val();

    // Prepare the product data object
    const productData = { 
      product_name: productName,
      quantity_instock: quantityInStock,
      purchase_price: price,
      selling_price: sellingPrice,
      reorder_level: reorderLevel,
      product_code: productCode,
      supplier_id: supplierId,
      category_id: categoryId
    };

  console.log('Product Data to be sent:', productData); // Debugging

  try {
    const response = await fetch(`http://localhost:3000/api/inventory/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (response.ok) {
      fetchProducts(); // Refresh product list
      showAlertMessage('Product added successfully!', 'success');
    } else {
      const errorMessage = await response.text(); // Read the response body as text
      console.error('Failed to add product:', errorMessage);
      showAlertMessage('Failed to add product: ' + errorMessage, 'error');
    }
  } catch (error) {
    console.error('Error adding product:', error);
    showAlertMessage('An error occurred while adding the product.', 'error');
  }
}



// Function to update an existing product
export async function updateProduct() {
  const productId = $('#hiddenProductId').val();
  const productData = {
    product_name: $('#productName').val().trim(),
    product_code: $('#productCode').val().trim(),
    quantity_instock: $('#quantityInStock').val().trim(),
    purchase_price: $('#price').val().trim(),
    selling_price: $('#sellingPrice').val().trim(),
    reorder_level: $('#reorderLevel').val().trim(),
    category_id: $('#categoryDropdown').val(),  // Assuming dropdown value is a valid category_id
    supplier_id: $('#supplierDropdown').val(),  // Assuming dropdown value is a valid supplier_id
    description: $('#description').val().trim()
  };
  

  try {
    const response = await fetch(`http://localhost:3000/api/inventory/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (response.ok) {
      // Optionally handle success, e.g., refresh product list
      fetchProducts();
      showAlertMessage('Product updated successfully!', 'success');
    } else {
      showAlertMessage('Failed to update product.');
    }
  } catch (error) {
    console.error('Error updating product:', error);
    showAlertMessage('An error occurred while updating the product.');
  }
}


// Fetch products and store in local storage
export function fetchProducts() {
  $.getJSON('http://localhost:3000/api/inventory/products')
    .done(function (products) {
      localStorage.setItem('inventoryProducts', JSON.stringify(products));
      displayProducts(products);
    })
    .fail(function (error) {
      console.error('Error fetching products:', error);
    });
}

// Debounce utility
function debounce(func, delay) {
  let timer;
  return function (...args) {
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

// Search products with debouncing
export const debouncedSearchProducts = debounce(function searchProducts() {
  const searchQuery = $('#searchProductInput').val().trim().toLowerCase();
  const products = JSON.parse(localStorage.getItem('inventoryProducts')) || [];

  const filteredProducts = products.filter(item =>
    item.product_name.toLowerCase().includes(searchQuery) ||
    String(item.purchase_price).toLowerCase().includes(searchQuery)
  );

  currentPage = 1; // Reset to first page for filtered results
  displayProducts(filteredProducts);
}, 300);

// Display products with pagination
export function displayProducts(products) {
  const totalPages = Math.ceil(products.length / productsPerPage);
  const paginatedProducts = paginate(products, currentPage, productsPerPage);
  const $tableBody = $('#productTableBody');
  $tableBody.empty();

  if (paginatedProducts.length === 0) {
    $tableBody.html('<tr><td colspan="3" class="mt-4 text-center">No product found.</td></tr>');
  } else {
    paginatedProducts.forEach(product => {
      const row = `
        <tr>
         <td class="py-4 px-6 text-sm text-gray-500 text-center">${product.product_code}</td>
         <td class="py-4 px-6 text-sm text-gray-900 text-center">${product.product_name}</td>
         <td class="py-4 px-6 text-sm text-gray-500 text-center">&#8369; ${product.selling_price}</td>
         <td class="py-4 px-6 text-sm text-gray-500 text-center">&#8369; ${product.purchase_price}</td>
         <td class="py-4 px-6 text-sm text-gray-500 text-center">${product.category_name}</td>
         <td class="py-4 px-6 text-sm text-gray-500 text-center">${product.supplier_name || 'No Supplier Assigned'}</td>
         <td class="py-4 px-6 text-sm text-gray-500 text-center">${product.reorder_level}</td>
         <td class="py-4 px-6 text-sm">
          <div class="flex items-center justify-center space-x-2">
            <button data-id="${product.product_id}" class="edit-product-btn p-2 text-gray-700 hover:text-gray-500">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button data-id="${product.product_id}" class="delete-product-btn p-2 text-red-700 hover:text-red-500">
              <i class="fa-solid fa-trash-can" style="color: #f84444;"></i>
            </button>
          </div>
        </td>
        </tr>`;
      $tableBody.append(row);
    });
      // Attach event listeners for edit buttons
      $('.edit-product-btn').on('click', function () {
        const productId = $(this).data('id');
        const product = products.find(p => p.product_id === productId);
        if (product) {
          openEditProductModal(product);
        }
      });

    setupPaginationControls(totalPages, () => displayProducts(products));
  }
}

// Pagination helper function
function paginate(products, page, productsPerPage) {
  const start = (page - 1) * productsPerPage;
  const end = start + productsPerPage;
  return products.slice(start, end);
}

// Setup pagination controls
function setupPaginationControls(totalPages, fetchProductsCallback) {
  const $paginationControls = $('#productPaginationControls');
  $paginationControls.empty(); // Clear existing buttons

  // Previous Button
  const prevButton = $('<button>', {
    text: 'Previous',
    class: `px-4 py-2 rounded bg-gray-300 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`,
    disabled: currentPage === 1
  }).on('click', function () {
    if (currentPage > 1) {
      currentPage--;
      fetchProductsCallback();
    }
  });
  $paginationControls.append(prevButton);

  // Page Number Buttons
  for (let page = 1; page <= totalPages; page++) {
    const pageButton = $('<button>', {
      text: page,
      class: `px-4 py-2 rounded ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300'}`
    }).on('click', function () {
      currentPage = page;
      fetchProductsCallback();
    });
    $paginationControls.append(pageButton);
  }

  // Next Button
  const nextButton = $('<button>', {
    text: 'Next',
    class: `px-4 py-2 rounded bg-gray-300 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`,
    disabled: currentPage === totalPages
  }).on('click', function () {
    if (currentPage < totalPages) {
      currentPage++;
      fetchProductsCallback();
    }
  });
  $paginationControls.append(nextButton);
}

export function attachProductEventListeners() {
  // Edit Buttons
  $(document).on('click', '.edit-product-btn', function () {
    const productId = $(this).data('id'); // This should be a number or string ID
    const products = JSON.parse(localStorage.getItem('inventoryProducts')) || [];
    const productToEdit = products.find(product => product.product_id === Number(productId));

    if (productToEdit) {
      // Pass each property individually to avoid sending an object
      openEditProductModal(
        productToEdit.product_id,            // Pass product_id only
        productToEdit.product_name,
        productToEdit.quantity_instock,
        productToEdit.purchase_price,
        productToEdit.selling_price,
        productToEdit.reorder_level,
        productToEdit.product_code,
        productToEdit.supplier_id
      );
    } else {
      console.error('Product not found:', productId);
    }
  });

  // Delete Buttons using event delegation
  $(document).on('click', '.delete-product-btn', deleteProduct);
}


export function deleteProduct(event) {
  const productId = $(event.target).closest('button').data('id'); // Ensure this matches the attribute in your HTML
  console.log('Delete has been clicked for product ID:', productId); // Log the product ID for debugging

  if (!productId) {
    console.error('No Product ID found to delete.');
    showAlertMessage('No Product ID found to delete.', 'error'); // Alert user about the error
    return;
  }

  // Show confirmation dialog using alertify
  alertify.confirm("Are you sure you want to delete this product?",
    function() { // User clicked 'Ok'
      // Proceed to delete the item
      $.ajax({
        url: `http://localhost:3000/api/inventory/products/${productId}`,
        method: 'DELETE',
        success: function(response) {
          console.log('Product deleted successfully.');

          // Show the success alert
          showAlertMessage('Product deleted successfully!', 'danger'); // Red for delete

          // Optionally, refresh the product list after deletion
          fetchProducts(); 
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.error('Error deleting product:', textStatus, errorThrown);
          showAlertMessage('Error deleting product: ' + errorThrown, 'error'); // Notify the user about the error
        }
      });
    },
    function() { // User clicked 'Cancel'
      alertify.error('Delete action canceled.');
    }
  ); 
}


// Add/edit/delete functions (you can export these if needed by product.js)

// Additional functions here, such as open/close modal, etc.




function openEditProductModal(productId, productName, quantityInStock, price, sellingPrice, reorderLevel, productCode) {
  const $productForm = $('#productForm');
  $productForm.attr('data-mode', 'edit');

  $('#hiddenProductId').val(String(productId));  

  $('#productCode').prop('disabled', true); // Disables editing product code field
  $('#productName').val(productName);
  $('#quantityInStock').val(quantityInStock);
  $('#price').val(price);
  $('#sellingPrice').val(sellingPrice);
  $('#reorderLevel').val(reorderLevel);
  $('#productCode').val(productCode);

  $('#productModalTitle').text('Edit Product');
  $('#productSubmitButton').text('Update');
  $('#productModal').removeClass('hidden');

  fetchAndPopulateSuppliers();
  fetchAndPopulateCategories();
}


