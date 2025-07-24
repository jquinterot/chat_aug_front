# Docker Deployment Guide for Azure

This guide covers how to dockerize and deploy your Next.js chatbot application to Azure.

## 🐳 Docker Setup

### Files Created
- `Dockerfile` - Multi-stage production-optimized build
- `.dockerignore` - Excludes unnecessary files from build context
- `next.config.js` - Enables standalone output for smaller images
- `docker-compose.yml` - Local development and testing
- `azure-deploy.yml` - Azure Container Instances configuration
- `src/app/api/health/route.ts` - Health check endpoint

## 🚀 Local Development

### Build and Run Locally
```bash
# Build the Docker image
docker build -t chatbot-app .

# Run the container
docker run -p 3000:3000 chatbot-app

# Or use Docker Compose
docker-compose up --build
```

### Test the Application
- App: http://localhost:3000
- Health Check: http://localhost:3000/api/health

## ☁️ Azure Deployment Options

### Option 1: Azure Container Instances (ACI)
**Best for**: Simple, serverless container deployment

```bash
# 1. Build and push to Azure Container Registry
az acr build --registry your-registry --image chatbot-app:latest .

# 2. Deploy to ACI
az container create \
  --resource-group your-rg \
  --name chatbot-app \
  --image your-registry.azurecr.io/chatbot-app:latest \
  --cpu 1 \
  --memory 2 \
  --ports 3000 \
  --dns-name-label chatbot-app-unique \
  --environment-variables NODE_ENV=production PORT=3000
```

### Option 2: Azure Container Apps
**Best for**: Microservices, auto-scaling, advanced features

```bash
# 1. Create Container App Environment
az containerapp env create \
  --name chatbot-env \
  --resource-group your-rg \
  --location eastus

# 2. Deploy Container App
az containerapp create \
  --name chatbot-app \
  --resource-group your-rg \
  --environment chatbot-env \
  --image your-registry.azurecr.io/chatbot-app:latest \
  --target-port 3000 \
  --ingress external \
  --cpu 1.0 \
  --memory 2.0Gi
```

### Option 3: Azure App Service
**Best for**: Traditional web apps, easy scaling

```bash
# Deploy using Azure CLI
az webapp create \
  --resource-group your-rg \
  --plan your-app-plan \
  --name chatbot-app \
  --deployment-container-image-name your-registry.azurecr.io/chatbot-app:latest
```

## 🔧 Configuration

### Environment Variables
Set these in your Azure deployment:
```
NODE_ENV=production
PORT=3000
NEXT_TELEMETRY_DISABLED=1
# Add your backend API URL if needed
NEXT_PUBLIC_API_URL=https://your-backend.azurewebsites.net
```

### Azure Container Registry Setup
```bash
# Create ACR
az acr create --resource-group your-rg --name your-registry --sku Basic

# Build and push
az acr build --registry your-registry --image chatbot-app:latest .
```

## 📊 Monitoring & Health Checks

### Health Check Endpoint
- URL: `/api/health`
- Returns: Application status, uptime, version
- Use for: Load balancer health checks, monitoring

### Azure Monitor Integration
```bash
# Enable Application Insights
az monitor app-insights component create \
  --app chatbot-insights \
  --location eastus \
  --resource-group your-rg
```

## 🔒 Security Best Practices

1. **Use Azure Container Registry** for private image storage
2. **Enable HTTPS** with Azure's built-in SSL certificates
3. **Set security headers** (already configured in next.config.js)
4. **Use managed identities** for Azure service authentication
5. **Enable Azure Defender** for container security scanning

## 🚀 CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/azure-deploy.yml`:
```yaml
name: Deploy to Azure
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build and push to ACR
        uses: azure/docker-login@v1
        with:
          login-server: ${{ secrets.REGISTRY_LOGIN_SERVER }}
          username: ${{ secrets.REGISTRY_USERNAME }}
          password: ${{ secrets.REGISTRY_PASSWORD }}
      
      - run: |
          docker build . -t ${{ secrets.REGISTRY_LOGIN_SERVER }}/chatbot-app:${{ github.sha }}
          docker push ${{ secrets.REGISTRY_LOGIN_SERVER }}/chatbot-app:${{ github.sha }}
      
      - name: Deploy to Azure Container Instances
        uses: azure/aci-deploy@v1
        with:
          resource-group: ${{ secrets.RESOURCE_GROUP }}
          dns-name-label: chatbot-app-${{ github.sha }}
          image: ${{ secrets.REGISTRY_LOGIN_SERVER }}/chatbot-app:${{ github.sha }}
          cpu: 1
          memory: 2
          ports: 3000
```

## 📈 Performance Optimization

### Docker Image Size
- Multi-stage build reduces final image size
- Standalone output eliminates unnecessary files
- Alpine Linux base for minimal footprint

### Azure Optimization
- Use **Azure CDN** for static assets
- Enable **Application Gateway** for load balancing
- Configure **auto-scaling** based on CPU/memory usage

## 🛠️ Troubleshooting

### Common Issues
1. **Port binding**: Ensure PORT=3000 environment variable
2. **Health checks**: Verify `/api/health` endpoint responds
3. **Memory limits**: Increase if build fails (minimum 2GB recommended)
4. **Network**: Check Azure NSG rules for port 3000

### Debugging
```bash
# View container logs
docker logs chatbot-app

# Azure Container Instances logs
az container logs --resource-group your-rg --name chatbot-app

# Connect to running container
docker exec -it chatbot-app sh
```

## 📝 Next Steps

1. **Set up Azure Container Registry**
2. **Configure your deployment pipeline**
3. **Add environment-specific configurations**
4. **Set up monitoring and alerting**
5. **Configure custom domain and SSL**

Your Next.js chatbot is now ready for production deployment on Azure! 🚀
