import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getAllArtisansByStatus, updateArtisanStatus } from '../../services/artisanService';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';

// Reusable UI Components
const StatusBadge = ({ status }) => {
    const statusStyles = {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        suspended: 'bg-gray-100 text-gray-800',
    };
    return (
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyles[status] || 'bg-gray-200'}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

// Modal for Viewing Artisan Details
const ArtisanDetailModal = ({isDetailModalOpen, artisan, onClose }) => {
    if (!artisan) return null;
    return (
        <Modal isOpen={isDetailModalOpen} title="Artisan Details" onClose={onClose}>
            <div className="space-y-4">
                <img src={artisan.artisanProfile.bannerImage} alt={`${artisan.artisanProfile.brandName} banner`} className="w-full h-40 object-cover rounded-lg bg-gray-200" />
                <div className="flex items-center gap-4">
                    <img src={artisan.profilePicture} alt={artisan.name} className="h-16 w-16 rounded-full object-cover border-2 border-admin-accent" />
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{artisan.name}</h3>
                        <p className="text-sm text-gray-500">{artisan.email}</p>
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-700">Brand Name</h4>
                    <p>{artisan.artisanProfile.brandName}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-700">Artisan's Story</h4>
                    <p className="text-gray-600 whitespace-pre-wrap">{artisan.artisanProfile.story}</p>
                </div>
                <div className="pt-4 flex justify-end">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold">Close</button>
                </div>
            </div>
        </Modal>
    );
};


// Main Page Component
const ArtisanVerificationPage = () => {
    const [artisans, setArtisans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedArtisan, setSelectedArtisan] = useState(null);
    const [actionType, setActionType] = useState('');

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [artisanForDetail, setArtisanForDetail] = useState(null);


    const fetchArtisans = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getAllArtisansByStatus(statusFilter);
            setArtisans(data);
        } catch (error) {
            toast.error(error.message || 'Failed to fetch artisans.');
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        fetchArtisans();
    }, [fetchArtisans]);

    const handleActionClick = (artisan, type) => {
        setSelectedArtisan(artisan);
        setActionType(type);
        setIsConfirmModalOpen(true);
    };

    const handleViewDetailsClick = (artisan) => {
        setArtisanForDetail(artisan);
        setIsDetailModalOpen(true);
    };

    const handleConfirmAction = async () => {
        if (!selectedArtisan || !actionType) return;

        try {
            const response = await updateArtisanStatus(selectedArtisan._id, actionType);
            toast.success(response.message);
            fetchArtisans();
        } catch (error) {
            toast.error(error.message || `Failed to ${actionType} artisan.`);
        } finally {
            setIsConfirmModalOpen(false);
            setSelectedArtisan(null);
            setActionType('');
        }
    };

    const getButtonClasses = (action) => {
        const base = 'px-3 py-1 text-xs font-semibold rounded-md shadow-sm transition-colors';
        switch(action) {
            case 'details': return `${base} bg-white border border-gray-300 text-gray-700 hover:bg-gray-50`;
            case 'approved': return `${base} bg-green-600 text-white hover:bg-green-700`;
            case 'rejected': return `${base} bg-red-600 text-white hover:bg-red-700`;
            case 'suspended': return `${base} bg-yellow-500 text-white hover:bg-yellow-600`;
            default: return `${base} bg-gray-500 text-white hover:bg-gray-600`;
        }
    };
    
    const getConfirmButtonClasses = (action) => {
        const base = 'px-4 py-2 rounded-lg font-semibold text-white';
        switch(action) {
            case 'approved': return `${base} bg-green-600 hover:bg-green-700`;
            case 'rejected': return `${base} bg-red-600 hover:bg-red-700`;
            case 'suspended': return `${base} bg-yellow-500 hover:bg-yellow-600`;
            default: return `${base} bg-gray-500 hover:bg-gray-600`;
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-admin-primary">✅ Artisan Verification</h1>
                    <p className="text-gray-600 mt-1">Manage artisan applications and statuses.</p>
                </div>
                <div className="flex items-center gap-2">
                    <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">Filter by status:</label>
                    <select
                        id="status-filter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-admin-accent focus:ring focus:ring-admin-accent focus:ring-opacity-50"
                    >
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <Loader text="Fetching artisans..." />
            ) : (
                <div className="overflow-x-auto">
                    {artisans.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artisan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {artisans.map(artisan => (
                                    <tr key={artisan._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <img className="h-10 w-10 rounded-full object-cover" src={artisan.profilePicture} alt={artisan.name} />
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{artisan.name}</div>
                                                    <div className="text-sm text-gray-500">{artisan.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{artisan.artisanProfile.brandName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={artisan.artisanProfile.status} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <button type="button" onClick={() => handleViewDetailsClick(artisan)} className={getButtonClasses('details')}>Details</button>
                                            {artisan.artisanProfile.status === 'pending' && (
                                                <>
                                                    <button type="button" onClick={() => handleActionClick(artisan, 'approved')} className={getButtonClasses('approved')}>Approve</button>
                                                    <button type="button" onClick={() => handleActionClick(artisan, 'rejected')} className={getButtonClasses('rejected')}>Reject</button>
                                                </>
                                            )}
                                            {artisan.artisanProfile.status === 'approved' && (
                                                <button type="button" onClick={() => handleActionClick(artisan, 'suspended')} className={getButtonClasses('suspended')}>Suspend</button>
                                            )}
                                            {(artisan.artisanProfile.status === 'suspended' || artisan.artisanProfile.status === 'rejected') && (
                                                 <button type="button" onClick={() => handleActionClick(artisan, 'approved')} className={getButtonClasses('approved')}>Re-Approve</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No artisans found with status "{statusFilter}".</p>
                        </div>
                    )}
                </div>
            )}
            
            {isConfirmModalOpen && (
                <Modal
                    isOpen={isConfirmModalOpen}
                    title={`Confirm Action: ${actionType.charAt(0).toUpperCase() + actionType.slice(1)}`}
                    onClose={() => setIsConfirmModalOpen(false)}
                >
                    <p className="text-gray-600 mb-6">
                        Are you sure you want to <span className="font-bold">{actionType}</span> the artisan "{selectedArtisan?.name}"?
                    </p>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={() => setIsConfirmModalOpen(false)} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold">Cancel</button>
                        <button type="button" onClick={handleConfirmAction} className={getConfirmButtonClasses(actionType)}>
                            Confirm {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
                        </button>
                    </div>
                </Modal>
            )}

            {isDetailModalOpen && (
                <ArtisanDetailModal isDetailModalOpen artisan={artisanForDetail} onClose={() => setIsDetailModalOpen(false)} />
            )}
        </div>
    );
};

export default ArtisanVerificationPage;
