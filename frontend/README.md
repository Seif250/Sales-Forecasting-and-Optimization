# Walmart Sales Forecasting Frontend

This is a modern React application for visualizing and making predictions with the Walmart Sales Forecasting models.

## Features

- **Sales Prediction Form**: Input store and environmental factors to predict weekly sales
- **Interactive Visualizations**: Explore sales patterns and insights
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- React.js
- Material UI
- Recharts (for visualizations)
- Formik & Yup (for form validation)
- Axios (for API calls)

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

3. The app will be available at http://localhost:3000

## API Integration

The frontend communicates with a FastAPI backend running at http://localhost:8000. Make sure the backend server is running when using the prediction features.

## Visualizations

The app includes several visualization components:
- Store Sales Comparison
- Sales Trends Over Time
- Holiday Impact Analysis

## Project Structure

```
frontend/
├── public/           # Static assets
├── src/
│   ├── components/   # Reusable UI components
│   │   └── visualizations/  # Chart components
│   ├── pages/        # Page components
│   ├── services/     # API services
│   ├── App.js        # Main app component
│   └── index.js      # Entry point
└── package.json      # Dependencies
``` 