
export let currentPage =1;
const supplierPerPage = 6;

export async function addSupplier() {
  const supplierName = $('#supplierName').val().trim();
  const contactPerson = $('#contactPerson').val().trim();
  const phoneNumber = $('#phoneNumber').val().trim();
  const supplierEmail = $('#supplierEmail').val().trim();
  const supplierAddress = $('#supplierAddress').val().trim();

  const supplierData = {
    supplier_name: supplierName,
    contact_person: contactPerson,
    phone_number: phoneNumber,
    supplier_email: supplierEmail,
    supplier_address: supplierAddress,
  };

  try {
    const response = await fetch(`http://localhost:3000/api/inventory/suppliers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',   
      },
      body: JSON.stringify(supplierData),
    });

    if(response.ok) {
      fetchSuppliers();
      showAlertMessage('Supplier added successfully!','success');
    } else {
      const errorMessage = await response.text(); // read the response body as text
      console.error('Failed to add supplier:', errorMessage);
      showAlertMessage('Failed to add supplier: ' + errorMessage, 'error');
    }
  } catch (error) {
    console.error('Error adding supplier:', error);
    showAlertMessage('An error occured while adding supplier.', 'error');
  }
}

// function to update existing supplier
export async function updateSupplier() {
  const supplierId = $('#hiddenSupplierId').val();
  const supplierData = {
    supplier_name: $('#supplierName').val(),
    contact_person: $('#contactPerson').val(),
    phone_number: $('#phoneNumber').val(),
    supplier_email: $('#supplierEmail').val(),
    supplier_address: $('#supplierAddress').val()
  };

  try {
    const response = await fetch(`http://localhost:3000/api/inventory/suppliers/${supplierId}`, {
      method: 'PUT',
      headers: { // Corrected headers
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(supplierData),
    });

    if (response.ok) {
      fetchSuppliers();
      showAlertMessage('Supplier updated successfully!', 'success');
    } else {
      showAlertMessage('Failed to update supplier.', 'error');
    }
  } catch (error) {
    console.error('Error updating supplier:', error);
    showAlertMessage('An error occurred while updating the supplier.', 'error');
  }
}

