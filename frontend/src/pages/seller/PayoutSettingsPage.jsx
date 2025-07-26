import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getMyPayoutInfo, updateMyPayoutInfo } from '../../services/artisanService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

const PayoutSettingsPage = () => {
    const [payoutInfo, setPayoutInfo] = useState({
        accountHolderName: '',
        accountNumber: '',
        ifscCode: '',
        bankName: '',
    });
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchPayoutInfo = async () => {
            try {
                const data = await getMyPayoutInfo();
                if (data) {
                    setPayoutInfo(data);
                }
            } catch (error) {
                toast.error("Could not fetch your payout information.");
            } finally {
                setLoading(false);
            }
        };
        fetchPayoutInfo();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPayoutInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const result = await updateMyPayoutInfo(payoutInfo);
            if (result.success) {
                toast.success("Payout information updated successfully!");
            } else {
                toast.error(result.message || "Failed to update payout information.");
            }
        } catch (error) {
            toast.error(error.message || "An error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <Loader text="Loading Payout Settings..." />;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Payout Settings</h1>
            <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl">
                <p className="mb-6 text-gray-600">
                    Please provide your bank account details accurately. Payouts for your delivered orders will be sent to this account.
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Account Holder Name"
                        name="accountHolderName"
                        value={payoutInfo.accountHolderName}
                        onChange={handleChange}
                        placeholder="e.g., Priya Patel"
                        required
                    />
                    <Input
                        label="Bank Account Number"
                        name="accountNumber"
                        value={payoutInfo.accountNumber}
                        onChange={handleChange}
                        placeholder="e.g., 123456789012"
                        required
                    />
                    <Input
                        label="IFSC Code"
                        name="ifscCode"
                        value={payoutInfo.ifscCode}
                        onChange={handleChange}
                        placeholder="e.g., SBIN0001234"
                        required
                    />
                    <Input
                        label="Bank Name"
                        name="bankName"
                        value={payoutInfo.bankName}
                        onChange={handleChange}
                        placeholder="e.g., State Bank of India"
                        required
                    />
                    <div className="flex justify-end">
                        <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Payout Information'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PayoutSettingsPage;
