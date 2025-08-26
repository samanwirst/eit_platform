import { useState, useEffect } from 'react';
import { getUsers, deleteUser, User } from '@/utils/api';
import { getAccessToken } from '@/lib/auth';

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = getAccessToken();
            if (!token) throw new Error('No token');

            const response = await getUsers(token);

            // ✅ Ensure users is always an array
            const data = Array.isArray(response)
                ? response
                : Array.isArray((response as any)?.users)
                    ? (response as any).users
                    : [];

            setUsers(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch users');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            const token = getAccessToken();
            if (!token) throw new Error('No token');
            await deleteUser(userId, token);
            setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
        } catch (err: any) {
            setError(err.message || 'Failed to delete user');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return {
        users,
        loading,
        error,
        fetchUsers,
        deleteUser: handleDeleteUser,
    };
};
