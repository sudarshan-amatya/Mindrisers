export default function Header({SetSearch}) {
  return (
    <header className="w-full border-b bg-white pb-2">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid h-16 grid-cols-3 items-center">
          {/* Left: Logo */}
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-900">ShopMate</span>
          </div>

          {/* Center: Search */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <input
                onChange={(e)=>{
                    SetSearch(e.target.value)
                }}      
                type="text"
                placeholder="Search products..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
          </div>

          {/* Right: Links */}
          <nav className="flex items-center justify-end gap-6 text-sm font-medium text-gray-700">
            <a href="#" className="hover:text-gray-900">Categories</a>
            <a href="#" className="hover:text-gray-900">Orders</a>
            <a href="#" className="hover:text-gray-900">Account</a>
            <a href="#" className="rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800">
              Cart
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
