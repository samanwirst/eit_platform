'use client';

import React, { useState } from 'react';
import InputDefault from '@/components/Inputs/InputDefault';
import ButtonDefault from '@/components/Buttons/ButtonDefault';

interface CreateUserFormProps {
    onSubmit: (data: CreateUserData) => void;
    onCancel: () => void;
    loading?: boolean;
}

export interface CreateUserData {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    password: string;
    role: 'admin' | 'student';
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({
    onSubmit,
    onCancel,
    loading = false
}) => {
    const [formData, setFormData] = useState<CreateUserData>({
        firstName: '',
        lastName: '',
        phoneNumber: '998',
        password: '',
        role: 'student'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;
        onSubmit(formData);
    };

    const handleInputChange = (field: keyof CreateUserData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value && !value.startsWith('998')) {
            if (value.startsWith('98')) {
                value = '9' + value;
            } else if (value.startsWith('9')) {
                value = '99' + value.substring(1);
            } else {
                value = '998' + value;
            }
        }
        if (value.length > 12) {
            value = value.substring(0, 12);
        }
        handleInputChange('phoneNumber', value);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <InputDefault
                    label="First Name"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                />
            </div>

            <div>
                <InputDefault
                    label="Last Name"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                />
            </div>

            <div>
                <InputDefault
                    label="Phone Number"
                    placeholder="998123456789"
                    value={formData.phoneNumber}
                    onChange={handlePhoneChange}
                    maxLength={12}
                    required
                />
                <p className="text-xs text-gray-500 mt-1">
                    Format: 998123456789 (exactly 12 digits)
                </p>
            </div>

            <div>
                <InputDefault
                    label="Password"
                    type="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                </label>
                <select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value as 'admin' | 'student')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            <div className="flex space-x-3 pt-4">
                <ButtonDefault
                    type="button"
                    label="Cancel"
                    onClick={onCancel}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors disabled:opacity-50"
                />
                <ButtonDefault
                    type="submit"
                    label={loading ? "Creating..." : "Create User"}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                />
            </div>
        </form>
    );
};

export default CreateUserForm;