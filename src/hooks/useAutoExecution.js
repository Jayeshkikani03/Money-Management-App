import { useEffect, useRef } from 'react';
import autoExecutionService from '../services/autoExecutionService';

/**
 * Custom hook for auto-execution integration
 * Ensures safe initialization and prevents duplicate execution
 */
export const useAutoExecution = (context) => {
    const schedulerRef = useRef(null);
    const isInitialized = useRef(false);

    useEffect(() => {
        // Prevent multiple initializations
        if (isInitialized.current) {
            return;
        }

        const initializeAutoExecution = async () => {
            try {
                // Check if we should run auto-execution
                if (autoExecutionService.shouldRunAutoExecution()) {
                    console.log('🔄 Running auto-execution...');
                    const result = await autoExecutionService.runAutoExecution(context);

                    if (result.success) {
                        console.log('✅ Auto-execution completed:', result.results);
                    } else {
                        console.error('❌ Auto-execution failed:', result.error);
                    }
                } else {
                    console.log('⏭️ Auto-execution skipped (already ran today)');
                }

                // Setup midnight scheduler (only once)
                if (!schedulerRef.current) {
                    console.log('⏰ Setting up midnight scheduler...');
                    autoExecutionService.setupMidnightScheduler(context);
                    schedulerRef.current = true;
                }

                isInitialized.current = true;
            } catch (error) {
                console.error('Failed to initialize auto-execution:', error);
            }
        };

        // Run initialization if context is ready
        if (context && context.addTransaction) {
            initializeAutoExecution();
        }

        // Cleanup function
        return () => {
            // Note: We don't clear the scheduler on unmount
            // because we want it to persist for the app lifetime
        };
    }, [context]);

    return {
        isInitialized: isInitialized.current,
        schedulerActive: schedulerRef.current,
    };
};

export default useAutoExecution;
