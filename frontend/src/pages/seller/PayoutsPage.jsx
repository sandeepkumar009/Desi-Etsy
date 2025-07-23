// frontend/src/pages/seller/PayoutsPage.jsx
// This is the new, enhanced payouts page for artisans.

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getMyPayoutInfo, updateMyPayoutInfo, getMyPayoutSummary, getMyPayoutHistory } from '../../services/artisanService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

const StatCard = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
        <div className="text-3xl">{icon}</div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">₹{value.toLocaleString('en-IN')}</p>
        </div>
    </div>
);

const PayoutsPage = () => {
    const [payoutInfo, setPayoutInfo] = useState({
        accountHolderName: '', accountNumber: '', ifscCode: '', bankName: '',
    });
    const [summary, setSummary] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [view, setView] = useState('summary'); // 'summary' or 'settings'

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [summaryData, historyData, infoData] = await Promise.all([
                getMyPayoutSummary(),
                getMyPayoutHistory(),
                getMyPayoutInfo()
            ]);
            setSummary(summaryData);
            setHistory(historyData);
            if (infoData) setPayoutInfo(infoData);
        } catch (error) {
            toast.error("Could not fetch your payout data.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPayoutInfo(prev => ({ ...prev, [name]: value.toUpperCase() }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const result = await updateMyPayoutInfo(payoutInfo);
            if (result.success) {
                toast.success("Bank details updated successfully!");
            } else {
                toast.error(result.message || "Failed to update details.");
            }
        } catch (error) {
            toast.error(error.message || "An error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <Loader text="Loading Payouts Information..." />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Payouts</h1>
                <div className="flex gap-2 p-1 bg-gray-200 rounded-lg">
                    <Button size="sm" variant={view === 'summary' ? 'primary' : 'ghost'} onClick={() => setView('summary')}>Summary</Button>
                    <Button size="sm" variant={view === 'settings' ? 'primary' : 'ghost'} onClick={() => setView('settings')}>Bank Settings</Button>
                </div>
            </div>

            {view === 'summary' && (
                <div className="space-y-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <StatCard title="Pending Payout" value={summary?.netPendingPayout || 0} icon="⏳" />
                        <StatCard title="Lifetime Earnings Paid" value={summary?.lifetimeEarnings || 0} icon="✅" />
                    </div>

                    {/* Payout History Table */}
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Payout History</h2>
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction Ref.</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders Covered</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {history.length > 0 ? history.map(payout => (
                                            <tr key={payout._id}>
                                                <td className="px-6 py-4 text-sm text-gray-800">{new Date(payout.createdAt).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 text-sm font-semibold text-green-600">₹{payout.amount.toLocaleString('en-IN')}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{payout.transactionReference || 'N/A'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{payout.orderIds.length}</td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="4" className="text-center py-12 text-gray-500">No past payouts found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {view === 'settings' && (
                 <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-2">Bank Account Details</h2>
                    <p className="mb-6 text-gray-600">
                        Please provide your bank account details accurately. Payouts for your delivered orders will be sent to this account.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input label="Account Holder Name" name="accountHolderName" value={payoutInfo.accountHolderName} onChange={handleChange} required />
                        <Input label="Bank Account Number" name="accountNumber" value={payoutInfo.accountNumber} onChange={handleChange} required />
                        <Input label="IFSC Code" name="ifscCode" value={payoutInfo.ifscCode} onChange={handleChange} required />
                        <Input label="Bank Name" name="bankName" value={payoutInfo.bankName} onChange={handleChange} required />
                        <div className="flex justify-end">
                            <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : 'Save Bank Details'}
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PayoutsPage;
