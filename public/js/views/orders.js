import abstractView from "./abstractView.js";

import {fetchOrder,
  debouncedSearchOrders,
  displayOrders,


} from '../utils/orderUtils.js'

export default class Products extends abstractView {
  constructor() {
    super();
    this.setTitle("Products");
  }

  async getHtml() {
    return `
<div id="ordersSection" class="">
    <h1 class="text-3xl mb-4 font-bold">Orders</h1>
 
      <!-- Add Orders Button -->
      <div class="flex w-full justify-between items-center">
      
       <div>
            <button id="addOrderButton" class="mb-4 bg-blue-500 text-white px-4 py-2 rounded">Create Order</button>
       </div>
      
      <!-- Search Bar with Button -->
      <div class="flex mb-2 items-center space-x-0 border-2 border-gray-300 bg-white h-10 rounded-lg w-64">
       <input
           id="searchOrderInput"
           class="h-full pl-2 rounded-lg text-sm focus:outline-none w-full"
           type="search" name="search" placeholder="Search">
       <button id="searchOrderButton" type="button" class="bg-blue-500 text-white px-4 py-2 h-full rounded-r-lg">
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
                 <th class="py-2 px-6 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                 <th class="py-2 px-6 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                 <th class="py-2 px-6 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                 <th class="py-2 px-6 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                 <th class="py-2 px-6 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                 <th class="py-2 px-6 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
             </tr>
         </thead>
         <tbody id="ordersTableBody" class="bg-white divide-y divide-gray-200"></tbody>
     </table>
 </div>
 
     <div id="orderPaginationControls" class="pagination-controls flex justify-center space-x-4 mt-4">
         <button id="ordersPrevPageButton" class="rounded  px-4 py-2 bg-gray-300" disabled>Previous</button>
         <div id="ordersPageButtons" class="flex space-x-2"></div> <!-- Page buttons will go here -->
         <button id="ordersNextPageButton" class="rounded  px-4 py-2 bg-gray-300">Next</button>
     </div>
 
           <!-- Reusable Item Modal for Add and Edit -->
  <div id="orderModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center hidden">
     <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
       <h2 id="orderModalTitle" class="text-2xl font-bold mb-4">Create Order</h2>
       <form id="orderForm">
         <!-- Hidden input to store order ID when editing -->
         <input type="hidden" id="hiddenOrderId" name="hiddenOrderId">
         
         <div class="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-12">
           <!-- Customer Name -->
           <div class="sm:col-span-5">
             <label for="customerName" class="block text-gray-700">Customer Name</label>
             <input type="text" id="customerName" name="customerName" class="w-full border border-gray-300 rounded px-4 py-2" required>
           </div>
   
           <!-- Order Date -->
           <div class="sm:col-span-4">
             <label for="orderDate" class="block text-gray-700">Order Date</label>
             <input type="date" id="orderDate" name="orderDate" class="w-full border border-gray-300 rounded px-4 py-2" required>
           </div>
   
           <!-- Status -->
           <div class="sm:col-span-3">
             <label for="status" class="block text-gray-700">Status</label>
             <select id="status" name="status" class="w-full border border-gray-300 rounded px-4 py-2">
               <option value="">Select a status</option>
               <option value="pending">Pending</option>
               <option value="completed">Completed</option>
               <!-- Add more statuses as needed -->
             </select>
           </div>
         </div>
   
         <!-- Product and Order Details -->
         
         <div class="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-12">
           <div class="sm:col-span-5">
             <label for="productList" class="block text-gray-700">Product List</label>
             <select id="productList" name="productList" class="product_list w-full border border-gray-300 rounded px-4 py-2">
               <option value="">Select Products</option>
               <!-- Dynamically populate the product options -->
             </select>
           </div>
   
           <div class="sm:col-span-4">
             <label for="quantity" class="block text-gray-700">Quantity</label>
             <input type="number" id="quantity" name="order_quantity" class="quantity w-full border border-gray-300 rounded px-4 py-2" required>
           </div>
   
           <div class="sm:col-span-3">
             <label for="orderPrice" class="block text-gray-700">Price</label>
             <input type="number" id="orderPrice" name="orderPrice" class="product_price w-full border border-gray-300 rounded px-4 py-2" required>
           </div>
         </div>
      
         <!-- Action Buttons -->
         <div class="flex justify-end">
           <button type="button" id="orderCancelButton" class="bg-gray-500 text-white px-4 py-2 rounded mr-2">Cancel</button>
           <button type="submit" id="orderSubmitButton" class="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
         </div>
       </form>
     </div>
   </div>
   
 
 </div>

    `;
  }
}


function openAddOrderModal() {
  const $orderForm = $('#orderForm');
  $orderForm.attr('data-mode', 'add');

  $('#customerName').val('');
  $('#orderDate').val('');
  $('#status').val('');
  $('#quantity').val('');
  $('#orderPrice').val('');

  $('#orderModalTitle').text('Create Order');
  $('#orderSubmitButton').text('Create');

  $('#orderModal').removeClass('hidden');
}

function closeOrderModal() {
  $('#orderForm')[0].reset();
  $('#orderModal').addClass('hidden');

  $('#hiddenOrderId').val('');
}


$(document).ready(function() {
  fetchOrder();

  $('#searchOrderInput').on('input', debouncedSearchOrders);
  $('#addOrderButton').on('click', openAddOrderModal);
  $('#orderForm').on('submit', handleOrderFormSubmit);

  $('#orderCancelButton').on('click', closeOrderModal);
});

async function handleOrderFormSubmit(event) {
  event.preventDefault(); // Prevent default form submission
  const formMode = $('#orderForm').data('mode');

  try {
    if (formMode === 'add') {
      await addOrder(); // Wait for the order to be added
    } else if (formMode === 'edit') {
      await updateOrder(); // Wait for the order to be updated
    }
    closeOrderModal(); // Only close the modal if the operation was successful
  } catch (error) {
    console.error('Error handling order form submission:', error);
    showAlertMessage('An error occurred while processing your request.', 'error'); // Show error message
  }
}


