// frontend/src/pages/admin/PayoutManagementPage.jsx
// This is a new page for the admin to view and record payouts.

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getPayoutSummary, recordPayout } from '../../services/payoutService';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';

const PayoutModal = ({ isOpen, onClose, artisan, onConfirm }) => {
    const [transactionReference, setTransactionReference] = useState('');

    if (!artisan) return null;

    const handleConfirm = () => {
        onConfirm(transactionReference);
        onClose();
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Record Payout for ${artisan.brandName}`}>
            <div className="space-y-4">
                <p className="text-sm text-gray-600">
                    You are about to record a payout of <strong className="text-lg">₹{artisan.netPayable.toFixed(2)}</strong>.
                    Please perform the bank transfer manually using the details below.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border">
                    <h4 className="font-semibold mb-2">Bank Details</h4>
                    <p><strong>Holder:</strong> {artisan.payoutInfo.accountHolderName || <span className="text-red-500">Not Provided</span>}</p>
                    <p><strong>Account No:</strong> {artisan.payoutInfo.accountNumber || <span className="text-red-500">Not Provided</span>}</p>
                    <p><strong>IFSC:</strong> {artisan.payoutInfo.ifscCode || <span className="text-red-500">Not Provided</span>}</p>
                    <p><strong>Bank:</strong> {artisan.payoutInfo.bankName || <span className="text-red-500">Not Provided</span>}</p>
                </div>
                <Input
                    label="Transaction Reference (Optional)"
                    value={transactionReference}
                    onChange={(e) => setTransactionReference(e.target.value)}
                    placeholder="Enter bank transaction ID"
                />
                <div className="flex justify-end gap-4 mt-6">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button 
                        onClick={handleConfirm}
                        disabled={!artisan.payoutInfo.accountNumber}
                        title={!artisan.payoutInfo.accountNumber ? "Cannot pay until artisan provides bank details" : ""}
                    >
                        Confirm & Record Payout
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

const PayoutManagementPage = () => {
    const [summary, setSummary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedArtisan, setSelectedArtisan] = useState(null);

    const fetchSummary = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getPayoutSummary();
            setSummary(data);
        } catch (error) {
            toast.error("Failed to fetch payout summary.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);

    const handleRecordPayout = async (transactionReference) => {
        if (!selectedArtisan) return;
        try {
            const payoutData = {
                artisanId: selectedArtisan.artisanId,
                amount: selectedArtisan.netPayable,
                orderIds: selectedArtisan.orderIds,
                transactionReference,
            };
            const result = await recordPayout(payoutData);
            if (result.success) {
                toast.success(`Payout of ₹${selectedArtisan.netPayable.toFixed(2)} recorded for ${selectedArtisan.brandName}.`);
                fetchSummary(); // Refresh the summary list
            } else {
                toast.error(result.message || "Failed to record payout.");
            }
        } catch (error) {
            toast.error(error.message || "An error occurred.");
        }
    };

    if (loading) {
        return <Loader text="Calculating Pending Payouts..." />;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Payout Management</h1>
            <div className="bg-white rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Artisan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Sales</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission (15%)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Payable</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {summary.length > 0 ? summary.map(artisan => (
                                <tr key={artisan.artisanId}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{artisan.brandName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">₹{artisan.totalSales.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">- ₹{artisan.commission.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">₹{artisan.netPayable.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <Button size="sm" onClick={() => setSelectedArtisan(artisan)}>
                                            Record Payout
                                        </Button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-12 text-gray-500">
                                        No pending payouts. All artisans are settled up!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <PayoutModal
                isOpen={!!selectedArtisan}
                onClose={() => setSelectedArtisan(null)}
                artisan={selectedArtisan}
                onConfirm={handleRecordPayout}
            />
        </div>
    );
};

export default PayoutManagementPage;
