import abstractView from "./abstractView.js";

import { addSupplier,updateSupplier, fetchSuppliers, debouncedSearchSuppliers, attachSupplierEventListeners } from "../utils/supplierUtils.js";

export default class Suppliers extends abstractView {
  constructor() {
    super();
    this.setTitle("Suppliers");
  }

  async getHtml() {
    return `
<div id="suppliersSection" class="">
    <h1 class="text-3xl mb-4 font-bold">Supplier</h1>
  
        <!-- Add Supplier Button -->
        <div class="flex w-full justify-between items-center">
       
          <div>
               <button id="addSupplierButton" class="mb-4 bg-blue-500 text-white px-4 py-2 rounded">Add Supplier</button>
          </div>
         
         <!-- Search Bar with Button -->
         <div class="flex mb-2 items-center space-x-0 border-2 border-gray-300 bg-white h-10 rounded-lg w-64">
          <input
              id="searchSupplierInput"
              class="h-full pl-2 rounded-lg text-sm focus:outline-none w-full"
              type="search" name="search" placeholder="Search">
          <button id="searchSupplierButton" type="button" class="bg-blue-500 text-white px-4 py-2 h-full rounded-r-lg">
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
                    <th class="py-2 px-6 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier Name</th>
                    <th class="py-2 px-6 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Person</th>
                    <th class="py-2 px-6 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                    <th class="py-2 px-6 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th class="py-2 px-6 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                    <th class="py-2 px-6 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
            </thead>
            <tbody id="supplierTableBody" class="bg-white divide-y divide-gray-200"></tbody>
        </table>
    </div>
    <div id="supplierPaginationControls" class="pagination-controls flex justify-center space-x-4 mt-4">
      <button id="supplierPrevPageButton" class="rounded  px-4 py-2 bg-gray-300" disabled>Previous</button>
      <div id="supplierPageButtons" class="flex space-x-2"></div> <!-- Page buttons will go here -->
      <button id="supplierNextPageButton" class="rounded  px-4 py-2 bg-gray-300">Next</button>
    </div>
  
          <!-- Reusable Item Modal for Add and Edit -->
  <div id="supplierModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center hidden">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
        <h2 id="supplierModalTitle" class="text-2xl font-bold mb-4">Add Supplier</h2>
        <form id="supplierForm">
            <!-- Hidden input to store item ID when editing -->
            <input type="hidden" id="hiddenSupplierId" name="hiddenSupplierId">
            
            <div class="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-12">
                <!-- Supplier Name -->
                <div class="sm:col-span-5">
                    <label for="supplierName" class="block text-gray-700">Supplier Name</label>
                    <input type="text" id="supplierName" name="supplierName" class="w-full border border-gray-300 rounded px-4 py-2" required>
                </div>
  
                <!-- Contact Person -->
                <div class="sm:col-span-4">
                    <label for="contactPerson" class="block text-gray-700">Contact Person</label>
                    <input type="text" id="contactPerson" name="contactPerson" class="w-full border border-gray-300 rounded px-4 py-2" required>
                </div>
  
                <!-- Phone Number -->
                <div class="sm:col-span-3">
                    <label for="phoneNumber" class="block text-gray-700">Phone Number</label>
                    <input type="number" id="phoneNumber" name="phoneNumber" class="w-full border border-gray-300 rounded px-4 py-2" >
                </div>
            </div>
  
            <div class="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-12">
                <!-- Email -->
                <div  class="sm:col-span-6">
                    <label for="supplierEmail" class="block text-gray-700">Email</label>
                    <input type="email" id="supplierEmail" name="supplierEmail" class="w-full border border-gray-300 rounded px-4 py-2" required>
                </div>
  
                <!-- Selling Price -->
                <div class=" mb-4 sm:col-span-6">
                    <label for="supplierAddress" class="block text-gray-700">Address</label>
                    <input type="text" id="supplierAddress" name="supplierAddress" class="w-full border border-gray-300 rounded px-4 py-2" required>
                </div>
           </div>
            <div class="flex justify-end">
                <button type="button" id="supplierCancelButton" class="bg-gray-500 text-white px-4 py-2 rounded mr-2">Cancel</button>
                <button type="submit" id="supplierSubmitButton" class="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
            </div>
        </form>
    </div>
  </div>
  
    
  </div>

    `;
  }
}

  function openAddSupplierModal() {
    const $supplierForm = $('#supplierForm');

  // Explicitly set form to 'add' mode every time the add button is   clicked
     $supplierForm.attr('data-mode', 'add');

    // Clear the input fields
    $('#supplierName').val('');
    $('#contactPerson').val('');
    $('#phoneNumber').val('');
    $('#supplierEmail').val('');
    $('#supplierAddress').val('');


    //update modal title and button text fo add
    $('#supplierModalTitle').text('Add Supplier');
    $('#supplierSubmitButton').text('Add');

    $('#supplierModal').removeClass('hidden');
  }

  function closeSupplierModal(){
    $('#supplierForm')[0].reset(); // clear form
    $('#supplierModal').addClass('hidden'); // hide the modal

    $('#hiddenSupplierId').val(''); // Reset hidden field
  }


  // Initialize event listeners and fetch data when document is ready

  $(document).ready(function() {
    //Initial data fetch
    fetchSuppliers();

    attachSupplierEventListeners(); // ensure this is called to set up all product-related event listeners

    $('#searchSupplierInput').on('input', debouncedSearchSuppliers);
    $('#addSupplierButton').on('click', openAddSupplierModal);
    $('#supplierForm').on('submit', handleSupplierFormSubmit);

    // Close modal event listener
    $('#supplierCancelButton').on('click', closeSupplierModal);
  });


  async function handleSupplierFormSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    const formMode = $('#supplierForm').data('mode');

    try{
        if(formMode === 'add') {
            await addSupplier(); // wait for the supplier to be added
        } else if (formMode === 'edit') {
            await updateSupplier(); // wait for the supplier to be updated
        }
        closeSupplierModal(); // only close the modal if the operation was successful
    } catch (error) {
        console.error('Error handling supplier form subbmission:', error);
        showAlertMessage('Ann error occured while processing your request.', 'error') //Show error message
    }
  }



