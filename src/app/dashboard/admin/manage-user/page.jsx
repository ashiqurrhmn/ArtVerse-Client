"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Shield,
  User,
  Paintbrush,
  ChevronDown,
  Filter,
  Download,
} from "lucide-react";
import toast from "react-hot-toast";
import { Modal, Button, Skeleton } from "@heroui/react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getUsers, updateUserRole, deleteUser } from "@/lib/api/admin";

const AdminManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterRole, setFilterRole] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterRole]);

  const [isOpen, setIsOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const getRoleLabel = () => {
    switch (filterRole) {
      case "buyer":
        return "Role: Buyer";
      case "artist":
        return "Role: Artist";
      case "admin":
        return "Role: Admin";
      default:
        return "All Roles";
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    const loadingToast = toast.loading("Updating role...");
    try {
      await updateUserRole(userId, newRole);

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)),
      );
      toast.success(`Role changed to ${newRole}`, { id: loadingToast });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user role", { id: loadingToast });
    }
  };

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setIsOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    const loadingToast = toast.loading("Deleting user...");
    try {
      await deleteUser(userToDelete._id);

      setUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));
      toast.success("User deleted successfully", { id: loadingToast });
      setIsOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user", { id: loadingToast });
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.profileName || user.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    const rawRole = user.role || "buyer";
    const userRole = rawRole === "user" ? "buyer" : rawRole;
    
    const matchesRole = filterRole === "all" || userRole === filterRole;
    return matchesSearch && matchesRole;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getRoleIcon = (role) => {
    const normalizedRole = role === "user" || !role ? "buyer" : role;
    switch (normalizedRole) {
      case "admin":
        return <Shield className="w-4 h-4 text-primary" />;
      case "artist":
        return <Paintbrush className="w-4 h-4 text-secondary" />;
      case "buyer":
        return <User className="w-4 h-4 text-muted-foreground" />;
      default:
        return <User className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getRoleBadgeColor = (role) => {
    const normalizedRole = role === "user" || !role ? "buyer" : role;
    switch (normalizedRole) {
      case "admin":
        return "bg-primary/10 text-primary border-primary/20";
      case "artist":
        return "bg-secondary/10 text-secondary border-secondary/20";
      case "buyer":
        return "bg-muted/30 text-muted-foreground border-separator";
      default:
        return "bg-muted/30 text-muted-foreground border-separator";
    }
  };

  const getUserInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  const handleExport = () => {
    try {
      const doc = new jsPDF();

      doc.setFontSize(20);
      doc.setTextColor(41, 128, 185);
      doc.text("ArtVerse", 14, 22);

      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Manage Users`, 14, 30);
      doc.text(
        `Generated on: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}`,
        14,
        36,
      );

      const tableColumn = ["User Name", "Email", "Role", "Status"];
      const tableRows = [];

      filteredUsers.forEach((user) => {
        const rowData = [
          user.profileName || user.name || "Unknown",
          user.email,
          user.role === "user" || !user.role ? "buyer" : user.role,
          "Active",
        ];
        tableRows.push(rowData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        theme: "striped",
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [41, 128, 185] },
      });

      doc.save(`users_${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("Exported to PDF successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export PDF");
    }
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Manage Users
          </h1>
          <p className="text-muted-foreground mt-1">
            View, update roles, and manage system access for all users.
          </p>
        </div>

        {/* Search / Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 mt-4 md:mt-0 w-full md:w-auto flex-1 md:justify-end">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-separator bg-background pl-9 pr-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full sm:w-auto flex items-center justify-between gap-2 pl-4 pr-3 py-2.5 bg-background border border-separator rounded-xl text-sm font-semibold text-foreground hover:bg-muted/10 transition-colors shadow-sm cursor-pointer outline-none focus:border-primary focus:ring-1 focus:ring-primary min-w-[170px]"
              >
                <span>{getRoleLabel()}</span>
                <Filter className="w-4 h-4 text-muted-foreground" />
              </button>

              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-full min-w-[170px] bg-background border border-separator rounded-xl shadow-xl overflow-hidden z-50 py-1"
                  >
                    {[
                      { value: "all", label: "All Roles" },
                      { value: "buyer", label: "Role: Buyer" },
                      { value: "artist", label: "Role: Artist" },
                      { value: "admin", label: "Role: Admin" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setFilterRole(option.value);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-muted/20 ${
                          filterRole === option.value
                            ? "font-bold text-primary bg-primary/5"
                            : "text-foreground font-medium"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </div>

            <button
              onClick={handleExport}
              disabled={filteredUsers.length === 0}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg border border-separator bg-background px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-accent/40 text-foreground disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
            >
              <Download className="size-4" />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-background border border-separator rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto md:overflow-visible">
          <table className="w-full text-left border-collapse block md:table">
            <thead className="hidden md:table-header-group">
              <tr className="bg-muted/20 border-b border-separator text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Current Role</th>
                <th className="px-6 py-4">Change Role</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-separator block md:table-row-group">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr
                    key={`skeleton-${idx}`}
                    className="block md:table-row border-b border-separator/30 p-4 md:p-0"
                  >
                    <td className="block md:table-cell px-2 py-3 md:px-6 md:py-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-12 h-12 md:w-10 md:h-10 rounded-full shrink-0" />
                        <div className="flex-1 space-y-2 min-w-0">
                          <Skeleton className="h-4 w-32 rounded-lg" />
                          <Skeleton className="h-3 w-40 rounded-lg" />
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-2 py-3 md:px-6 md:py-4">
                      <Skeleton className="h-6 w-16 rounded-md" />
                    </td>
                    <td className="hidden md:table-cell px-2 py-3 md:px-6 md:py-4">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </td>
                    <td className="hidden md:table-cell px-2 py-3 md:px-6 md:py-4">
                      <Skeleton className="h-9 w-full max-w-[120px] rounded-lg" />
                    </td>
                    <td className="hidden md:table-cell px-2 py-3 md:px-6 md:py-4 md:text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="w-8 h-8 rounded-lg" />
                        <Skeleton className="w-8 h-8 rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <tr
                    key={user._id || user.id}
                    className="block md:table-row hover:bg-muted/10 transition-colors group p-4 md:p-0"
                  >
                    <td className="block md:table-cell px-2 py-3 md:px-6 md:py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          {user.profileImage || user.image || user.avatar ? (
                            <img
                              src={
                                user.profileImage || user.image || user.avatar
                              }
                              alt={user.profileName || user.name}
                              className="w-12 h-12 md:w-10 md:h-10 rounded-full object-cover border-2 border-background shadow-sm"
                            />
                          ) : (
                            <div className="w-12 h-12 md:w-10 md:h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg border-2 border-background shadow-sm">
                              {getUserInitial(user.profileName || user.name)}
                            </div>
                          )}
                          <div
                            className={`absolute bottom-0 right-0 w-3 h-3 md:w-2.5 md:h-2.5 rounded-full border-2 border-background bg-primary`}
                          ></div>
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-foreground text-base md:text-sm truncate">
                            {user.profileName || user.name || "Unknown"}
                          </div>
                          <div className="text-sm text-muted-foreground truncate">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="flex items-center justify-between md:table-cell px-2 py-3 md:px-6 md:py-4 border-t border-separator/30 md:border-none mt-2 md:mt-0 pt-4 md:pt-4">
                      <span className="md:hidden text-xs font-semibold text-muted-foreground uppercase">
                        Status
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border bg-primary/10 text-primary border-primary/20`}
                      >
                        Active
                      </span>
                    </td>
                    <td className="flex items-center justify-between md:table-cell px-2 py-3 md:px-6 md:py-4">
                      <span className="md:hidden text-xs font-semibold text-muted-foreground uppercase">
                        Current Role
                      </span>
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(user.role)}`}
                      >
                        {getRoleIcon(user.role)}
                        <span className="capitalize">
                          {user.role === "user" || !user.role ? "buyer" : user.role}
                        </span>
                      </div>
                    </td>
                    <td className="flex items-center justify-between md:table-cell px-2 py-3 md:px-6 md:py-4">
                      <span className="md:hidden text-xs font-semibold text-muted-foreground uppercase">
                        Change Role
                      </span>
                      <div className="relative w-32 md:w-full md:max-w-[140px]">
                        <select
                          className="appearance-none bg-background border border-separator text-foreground text-sm rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary block w-full p-2 pr-8 cursor-pointer hover:bg-muted/10 transition-colors outline-none shadow-sm"
                          value={user.role === "user" || !user.role ? "buyer" : user.role}
                          onChange={(e) =>
                            handleRoleChange(user._id, e.target.value)
                          }
                        >
                          <option
                            value="buyer"
                            className="bg-background text-foreground"
                          >
                            Buyer
                          </option>
                          <option
                            value="artist"
                            className="bg-background text-foreground"
                          >
                            Artist
                          </option>
                          <option
                            value="admin"
                            className="bg-background text-foreground"
                          >
                            Admin
                          </option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </td>
                    <td className="flex items-center justify-between md:table-cell px-2 py-3 md:px-6 md:py-4 md:text-right">
                      <span className="md:hidden text-xs font-semibold text-muted-foreground uppercase">
                        Actions
                      </span>
                      <div className="flex items-center justify-end gap-1 opacity-100 transition-opacity">
                        <button
                          onClick={() => confirmDelete(user)}
                          className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-muted-foreground block md:table-cell"
                  >
                    No users found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-muted/10 border-t border-separator px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {filteredUsers.length > 0 ? startIndex + 1 : 0}
            </span>{" "}
            to{" "}
            <span className="font-medium text-foreground">
              {Math.min(startIndex + itemsPerPage, filteredUsers.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {filteredUsers.length}
            </span>{" "}
            users
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || filteredUsers.length === 0}
              className="px-3 py-1.5 text-sm font-medium text-foreground bg-background border border-separator rounded-lg hover:bg-muted/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              Previous
            </button>

            <div className="hidden sm:flex gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                // Show first, last, current, and adjacent pages
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-foreground bg-background border border-separator hover:bg-muted/20"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === currentPage - 2 ||
                  pageNum === currentPage + 2
                ) {
                  return (
                    <span
                      key={pageNum}
                      className="px-2 py-1.5 text-muted-foreground"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={
                currentPage === totalPages || filteredUsers.length === 0
              }
              className="px-3 py-1.5 text-sm font-medium text-foreground bg-background border border-separator rounded-lg hover:bg-muted/20 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <Modal.Backdrop className="bg-black/50 backdrop-blur-sm">
          <Modal.Container placement="center">
            <Modal.Dialog className="bg-background border border-separator shadow-2xl rounded-3xl p-4 md:p-6 text-foreground max-w-sm w-full mx-auto">
              <Modal.Header className="flex flex-col items-center justify-center pt-4 pb-2">
                <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 shadow-sm">
                  <Trash2 className="w-6 h-6 text-red-500" strokeWidth={1.5} />
                </div>
                <Modal.Heading className="text-xl font-bold text-foreground">
                  Delete User
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body className="text-center px-4 py-0">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Are you sure you want to delete the user{" "}
                  <strong>
                    {userToDelete?.profileName ||
                      userToDelete?.name ||
                      "this user"}
                  </strong>
                  ? This action is permanent and cannot be undone.
                </p>
              </Modal.Body>
              <Modal.Footer className="flex flex-row justify-center gap-3 pt-8 pb-2">
                <Button
                  variant="bordered"
                  onPress={() => setIsOpen(false)}
                  className="flex-1 font-semibold border border-separator text-foreground bg-transparent hover:bg-muted/30 rounded-2xl py-6 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={() => handleDeleteUser()}
                  className="flex-1 font-semibold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 rounded-2xl py-6 border border-transparent transition-colors"
                >
                  Yes, Delete
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
};

export default AdminManageUsers;
