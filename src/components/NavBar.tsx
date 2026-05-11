import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <span className="font-bold text-gray-900 tracking-tight text-lg">
        AXI<span className="text-indigo-600">PAYS</span>
      </span>

      <div className="flex gap-2 text-sm font-medium">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `px-3 py-1.5 rounded-lg transition ${
              isActive
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`
          }
        >
          Checkout
        </NavLink>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `px-3 py-1.5 rounded-lg transition ${
              isActive
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`
          }
        >
          Dashboard
        </NavLink>
      </div>
    </nav>
  );
}
