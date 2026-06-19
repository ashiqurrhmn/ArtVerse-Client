"use client";
import React, { useState } from 'react';
import { Search, Trash2, Image as ImageIcon, ArrowUpDown } from 'lucide-react';

const AdminManageArtworks = () => {
    // mock data
    const [artworks] = useState([
        { id: 1, title: "Starry Night Reflection", artist: "Vincent V.", price: 1200, image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&q=80" },
        { id: 2, title: "Modern Abstract I", artist: "Jane Doe", price: 850, image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&q=80" },
        { id: 3, title: "Ocean Breeze", artist: "Bob Ross", price: 450, image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=500&q=80" },
        { id: 4, title: "Urban Jungle", artist: "Chris P.", price: 2100, image: "https://images.unsplash.com/photo-1561214115-f2f1146f56ba?w=500&q=80" },
        { id: 5, title: "Golden Hours", artist: "Alice W.", price: 300, image: "https://images.unsplash.com/photo-1508344928928-7165b67de128?w=500&q=80" },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('default');

    const filteredArtworks = artworks.filter(art => {
        return art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
               art.artist.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const sortedArtworks = [...filteredArtworks].sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0;
    });

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Manage Artworks</h1>
                    <p className="text-muted-foreground mt-1">Review and manage all artworks uploaded to the platform.</p>
                </div>
                
                {/* Search / Action Bar */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative w-full sm:w-auto group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search artworks..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-background border border-separator rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none w-full sm:w-64 text-sm text-foreground placeholder-muted-foreground shadow-sm"
                        />
                    </div>

                    <div className="relative w-full sm:w-auto">
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="appearance-none bg-background border border-separator text-foreground text-sm rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary block w-full py-2.5 pl-4 pr-10 cursor-pointer hover:bg-muted/10 transition-colors outline-none shadow-sm"
                        >
                            <option value="default" className="bg-background text-foreground">Sort by: Default</option>
                            <option value="price-asc" className="bg-background text-foreground">Price: Low to High</option>
                            <option value="price-desc" className="bg-background text-foreground">Price: High to Low</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                            <ArrowUpDown className="w-4 h-4" />
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
                                <th className="px-6 py-4">Artwork</th>
                                <th className="px-6 py-4">Artist</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-separator block md:table-row-group">
                            {sortedArtworks.length > 0 ? (
                                sortedArtworks.map((art) => (
                                    <tr key={art.id} className="block md:table-row hover:bg-muted/10 transition-colors group p-4 md:p-0">
                                        <td className="block md:table-cell px-2 py-3 md:px-6 md:py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative shrink-0">
                                                    {art.image ? (
                                                        <img src={art.image} alt={art.title} className="w-16 h-16 md:w-12 md:h-12 rounded-lg object-cover border-2 border-separator shadow-sm" />
                                                    ) : (
                                                        <div className="w-16 h-16 md:w-12 md:h-12 rounded-lg bg-muted flex items-center justify-center border-2 border-separator shadow-sm">
                                                            <ImageIcon className="w-6 h-6 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-foreground text-base md:text-sm">{art.title}</div>
                                                    <div className="text-sm text-muted-foreground mt-0.5 md:hidden">By {art.artist}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="flex items-center justify-between md:table-cell px-2 py-3 md:px-6 md:py-4 border-t border-separator/30 md:border-none mt-3 md:mt-0 pt-4 md:pt-4">
                                            <span className="md:hidden text-xs font-semibold text-muted-foreground uppercase">Artist</span>
                                            <div className="font-medium text-foreground text-sm">{art.artist}</div>
                                        </td>
                                        <td className="flex items-center justify-between md:table-cell px-2 py-3 md:px-6 md:py-4">
                                            <span className="md:hidden text-xs font-semibold text-muted-foreground uppercase">Price</span>
                                            <div className="font-bold text-primary">
                                                ${art.price.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="flex items-center justify-between md:table-cell px-2 py-3 md:px-6 md:py-4 md:text-right">
                                            <span className="md:hidden text-xs font-semibold text-muted-foreground uppercase">Actions</span>
                                            <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity">
                                                <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-all border border-transparent hover:border-red-500/20" title="Delete Artwork">
                                                    <Trash2 className="w-4 h-4" />
                                                    <span className="md:hidden">Delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center block md:table-cell">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <ImageIcon className="w-12 h-12 mb-3 opacity-20" />
                                            <p>No artworks found matching your search.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination (Mock) */}
                <div className="bg-muted/10 border-t border-separator px-6 py-4 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Showing <span className="font-medium text-foreground">{sortedArtworks.length > 0 ? 1 : 0}</span> to <span className="font-medium text-foreground">{sortedArtworks.length}</span> of <span className="font-medium text-foreground">{sortedArtworks.length}</span> artworks
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

export default AdminManageArtworks;