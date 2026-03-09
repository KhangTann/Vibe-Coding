import uvicorn
uvicorn.run('main:app', reload=True, host='0.0.0.0', port=8000)