/**
 * Image Verification Loader Component
 * 
 * A full-screen loading overlay displayed during image verification.
 * Shows animated progress through three stages: uploading, analyzing,
 * and matching with the FDA database.
 * 
 * Features:
 * - Three-stage progress visualization
 * - Animated icons that change per stage
 * - Pulsing background animation
 * - Rotating spinner border
 * - Sliding progress bar
 * - Stage indicator dots
 * - Backdrop blur effect
 * - Accessible ARIA attributes
 * 
 * Stages:
 * 1. Uploading: Shows camera icon
 * 2. Analyzing: Shows search icon
 * 3. Matching: Shows check circle icon
 * 
 * @component
 * @returns {JSX.Element} A full-screen loading modal
 * 
 * @example
 * {isUploading && <ImageVerificationLoader />}
 */
import { Camera, Search, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Type definition for loading stages
 * @typedef {'uploading' | 'analyzing' | 'matching'} LoadingStage
 */
type LoadingStage = 'uploading' | 'analyzing' | 'matching';

export default function ImageVerificationLoader() {
    const [stage, setStage] = useState<LoadingStage>('uploading');

    useEffect(() => {
        // Cycle through stages to show progress while waiting for API
        const stageTimer1 = setTimeout(() => setStage('analyzing'), 800);
        const stageTimer2 = setTimeout(() => setStage('matching'), 2000);

        return () => {
            clearTimeout(stageTimer1);
            clearTimeout(stageTimer2);
        };
    }, []);

    /**
     * Returns the appropriate icon for the current loading stage
     * @returns {JSX.Element} The icon component for the current stage
     */
    const getStageIcon = () => {
        switch (stage) {
            case 'uploading':
                return <Camera className="w-8 h-8" />;
            case 'analyzing':
                return <Search className="w-8 h-8" />;
            case 'matching':
                return <CheckCircle className="w-8 h-8" />;
            default:
                return <Camera className="w-8 h-8" />;
        }
    };

    /**
     * Returns the appropriate text description for the current loading stage
     * @returns {string} The text description for the current stage
     */
    const getStageText = () => {
        switch (stage) {
            case 'uploading':
                return 'Uploading image...';
            case 'analyzing':
                return 'Analyzing product details...';
            case 'matching':
                return 'Matching with FDA database...';
            default:
                return 'Processing...';
        }
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="loader-title"
        >
            <div className="bg-card border border-app rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
                {/* Animated Icon */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        {/* Pulsing background */}
                        <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
                        
                        {/* Rotating border */}
                        <div className="relative w-20 h-20 rounded-full border-4 border-app flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" />
                            <div className="text-blue-600">
                                {getStageIcon()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stage Text */}
                <h2 
                    id="loader-title" 
                    className="text-xl font-bold text-center mb-2"
                >
                    {getStageText()}
                </h2>

                <p className="text-sm text-muted text-center mb-6">
                    Please wait while we verify your product image
                </p>

                {/* Indeterminate Progress Bar */}
                <div className="relative w-full h-2 bg-app rounded-full overflow-hidden">
                    <div 
                        className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse"
                        style={{
                            animation: 'slide 1.5s ease-in-out infinite',
                        }}
                    />
                </div>

                <style>{`
                    @keyframes slide {
                        0% {
                            transform: translateX(-100%);
                        }
                        50% {
                            transform: translateX(300%);
                        }
                        100% {
                            transform: translateX(-100%);
                        }
                    }
                `}</style>

                {/* Stage Indicators */}
                <div className="flex justify-center gap-2 mt-6">
                    <div 
                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                            stage === 'uploading' ? 'bg-blue-600' : 'bg-app'
                        }`}
                        aria-label={stage === 'uploading' ? 'Current stage: uploading' : 'Stage: uploading'}
                    />
                    <div 
                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                            stage === 'analyzing' ? 'bg-blue-600' : 'bg-app'
                        }`}
                        aria-label={stage === 'analyzing' ? 'Current stage: analyzing' : 'Stage: analyzing'}
                    />
                    <div 
                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                            stage === 'matching' ? 'bg-blue-600' : 'bg-app'
                        }`}
                        aria-label={stage === 'matching' ? 'Current stage: matching' : 'Stage: matching'}
                    />
                </div>
            </div>
        </div>
    );
}
