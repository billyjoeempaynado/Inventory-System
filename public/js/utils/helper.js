// Fetch suppliers and populate dropdown
export function fetchAndPopulateSuppliers() {
  const $supplierDropdown = $('#supplierDropdown');
  if ($supplierDropdown.length === 0) {
    console.error('supplierDropdown is undefined or null');
    return;
  }

  $.getJSON('http://localhost:3000/api/inventory/suppliers')
    .done(function (suppliers) {
      $supplierDropdown.html('<option value="">Select a supplier</option>');
      suppliers.forEach(supplier => {
        $supplierDropdown.append($('<option>', {
          value: supplier.supplier_id,
          text: supplier.supplier_name
        }));
      });
    })
    .fail(function (error) {
      console.error('Error fetching suppliers:', error);
    });
}

// Fetch categories and populate dropdown
export function fetchAndPopulateCategories() {
  const $categoryDropdown = $('#categoryDropdown');
  if ($categoryDropdown.length === 0) {
    console.error('categoryDropdown is undefined or null');
    return;
  }

  $.getJSON('http://localhost:3000/api/inventory/categories')
    .done(function (categories) {
      $categoryDropdown.html('<option value="">Select a category</option>');
      categories.forEach(category => {
        $categoryDropdown.append($('<option>', {
          value: category.category_id,
          text: category.category_name
        }));
      });
    })
    .fail(function (error) {
      console.error('Error fetching categories:', error);
    });
}




export function fetchAndPopulateProducts() {
  const productList = document.getElementById('productList');
  if (!productList) {
    console.error('productList is undefined or null');
    return;
  }



// Fetch the products from your API
fetch('http://localhost:3000/api/inventory/products')
  .then(response => response.json())
  .then(products => {
    const productList = document.getElementById('productList');
    productList.innerHTML = '<option value="">Select a product</option>'; // Reset dropdown options

    // Populate the product dropdown
    products.forEach(product => {
      const option = document.createElement('option');
      option.value = product.product_id; // Assuming product_id is the ID
      option.text = product.product_name; // Product name
      option.dataset.price = product.selling_price || ''; // Store selling price in a data attribute
      productList.appendChild(option);
    });
  })
  .catch(error => console.error('Error fetching products:', error));

// Add an event listener to the product dropdown
document.getElementById('productList').addEventListener('change', (event) => {
  const selectedOption = event.target.selectedOptions[0]; // Get the selected option
  const orderPriceInput = document.getElementById('orderPrice'); // Price input field
  

  if (selectedOption && selectedOption.value) {
    const price = selectedOption.dataset.price; // Get the price from the data attribute
    console.log('Selected product price:', price); // Debugging: check the price value

    // Check if the price is a valid number
    if (price && !isNaN(price)) {
      orderPriceInput.value = parseFloat(price).toFixed(2); // Set price to 2 decimal places
      console.log('Price set in field:', orderPriceInput.value); // Debugging: check if price is set
    } else {
      orderPriceInput.value = ''; // Clear the input if the price is invalid
      console.log('Invalid price or no price, clearing field.'); // Debugging: log if no price is set
    }
  } else {
    orderPriceInput.value = ''; // Clear the input if no product is selected
    console.log('No product selected, clearing price field.'); // Debugging: log if no product selected
  }
});
 
}