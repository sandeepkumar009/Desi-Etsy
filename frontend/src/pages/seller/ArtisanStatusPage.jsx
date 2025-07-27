import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import Loader from '../../components/common/Loader';

const StatusCard = ({ status }) => {
    const statusConfig = {
        pending: {
            icon: '⏳',
            title: 'Your Application is Under Review',
            message: "Our team is currently reviewing your shop profile. This process usually takes 2-3 business days. We'll notify you by email as soon as a decision is made.",
            bgColor: 'bg-yellow-100',
            borderColor: 'border-yellow-400',
            textColor: 'text-yellow-800',
        },
        rejected: {
            icon: '❌',
            title: 'Application Update',
            message: "We appreciate your interest in selling on our platform. After careful review, we are unable to approve your application at this time. Please check your email for more details.",
            bgColor: 'bg-red-100',
            borderColor: 'border-red-400',
            textColor: 'text-red-800',
        },
        suspended: {
            icon: '🚫',
            title: 'Your Account is Suspended',
            message: "Your selling privileges have been temporarily suspended. Please check your email for more information or contact our support team.",
            bgColor: 'bg-red-100',
            borderColor: 'border-red-400',
            textColor: 'text-red-800',
        }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
        <div className={`p-8 rounded-lg border text-center ${config.bgColor} ${config.borderColor}`}>
            <div className="text-5xl mb-4">{config.icon}</div>
            <h2 className={`text-2xl font-bold mb-2 ${config.textColor}`}>{config.title}</h2>
            <p className={`max-w-2xl mx-auto ${config.textColor}`}>{config.message}</p>
        </div>
    );
};


const ArtisanStatusPage = () => {
    const { user } = useAuth();

    if (!user || !user.artisanProfile) {
        return <div className="flex justify-center items-center h-64"><Loader /></div>;
    }

    const { artisanProfile, name } = user;
    const { brandName, story, bannerImage, status } = artisanProfile;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Welcome, {name}!</h1>
            
            <StatusCard status={status} />

                <h2 className="text-xl font-bold text-gray-800 mb-4">Your Submitted Shop Preview</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="relative">
                    <div 
                        className="h-48 bg-gray-200 rounded-lg -m-6 mb-0 bg-cover bg-center" 
                        style={{ backgroundImage: `url(${bannerImage || 'https://placehold.co/1200x400/e2e8f0/4a5568?text=Banner+Preview'})` }}
                    ></div>
                    <div className="flex items-end -mt-16 px-4">
                        <img 
                            src={user.profilePicture || `https://i.pravatar.cc/150?u=${user._id}`} 
                            alt="Shop Profile" 
                            className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-gray-200" 
                        />
                        <div className="ml-6">
                            <h3 className="text-2xl font-bold text-gray-800">{brandName}</h3>
                        </div>
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t">
                    <h4 className="text-lg font-bold text-gray-800 mb-2">Your Story</h4>
                    <p className="text-gray-600 whitespace-pre-wrap">{story}</p>
                </div>
            </div>
             <div className="text-center text-sm text-gray-500">
                <p>Want to change something? You can still <Link to="/seller/settings" className="text-indigo-600 hover:underline font-semibold">edit your profile details</Link> while your application is being reviewed.</p>
            </div>
        </div>
    );
};

export default ArtisanStatusPage;
