const mongoose = require('mongoose');

class DatabaseConnection {
    constructor() {
        this.isConnected = false;
    }

    /**
     * Connect to MongoDB
     * @param {string} uri - MongoDB connection URI
     * @returns {Promise<void>}
     */
    async connect(uri) {
        if (this.isConnected) {
            console.log('📦 Already connected to MongoDB');
            return;
        }

        try {
            const options = {
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            };

            await mongoose.connect(uri, options);
            this.isConnected = true;

            console.log('✅ MongoDB connected successfully');

            // Handle connection events
            mongoose.connection.on('error', (err) => {
                console.error('❌ MongoDB connection error:', err);
                this.isConnected = false;
            });

            mongoose.connection.on('disconnected', () => {
                console.warn('⚠️  MongoDB disconnected');
                this.isConnected = false;
            });

            // Graceful shutdown
            process.on('SIGINT', async () => {
                await this.disconnect();
                process.exit(0);
            });

        } catch (error) {
            console.error('❌ MongoDB connection failed:', error.message);
            throw error;
        }
    }

    /**
     * Disconnect from MongoDB
     * @returns {Promise<void>}
     */
    async disconnect() {
        if (!this.isConnected) {
            return;
        }

        try {
            await mongoose.connection.close();
            this.isConnected = false;
            console.log('👋 MongoDB connection closed');
        } catch (error) {
            console.error('❌ Error closing MongoDB connection:', error);
            throw error;
        }
    }

    /**
     * Get connection status
     * @returns {boolean}
     */
    getStatus() {
        return this.isConnected;
    }
}

const dbConnection = new DatabaseConnection();

module.exports = dbConnection;
