let currentPage = 1;
const ordersPerPage = 6;

export async function createOrder() {
  const orderData = {
    customer_name: $("#customerName").val().trim(),
    order_date: $("#orderDate").val().trim(),
    status: $("#status").val().trim(),
    quantity: $("#quantity").val().trim(),
    product_id: $("#productList").val().trim(),
    price: $("#orderPrice").val().trim(),
  };

  try {
    const response = await fetch(`http://localhost:3000/api/inventory/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (response.ok) {
      fetchOrder();
      showAlertMessage("Order added successfully!", "success");
    } else {
      const errorMessage = await response.text();

      console.error("Failed to add product:", errorMessage);
      showAlertMessage("Failed to create order: " + errorMessage, "error");
    }
  } catch (error) {
    console.error("Error creating order:", error);
    showAlertMessage("An error occured while creating the order.", "error");
  }
}

export function fetchOrder() {
  $.getJSON("http://localhost:3000/api/inventory/orders")
    .done(function (orders) {
      localStorage.setItem("inventoryOrders", JSON.stringify(orders));
      displayOrders(orders);
    })
    .fail(function (error) {
      console.error("Error fetching orders:", error);
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

// Search orders with debouncing
export const debouncedSearchOrders = debounce(function searchOrders() {
  const searchQuery = $("#searchOrderInput").val().trim().toLowerCase();
  const orders = JSON.parse(localStorage.getItem("inventoryOrders")) || [];

  const filteredOrders = orders.filter((item) =>
    item.customer_name.toLowerCase().includes(searchQuery)
  );

  currentPage = 1; // Reset to first page for filtered results
  displayOrders(filteredOrders);
}, 300);

export function displayOrders(orders) {
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const paginatedOrders = paginate(orders, currentPage, ordersPerPage);
  const $tableBody = $("#ordersTableBody");
  $tableBody.empty();

  if (paginatedOrders.length === 0) {
    $tableBody.html(
      '<tr><td colspan="3" class="mt-4 text-center">No order found.</td></tr>'
    );
  } else {
    paginatedOrders.forEach((order) => {
      const row = `
        <tr>
          <td class="py-4 px-6 text-sm text-gray-500 text-center">${
            order.customer_name
          }</td>
                    <td class="py-4 px-6 text-sm text-gray-900 text-center">${new Date(
                      order.order_date
                    ).toLocaleDateString()}</td>
                    <td class="py-4 px-6 text-sm text-gray-500 text-center">${
                      order.status
                    }</td>
                    <td class="py-4 px-6 text-sm text-gray-500 text-center">&#8369; ${
                      order.total_amount
                    }</td>
                    
                    <td class="py-4 px-6 text-sm">
                      <div class="flex items-center justify-center space-x-2">
                        <button data-id="${
                          order.order_id
                        }" class="edit-order-btn p-2 text-gray-700 hover:text-gray-500">
                          <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button data-id="${
                          order.order_id
                        }" class="delete-order-btn p-2 text-red-700 hover:text-red-500">
                          <i class="fa-solid fa-trash-can" style="color: #f84444;"></i>
                        </button>
                      </div>
                    </td>

                    <td class="py-4 px-6 text-sm text-gray-500">
                      <div class="flex items-center justify-center space-x-2">
                        <a  href="#" id="viewDetailsButton" data-id="${
                          order.order_id
                        }" class="viewDetailsButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded">
                          View
                        </a>
                      </div>
                    </td>
        </tr>`;
      $tableBody.append(row);
    });
    // Attach event listeners for edit buttons
    $(".edit-order-btn").on("click", function () {
      const orderId = $(this).data("id");
      const order = orders.find((p) => p.order_id === orderId);
      if (order) {
        openEditOrderModal(order);
      }
    });

    setupPaginationControls(totalPages, () => displayOrders(orders));
  }
}

// Pagination helper function
function paginate(orders, page, ordersPerPage) {
  const start = (page - 1) * ordersPerPage;
  const end = start + ordersPerPage;
  return orders.slice(start, end);
}

// Setup pagination controls
function setupPaginationControls(totalPages, fetchOrdersCallback) {
  const $paginationControls = $("#orderPaginationControls");
  $paginationControls.empty(); // Clear existing buttons

  // Previous Button
  const orderPrevButton = $("<button>", {
    text: "Previous",
    class: `px-4 py-2 rounded bg-gray-300 ${
      currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
    }`,
    disabled: currentPage === 1,
  }).on("click", function () {
    if (currentPage > 1) {
      currentPage--;
      fetchOrdersCallback();
    }
  });
  $paginationControls.append(orderPrevButton);

  // Page Number Buttons
  for (let page = 1; page <= totalPages; page++) {
    const orderPageButton = $("<button>", {
      text: page,
      class: `px-4 py-2 rounded ${
        page === currentPage ? "bg-blue-500 text-white" : "bg-gray-300"
      }`,
    }).on("click", function () {
      currentPage = page;
      fetchOrdersCallback();
    });
    $paginationControls.append(orderPageButton);
  }

  // Next Button
  const orderNextButton = $("<button>", {
    text: "Next",
    class: `px-4 py-2 rounded bg-gray-300 ${
      currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
    }`,
    disabled: currentPage === totalPages,
  }).on("click", function () {
    if (currentPage < totalPages) {
      currentPage++;
      fetchOrdersCallback();
    }
  });
  $paginationControls.append(orderNextButton);
}
