// test-rekognition.js - Quick test script
const AWS = require('aws-sdk');

// Method 1: Use default credentials (if you ran 'aws configure')
const rekognition = new AWS.Rekognition({
    region: 'us-east-2' // Change to your region
});

// Method 2: Use specific profile
const rekognitionWithProfile = new AWS.Rekognition({
    region: 'us-east-2',
    credentials: new AWS.SharedIniFileCredentials({
        profile: 'default' // or your profile name
    })
});

// Method 3: Use access keys directly (not recommended for production)
const rekognitionWithKeys = new AWS.Rekognition({
    region: 'us-east-1',
    accessKeyId: 'YOUR_ACCESS_KEY',
    secretAccessKey: 'YOUR_SECRET_KEY'
});

// Test function
async function testRekognition() {
    try {
        console.log('Testing Rekognition connection...');
        
        // Test with a simple image first (easier than video)
        const testParams = {
            Image: {
                S3Object: {
                    Bucket: 'your-bucket-name',
                    Name: 'test-image.jpg' // Upload a test image first
                }
            },
            MaxLabels: 10,
            MinConfidence: 50
        };
        
        const result = await rekognition.detectLabels(testParams).promise();
        console.log('✅ Rekognition working!');
        console.log('Labels found:', result.Labels.map(label => label.Name));
        
    } catch (error) {
        console.error('❌ Rekognition error:', error.message);
        
        // Common error fixes
        if (error.code === 'UnauthorizedOperation') {
            console.log('💡 Fix: Check your AWS credentials and IAM permissions');
        }
        if (error.code === 'InvalidS3ObjectException') {
            console.log('💡 Fix: Make sure your S3 bucket and object exist');
        }
    }
}

// For video processing (your main use case)
async function startVideoAnalysis(bucketName, videoKey) {
    try {
        console.log('Starting video analysis...');
        
        const params = {
            Video: {
                S3Object: {
                    Bucket: bucketName,
                    Name: videoKey
                }
            },
            MinConfidence: 50
        };
        
        const result = await rekognition.startLabelDetection(params).promise();
        console.log('✅ Video analysis started!');
        console.log('Job ID:', result.JobId);
        
        return result.JobId;
        
    } catch (error) {
        console.error('❌ Video analysis error:', error.message);
        throw error;
    }
}

// Check video analysis results
async function getVideoResults(jobId) {
    try {
        const result = await rekognition.getLabelDetection({
            JobId: jobId
        }).promise();
        
        console.log('Job Status:', result.JobStatus);
        
        if (result.JobStatus === 'SUCCEEDED') {
            console.log('✅ Analysis complete!');
            console.log('Found', result.Labels.length, 'labels');
            
            // Show first few results
            result.Labels.slice(0, 5).forEach(label => {
                console.log(`- ${label.Label.Name} (${Math.round(label.Label.Confidence)}% confident at ${label.Timestamp}ms)`);
            });
        }
        
        return result;
        
    } catch (error) {
        console.error('❌ Results error:', error.message);
        throw error;
    }
}

// Export for use in your app
module.exports = {
    rekognition,
    startVideoAnalysis,
    getVideoResults
};

// Run test if this file is executed directly
if (require.main === module) {
    testRekognition();
}