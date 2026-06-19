"use client";
import React, { useState } from 'react';
import { Search, MoreVertical, Edit2, Trash2, Shield, User, Paintbrush, ChevronDown, Filter } from 'lucide-react';

const AdminDashboard = () => {
    // mock data
    const [users] = useState([
        { id: 1, name: "Alice Wonderland", email: "alice@example.com", role: "user", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d", status: "Active" },
        { id: 2, name: "Bob Ross", email: "bob@ross.com", role: "artist", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d", status: "Active" },
        { id: 3, name: "Charlie Admin", email: "charlie@admin.com", role: "admin", avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d", status: "Offline" },
        { id: 4, name: "Diana Prince", email: "diana@themyscira.com", role: "user", avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d", status: "Active" },
        { id: 5, name: "Edward Scissorhands", email: "edward@scissors.com", role: "artist", avatar: "https://i.pravatar.cc/150?u=a04258114e29026708c", status: "Offline" },
    ]);

    const [filterRole, setFilterRole] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin': return <Shield className="w-4 h-4 text-primary" />;
            case 'artist': return <Paintbrush className="w-4 h-4 text-secondary" />;
            case 'user': return <User className="w-4 h-4 text-muted-foreground" />;
            default: return null;
        }
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin': return "bg-primary/10 text-primary border-primary/20";
            case 'artist': return "bg-secondary/10 text-secondary border-secondary/20";
            case 'user': return "bg-muted/30 text-muted-foreground border-separator";
            default: return "bg-background text-foreground border-separator";
        }
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
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="block md:table-row hover:bg-muted/10 transition-colors group p-4 md:p-0">
                                        <td className="block md:table-cell px-2 py-3 md:px-6 md:py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <img src={user.avatar} alt={user.name} className="w-12 h-12 md:w-10 md:h-10 rounded-full object-cover border-2 border-background shadow-sm" />
                                                    <div className={`absolute bottom-0 right-0 w-3 h-3 md:w-2.5 md:h-2.5 rounded-full border-2 border-background ${user.status === 'Active' ? 'bg-primary' : 'bg-muted-foreground'}`}></div>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-foreground text-base md:text-sm">{user.name}</div>
                                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="flex items-center justify-between md:table-cell px-2 py-3 md:px-6 md:py-4 border-t border-separator/30 md:border-none mt-2 md:mt-0 pt-4 md:pt-4">
                                            <span className="md:hidden text-xs font-semibold text-muted-foreground uppercase">Status</span>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${user.status === 'Active' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted/30 text-muted-foreground border-separator'}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="flex items-center justify-between md:table-cell px-2 py-3 md:px-6 md:py-4">
                                            <span className="md:hidden text-xs font-semibold text-muted-foreground uppercase">Current Role</span>
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(user.role)}`}>
                                                {getRoleIcon(user.role)}
                                                <span className="capitalize">{user.role}</span>
                                            </div>
                                        </td>
                                        <td className="flex items-center justify-between md:table-cell px-2 py-3 md:px-6 md:py-4">
                                            <span className="md:hidden text-xs font-semibold text-muted-foreground uppercase">Change Role</span>
                                            <div className="relative w-32 md:w-full md:max-w-[140px]">
                                                <select 
                                                    className="appearance-none bg-background border border-separator text-foreground text-sm rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary block w-full p-2 pr-8 cursor-pointer hover:bg-muted/10 transition-colors outline-none shadow-sm"
                                                    defaultValue={user.role}
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
                                            <div className="flex items-center justify-end gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all" title="Edit User">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all" title="Delete User">
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
        </div>
    );
};

export default AdminDashboard;
