import { useState, useEffect } from 'react';
import { getUsers, deleteUser, createUser, User, CreateUserData } from '@/utils/api';
import { getAccessToken } from '@/lib/auth';

interface UseUsersReturn {
    users: User[];
    loading: boolean;
    fetchUsers: () => Promise<void>;
    deleteUser: (userId: string) => Promise<void>;
    createUser: (userData: CreateUserData) => Promise<User>;
}

export const useUsers = (): UseUsersReturn => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = getAccessToken();
            if (!token) return;

            const response = await getUsers(token);
            const data = Array.isArray(response)
                ? response
                : Array.isArray((response as any)?.users)
                    ? (response as any).users
                    : Array.isArray((response as any)?.data)
                        ? (response as any).data
                        : [];
            setUsers(data);
        } catch (err) {
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId: string): Promise<void> => {
        if (!userId) return;

        try {
            const token = getAccessToken();
            if (!token) return;

            await deleteUser(userId, token);
            setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
        } catch (err) {
            // Error will be visible in network panel
        }
    };

    const handleCreateUser = async (userData: CreateUserData): Promise<User> => {
        const token = getAccessToken();
        if (!token) throw new Error('No token');

        const newUser = await createUser(userData, token);
        setUsers(prevUsers => [...prevUsers, newUser]);
        return newUser;
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return {
        users,
        loading,
        fetchUsers,
        deleteUser: handleDeleteUser,
        createUser: handleCreateUser,
    };
};