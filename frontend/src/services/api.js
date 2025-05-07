import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const predictSales = async (formData) => {
  try {
    // Try to get prediction from the backend
    const response = await axios.post(`${API_URL}/predict`, {
      data: [formData],
      model: formData.model
    });
    
    // Check if the response contains valid prediction data
    if (response.data && response.data.predictions && response.data.predictions.length > 0) {
      console.log('Received prediction from API:', response.data.predictions[0]);
      return response.data.predictions[0];
    } else {
      console.warn('API returned empty or invalid prediction data');
      throw new Error('Invalid prediction data');
    }
  } catch (error) {
    console.error('Error making prediction:', error);
    
    // Generate a fixed prediction based on the selected model
    console.log('Generating mock prediction data');
    
    // Return fixed predictions based on the selected model
    if (formData.model === 'linear') {
      return {
        predicted_sales: 1487632.50,
        model_used: 'Linear Regression',
        is_mock: true
      };
    } else {
      return {
        predicted_sales: 1892456.70,
        model_used: 'XGBoost',
        is_mock: true
      };
    }
  }
};

// This would be used if we had an endpoint for fetching visualizations data
export const getVisualizationData = async (vizType) => {
  try {
    // For now, we'll simulate this with mock data in the components
    // In a real app, this would call backend endpoints
    const response = await axios.get(`${API_URL}/visualize/${vizType}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${vizType} visualization:`, error);
    throw error;
  }
}; 