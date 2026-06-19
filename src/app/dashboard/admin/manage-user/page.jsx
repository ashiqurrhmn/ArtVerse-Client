"use client";
import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Edit2, Trash2, Shield, User, Paintbrush, ChevronDown, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal, Button, Skeleton } from "@heroui/react";

const AdminManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterRole, setFilterRole] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    
    const [isOpen, setIsOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/users');
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
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
            const res = await fetch(`http://localhost:5000/api/users/${userId}/role`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole })
            });
            
            if (!res.ok) throw new Error("Failed to update role");
            
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
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
            const res = await fetch(`http://localhost:5000/api/users/${userToDelete._id}`, {
                method: 'DELETE',
            });
            
            if (!res.ok) throw new Error("Failed to delete user");
            
            setUsers(prev => prev.filter(u => u._id !== userToDelete._id));
            toast.success("User deleted successfully", { id: loadingToast });
            setIsOpen(false);
            setUserToDelete(null);
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete user", { id: loadingToast });
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = (user.profileName || user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                              (user.email || '').toLowerCase().includes(searchQuery.toLowerCase());
        const userRole = user.role || 'user';
        const matchesRole = filterRole === 'all' || userRole === filterRole;
        return matchesSearch && matchesRole;
    });

    const getRoleIcon = (role) => {
        switch (role || 'user') {
            case 'admin': return <Shield className="w-4 h-4 text-primary" />;
            case 'artist': return <Paintbrush className="w-4 h-4 text-secondary" />;
            case 'user': return <User className="w-4 h-4 text-muted-foreground" />;
            default: return <User className="w-4 h-4 text-muted-foreground" />;
        }
    };

    const getRoleBadgeColor = (role) => {
        switch (role || 'user') {
            case 'admin': return "bg-primary/10 text-primary border-primary/20";
            case 'artist': return "bg-secondary/10 text-secondary border-secondary/20";
            case 'user': return "bg-muted/30 text-muted-foreground border-separator";
            default: return "bg-muted/30 text-muted-foreground border-separator";
        }
    };

    const getUserInitial = (name) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Manage Users</h1>
                    <p className="text-muted-foreground mt-1">View, update roles, and manage system access for all users.</p>
                </div>
                
                {/* Search / Action Bar */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative group w-full sm:w-auto">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search users..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-background border border-separator rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none w-full sm:w-64 text-sm text-foreground placeholder-muted-foreground shadow-sm"
                        />
                    </div>

                    <div className="relative w-full sm:w-auto">
                        <select 
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="appearance-none bg-background border border-separator text-foreground text-sm rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary block w-full py-2.5 pl-4 pr-10 cursor-pointer hover:bg-muted/10 transition-colors outline-none shadow-sm"
                        >
                            <option value="all" className="bg-background text-foreground">All Roles</option>
                            <option value="user" className="bg-background text-foreground">User</option>
                            <option value="artist" className="bg-background text-foreground">Artist</option>
                            <option value="admin" className="bg-background text-foreground">Admin</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                            <Filter className="w-4 h-4" />
                        </div>
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
                                    <tr key={`skeleton-${idx}`} className="block md:table-row border-b border-separator/30 p-4 md:p-0">
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
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user._id || user.id} className="block md:table-row hover:bg-muted/10 transition-colors group p-4 md:p-0">
                                        <td className="block md:table-cell px-2 py-3 md:px-6 md:py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative flex-shrink-0">
                                                    {user.profileImage || user.image || user.avatar ? (
                                                        <img src={user.profileImage || user.image || user.avatar} alt={user.profileName || user.name} className="w-12 h-12 md:w-10 md:h-10 rounded-full object-cover border-2 border-background shadow-sm" />
                                                    ) : (
                                                        <div className="w-12 h-12 md:w-10 md:h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg border-2 border-background shadow-sm">
                                                            {getUserInitial(user.profileName || user.name)}
                                                        </div>
                                                    )}
                                                    <div className={`absolute bottom-0 right-0 w-3 h-3 md:w-2.5 md:h-2.5 rounded-full border-2 border-background bg-primary`}></div>
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-medium text-foreground text-base md:text-sm truncate">{user.profileName || user.name || 'Unknown'}</div>
                                                    <div className="text-sm text-muted-foreground truncate">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="flex items-center justify-between md:table-cell px-2 py-3 md:px-6 md:py-4 border-t border-separator/30 md:border-none mt-2 md:mt-0 pt-4 md:pt-4">
                                            <span className="md:hidden text-xs font-semibold text-muted-foreground uppercase">Status</span>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border bg-primary/10 text-primary border-primary/20`}>
                                                Active
                                            </span>
                                        </td>
                                        <td className="flex items-center justify-between md:table-cell px-2 py-3 md:px-6 md:py-4">
                                            <span className="md:hidden text-xs font-semibold text-muted-foreground uppercase">Current Role</span>
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(user.role)}`}>
                                                {getRoleIcon(user.role)}
                                                <span className="capitalize">{user.role || 'user'}</span>
                                            </div>
                                        </td>
                                        <td className="flex items-center justify-between md:table-cell px-2 py-3 md:px-6 md:py-4">
                                            <span className="md:hidden text-xs font-semibold text-muted-foreground uppercase">Change Role</span>
                                            <div className="relative w-32 md:w-full md:max-w-[140px]">
                                                <select 
                                                    className="appearance-none bg-background border border-separator text-foreground text-sm rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary block w-full p-2 pr-8 cursor-pointer hover:bg-muted/10 transition-colors outline-none shadow-sm"
                                                    value={user.role || 'user'}
                                                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                >
                                                    <option value="user" className="bg-background text-foreground">User</option>
                                                    <option value="artist" className="bg-background text-foreground">Artist</option>
                                                    <option value="admin" className="bg-background text-foreground">Admin</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                                                    <ChevronDown className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="flex items-center justify-between md:table-cell px-2 py-3 md:px-6 md:py-4 md:text-right">
                                            <span className="md:hidden text-xs font-semibold text-muted-foreground uppercase">Actions</span>
                                            <div className="flex items-center justify-end gap-1 opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => confirmDelete(user)}
                                                    className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all" 
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/20 rounded-lg transition-all">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground block md:table-cell">
                                        No users found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination (Mock) */}
                <div className="bg-muted/10 border-t border-separator px-6 py-4 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Showing <span className="font-medium text-foreground">{filteredUsers.length > 0 ? 1 : 0}</span> to <span className="font-medium text-foreground">{filteredUsers.length}</span> of <span className="font-medium text-foreground">{filteredUsers.length}</span> users
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-sm font-medium text-foreground bg-background border border-separator rounded-lg hover:bg-muted/20 transition-colors disabled:opacity-50 shadow-sm" disabled={true}>
                            Previous
                        </button>
                        <button className="px-3 py-1.5 text-sm font-medium text-foreground bg-background border border-separator rounded-lg hover:bg-muted/20 transition-colors shadow-sm disabled:opacity-50" disabled={true}>
                            Next
                        </button>
                    </div>
                </div>
            </div>

            <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
                <Modal.Backdrop className="bg-black/50 backdrop-blur-sm">
                    <Modal.Container placement="center">
                        <Modal.Dialog className="bg-[#F8F6F0] border border-black/5 shadow-2xl rounded-3xl p-4 md:p-6 text-foreground max-w-sm w-full mx-auto">
                        <Modal.Header className="flex flex-col items-center justify-center pt-4 pb-2">
                            <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mb-4 shadow-sm">
                                <Trash2 className="w-6 h-6 text-red-500" strokeWidth={1.5} />
                            </div>
                            <Modal.Heading className="text-xl font-bold text-gray-800">Delete User</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body className="text-center px-4 py-0">
                            <p className="text-[#6C7063] text-sm leading-relaxed">
                                Are you sure you want to delete the user <strong>{userToDelete?.profileName || userToDelete?.name || 'this user'}</strong>? This action is permanent and cannot be undone.
                            </p>
                        </Modal.Body>
                        <Modal.Footer className="flex flex-row justify-center gap-3 pt-8 pb-2">
                            <Button 
                                variant="bordered" 
                                onPress={() => setIsOpen(false)} 
                                className="flex-1 font-semibold border border-black/10 text-gray-700 bg-transparent hover:bg-black/5 rounded-2xl py-6"
                            >
                                Cancel
                            </Button>
                            <Button 
                                color="danger" 
                                onPress={() => handleDeleteUser()}
                                className="flex-1 font-semibold bg-[#FE2C45] text-white shadow-lg shadow-red-500/30 rounded-2xl py-6 border border-transparent"
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
