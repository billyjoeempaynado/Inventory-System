import abstractView from "./abstractView.js";

export default class Dashboard extends abstractView {
  constructor() {
    super();
    this.setTitle("Dashboard");
  }

  async getHtml() {
    return `
            <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
              <!-- Items Section -->
              <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
                <div class="flex justify-between mb-6">
                  <div>
                    <div class="flex items-center mb-1">
                      <div id="itemCount" class="text-2xl font-semibold">Loading...</div>
                    </div>
                    <div class="text-sm font-medium text-gray-400">Items</div>
                  </div>
                  <i class="fa-solid fa-list text-4xl"></i>
                </div>
                <a href="#" id="itemsViewButton" class="text-[#f84525] font-medium text-sm hover:text-red-800">View</a>
              </div>
        
              <!-- Products Section -->
              <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
                <div class="flex justify-between mb-4">
                  <div>
                    <div class="flex items-center mb-1">
                      <div id="productCount" class="text-2xl font-semibold">Loading...</div>
                    </div>
                    <div class="text-sm font-medium text-gray-400">Products</div>
                  </div>
                  <i class="fa-solid fa-boxes-stacked text-4xl"></i>
                </div>
                <a href="#" id="productsViewButton" class="text-[#f84525] font-medium text-sm hover:text-red-800">View</a>
              </div>
            </div>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-1  mb-6">
                <div class="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md lg:col-span-2">
                    <div class="flex justify-between mb-4 items-start">
                        <div class="font-medium">Order Statistics</div>
                         
                        
                    </div>
    `;
  }
}
