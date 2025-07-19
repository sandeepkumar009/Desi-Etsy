import api from './api';

export const getArtisanProfile = async (artisanId) => {
    try {
        const response = await api.get(`/artisans/profile/${artisanId}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching profile for artisan ${artisanId}:`, error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};

export const updateMyArtisanProfile = async (profileData) => {
    try {
        const response = await api.put('/artisans/my-profile', profileData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    } catch (error) {
        console.error('Error updating artisan profile:', error);
        throw error.response?.data || { message: "An unknown error occurred" };
    }
};
