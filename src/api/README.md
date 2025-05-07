# واجهة برمجة التطبيقات للتنبؤ بالمبيعات

هذا المستند يشرح كيفية استخدام واجهة برمجة التطبيقات (API) للتنبؤ بالمبيعات وتحسين المخزون.

## نقاط النهاية المتاحة

### التنبؤ بالمبيعات

#### `POST /predict`

يقوم بالتنبؤ بالمبيعات بناءً على البيانات المقدمة.

**طلب:**
```json
{
  "data": [
    {
      "store_nbr": 1,
      "family": "GROCERY I",
      "onpromotion": true,
      "date": "2023-01-01"
    }
  ]
}
```

**استجابة:**
```json
{
  "predictions": [1234.56],
  "success": true,
  "message": "Successfully predicted 1 records"
}
```

#### `POST /predict_from_csv`

يقوم بالتنبؤ بالمبيعات من ملف CSV.

**طلب:** ملف CSV مرفق

**استجابة:**
```json
{
  "predictions": [1234.56, 5678.90],
  "success": true,
  "message": "Successfully processed 2 records"
}
```

#### `POST /predict_with_model/{model_name}`

يقوم بالتنبؤ باستخدام نموذج محدد.

**طلب:**
```json
{
  "data": [
    {
      "store_nbr": 1,
      "family": "GROCERY I",
      "onpromotion": true,
      "date": "2023-01-01"
    }
  ]
}
```

**استجابة:**
```json
{
  "predictions": [1234.56],
  "success": true,
  "message": "Prediction successful using model 'regression'"
}
```

### معلومات النموذج

#### `GET /model_info`

يقوم بإرجاع معلومات حول النموذج المستخدم.

**استجابة:**
```json
{
  "model_name": "RandomForestRegressor",
  "model_type": "Regression",
  "metrics": {
    "r2": 0.85
  },
  "features": ["store_nbr", "family", "onpromotion", "date"]
}
```

#### `GET /available_models`

يقوم بإرجاع قائمة بالنماذج المتاحة للتنبؤ.

**استجابة:**
```json
{
  "models": ["default", "regression"]
}
```

### فحص الصحة

#### `GET /health`

يقوم بإرجاع حالة صحة الخادم.

**استجابة:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "version": "1.0.0"
}
```

## استخدام API مع الواجهة الأمامية

تم تكوين API للعمل مع الواجهة الأمامية React التي تعمل على `http://localhost:3000`. تم تمكين CORS للسماح بالطلبات من هذا المصدر.

### مثال على استخدام API في React

```javascript
// مثال على استدعاء API للتنبؤ
async function predictSales(data) {
  try {
    const response = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error predicting sales:', error);
    return { success: false, message: error.message, predictions: [] };
  }
}

// مثال على تحميل ملف CSV للتنبؤ
async function uploadCSVForPrediction(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch('http://localhost:8000/predict_from_csv', {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  } catch (error) {
    console.error('Error uploading CSV:', error);
    return { success: false, message: error.message, predictions: [] };
  }
}
```

## تشغيل الخادم

لتشغيل خادم FastAPI:

```sh
cd src
python -m uvicorn api.main:app --reload
```

سيكون الخادم متاحًا على `http://localhost:8000`.

## توثيق Swagger

يمكن الوصول إلى توثيق Swagger التفاعلي على `http://localhost:8000/docs`.