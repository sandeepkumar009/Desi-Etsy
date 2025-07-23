import React, { useState } from 'react';
import { toast } from 'react-toastify';
import * as userService from '../../services/userService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const SecurityPage = () => {
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("New password and confirm password do not match.");
            return;
        }
        if (passwords.newPassword.length < 6) {
             toast.error("Password must be at least 6 characters long.");
            return;
        }

        setIsSaving(true);
        try {
            const response = await userService.changePassword({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            toast.success(response.message || "Password updated successfully!");
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.message || "Failed to update password.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-desi-primary mb-6">Security</h1>
            <div className="max-w-md border rounded-lg p-6">
                 <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h2>
                 <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Current Password"
                        name="currentPassword"
                        type="password"
                        value={passwords.currentPassword}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="New Password"
                        name="newPassword"
                        type="password"
                        value={passwords.newPassword}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Confirm New Password"
                        name="confirmPassword"
                        type="password"
                        value={passwords.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    <div className="pt-2">
                        <Button type="submit" isLoading={isSaving} disabled={isSaving}>
                            Update Password
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SecurityPage;