export function fetchSuppliers() {
  $.getJSON('http://localhost:3000/api/inventory/suppliers')
  .done(function (suppliers) {
    localStorage.setItem('inventorySuppliers', JSON.stringify(suppliers));
    displaySuppliers(suppliers);
  })
  .fail(function (error) {
    console.error('Error fetching suppliers:', error);
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

// Search supplier with debouncing
export const debouncedSearchSuppliers = debounce(function searchSupplier() {
  const searchQuery = $('#searchSupplierInput').val().trim().toLowerCase();
  const suppliers = JSON.parse(localStorage.getItem('inventorySuppliers')) || [];

  const filteredSuppliers = suppliers.filter(item =>
    item.supplier_name.toLowerCase().includes(searchQuery)
  );

  currentPage = 1; // Reset to first page for filtered results
  displaySuppliers(filteredSuppliers);
}, 300);

// Display suppliers with pagination
export function displaySuppliers(suppliers) {
  const totalPages = Math.ceil(suppliers.length / supplierPerPage);
  const paginatedSuppliers = paginate(suppliers, currentPage, supplierPerPage);
  const $tableBody = $('#supplierTableBody');
  $tableBody.empty();

  if (paginatedSuppliers.length === 0) {
    $tableBody.html('<tr><td colspan="3" class="mt-4 text-center">No supplier found.</td></tr>');
  } else {
    paginatedSuppliers.forEach(suppliers => {
      const row = `
        <tr>
          <td class="py-4 px-6 text-sm  text-gray-900 text-center">${suppliers.supplier_name}</td>
              <td class="py-4 px-6 text-sm text-gray-500 text-center">${suppliers.contact_person}  </td>
              <td class="py-4 px-6 text-sm text-gray-500 text-center">${suppliers.phone_number}</td>
              <td class="py-4 px-6 text-sm text-gray-500 text-center">${suppliers.supplier_email}</td>
              <td class="py-4 px-6 text-sm text-gray-500 text-center"> ${suppliers.supplier_address}</td>
              <td class="sm:flex py-4 px-6 text-sm">
                <div class="flex items-center justify-center space-x-2">
                  <button data-id="${suppliers.supplier_id}" class="edit-supplier-btn p-2 text-gray-700 hover:text-gray-500">
                      <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button data-id="${suppliers.supplier_id}" class="delete-supplier-btn p-2 text-red-700 hover:text-red-500">
                      <i class="fa-solid fa-trash-can" style="color: #f84444;"></i>
                  </button>
                 </div> 
              </td>
        </tr>`;
      $tableBody.append(row);
    });
      // Attach event listeners for edit buttons
      $('.edit-supplier-btn').on('click', function () {
        const supplierId = $(this).data('id');
        const supplier = suppliers.find(p => p.supplier_id === supplierId);
        if (supplier) {
          openEditSupplierModal(supplier);
        }
      });

    setupPaginationControls(totalPages, () => displaySuppliers(suppliers));
  }
}

// Pagination function to get supplier for the current page
function paginate(suppliers, page, suppliersPerPage) {
  const start = (page - 1) * suppliersPerPage;
  const end = start + suppliersPerPage;
  return suppliers.slice(start, end);
}

// Setup pagination controls
function setupPaginationControls(totalPages, fetchSupplierCallback) {
  const $paginationControls = $('#supplierPaginationControls');
  $paginationControls.empty(); // Clear existing buttons

  // Previous Button
  const supplierPrevButton = $('<button>', {
    text: 'Previous',
    class: `px-4 py-2 rounded bg-gray-300 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`,
    disabled: currentPage === 1
  }).on('click', function () {
    if (currentPage > 1) {
      currentPage--;
      fetchSupplierCallback();
    }
  });
  $paginationControls.append(supplierPrevButton);

  // Page Number Buttons
  for (let page = 1; page <= totalPages; page++) {
    const supplierPageButton = $('<button>', {
      text: page,
      class: `px-4 py-2 rounded ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300'}`
    }).on('click', function () {
      currentPage = page;
      fetchSupplierCallback();
    });
    $paginationControls.append(supplierPageButton);
  }

  // Next Button
  const suppliertNextButton = $('<button>', {
    text: 'Next',
    class: `px-4 py-2 rounded bg-gray-300 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`,
    disabled: currentPage === totalPages
  }).on('click', function () {
    if (currentPage < totalPages) {
      currentPage++;
      fetchSupplierCallback();
    }
  });
  $paginationControls.append(suppliertNextButton);
}

export function attachSupplierEventListeners() {
  // Edit Buttons
  $(document).on('click', '.edit-supplier-btn', function () {
    const supplierId = $(this).data('id'); // This should be a number or string ID
    const suppliers = JSON.parse(localStorage.getItem('inventorySuppliers')) || [];
    const supplierToEdit = suppliers.find(supplier => supplier.supplier_id === Number(supplierId));

    if (supplierToEdit) {
      // Pass each property individually to avoid sending an object
      openEditSupplierModal(
        supplierToEdit.supplier_id, // Fix from supplierToEdit.supplierId
        supplierToEdit.supplier_name, 
        supplierToEdit.contact_person, 
        supplierToEdit.phone_number, 
        supplierToEdit.supplier_email, 
        supplierToEdit.supplier_address
      );
    } else {
      console.error('Supplier not found:', supplierId);
    }
  });

  // Delete Buttons
  $(document).on('click', '.delete-supplier-btn',  deleteSupplier);
}

export function deleteSupplier(event) {
  const supplierId = $(event.target).closest('button').data('id');
  if (!supplierId) {
    console.error('No Supplier ID found to delete');
    return;
  }

  alertify.confirm("Are you sure you want to delete this supplier?",
  function() {
    $.ajax({
      url: `http://localhost:3000/api/inventory/suppliers/${supplierId}`,
      method: 'DELETE',
      success: function(response) {
        console.log('Supplier deleted successfuly.');

        showAlertMessage('Supplier deleted successfully', 'danger');

        fetchSuppliers();
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error('Error deleting supplier', textStatus, errorThorn);
      }
    });
  },
  function() {
    alertify.error('Deleting canceled.');
  }
  );
}


function openEditSupplierModal(supplierId, supplierName, contactPerson, phoneNumber, supplierEmail, supplierAddress) {

  if (!supplierId) {
    console.error('Error: supplierId is undefined or null.');
    return; // Exit the function if supplierId is invalid
  }
  const $supplierForm = $('#supplierForm');
  $supplierForm.attr('data-mode', 'edit');
  $('#hiddenSupplierId').val(String(supplierId));

  $('#supplierName').val(supplierName);
  $('#contactPerson').val(contactPerson);
  $('#phoneNumber').val(phoneNumber);
  $('#supplierEmail').val(supplierEmail);
  $('#supplierAddress').val(supplierAddress);

  $('#supplierModalTitle').text('Edit Supplier');
  $('#supplierSubmitButton').text('Update');
  

  $('#supplierModal').removeClass('hidden');
}

export function showAlertMessage(message, type) {
 
  if (type === 'success') {
    alertify.success(message);  // Success alert
} else if (type === 'error') {
    alertify.error(message);  // Error alert
} else if (type === 'warning') {
    alertify.warning(message);  // Warning alert
} else if (type === 'danger') {
    alertify.error(message);  // Using error for danger in Alertify
} else if (type === 'message') {
    alertify.message(message);  // General message alert
}

alertify.set('notifier', 'position', 'top-right');  // Set position of notifications
alertify.set('notifier', 'delay', 3); 
}