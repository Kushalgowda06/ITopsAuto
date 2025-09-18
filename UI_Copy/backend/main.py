from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import jwt
from datetime import datetime, timedelta
import os
import uuid
import json

app = FastAPI(title="Cognizant Autonomous IT Operations Toolkit API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"

# Models
class LoginRequest(BaseModel):
    user_id: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class BotCard(BaseModel):
    id: str
    name: str
    description: str
    category: str
    avatar: str
    capabilities: List[str]

class ChatMessage(BaseModel):
    message: str
    bot_id: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    bot_id: str
    timestamp: datetime

class TerraformRequest(BaseModel):
    resource_description: str
    resource_type: str
    provider: str = "aws"  # default to AWS

class TerraformResponse(BaseModel):
    configuration: str
    resource_details: dict
    estimated_cost: Optional[str] = None

class ResourceTicket(BaseModel):
    ticket_id: str
    resource_type: str
    configuration: str
    status: str
    created_at: datetime

# Dummy user database
users_db = {
    "admin": {"user_id": "admin", "password": "password", "name": "Admin User", "role": "admin"},
    "user1": {"user_id": "user1", "password": "password", "name": "John Doe", "role": "user"}
}

# Bot database
bots_db = {
    "devops": [
        {
            "id": "build-automate-bot",
            "name": "Build Automate Bot",
            "description": "AI-powered Terraform template generation for cloud resource provisioning",
            "category": "devops",
            "avatar": "🏗️",
            "capabilities": ["AI Terraform Templates", "Cloud Resource Provisioning", "Infrastructure Automation"]
        },
        {
            "id": "monitoring-bot",
            "name": "Monitoring Bot",
            "description": "Real-time system monitoring and alerting",
            "category": "devops",
            "avatar": "📊",
            "capabilities": ["System Monitoring", "Alert Management", "Performance Analytics"]
        }
    ],
    "analytics": [
        {
            "id": "data-analyst-bot",
            "name": "Data Analyst Bot",
            "description": "Advanced data analysis and insights generation",
            "category": "analytics",
            "avatar": "📈",
            "capabilities": ["Data Visualization", "Predictive Analytics", "Business Intelligence"]
        },
        {
            "id": "ml-bot",
            "name": "ML Operations Bot",
            "description": "Machine learning model deployment and management",
            "category": "analytics",
            "avatar": "🤖",
            "capabilities": ["Model Training", "Model Deployment", "A/B Testing"]
        }
    ],
    "worknext": [
        {
            "id": "productivity-bot",
            "name": "Productivity Bot",
            "description": "Enhances workplace productivity and collaboration",
            "category": "worknext",
            "avatar": "💼",
            "capabilities": ["Task Automation", "Meeting Scheduling", "Document Generation"]
        },
        {
            "id": "hr-bot",
            "name": "HR Assistant Bot",
            "description": "Human resources management and employee support",
            "category": "worknext",
            "avatar": "👥",
            "capabilities": ["Employee Onboarding", "Policy Management", "Performance Tracking"]
        }
    ],
    "itops": [
        {
            "id": "incident-bot",
            "name": "Incident Response Bot",
            "description": "Automated incident detection and response",
            "category": "itops",
            "avatar": "🚨",
            "capabilities": ["Incident Detection", "Auto-remediation", "Root Cause Analysis"]
        },
        {
            "id": "security-bot",
            "name": "Security Bot",
            "description": "Cybersecurity monitoring and threat detection",
            "category": "itops",
            "avatar": "🔒",
            "capabilities": ["Threat Detection", "Security Scanning", "Compliance Monitoring"]
        }
    ]
}

# Utility functions
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Routes
@app.get("/")
async def root():
    return {"message": "Cognizant Autonomous IT Operations Toolkit API", "status": "running"}

@app.post("/auth/login", response_model=LoginResponse)
async def login(login_data: LoginRequest):
    user = users_db.get(login_data.user_id)
    if not user or user["password"] != login_data.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    access_token = create_access_token(data={"sub": user["user_id"]})
    return LoginResponse(
        access_token=access_token,
        user={"user_id": user["user_id"], "name": user["name"], "role": user["role"]}
    )

@app.get("/auth/me")
async def get_current_user(current_user: str = Depends(verify_token)):
    user = users_db.get(current_user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"user_id": user["user_id"], "name": user["name"], "role": user["role"]}

@app.get("/bots/{category}")
async def get_bots_by_category(category: str, current_user: str = Depends(verify_token)):
    if category not in bots_db:
        raise HTTPException(status_code=404, detail="Category not found")
    return bots_db[category]

@app.get("/bots")
async def get_all_bots(current_user: str = Depends(verify_token)):
    all_bots = []
    for category_bots in bots_db.values():
        all_bots.extend(category_bots)
    return all_bots

@app.post("/chat", response_model=ChatResponse)
async def chat_with_bot(chat_data: ChatMessage, current_user: str = Depends(verify_token)):
    # Simulate AI response (replace with actual AI integration)
    def get_build_automate_response(message):
        if any(word in message.lower() for word in ["vm", "virtual machine", "instance", "server"]):
            return """I can help you create a Virtual Machine! Here's what I can generate for you:

🔧 **Terraform Template for VM:**
- AWS EC2 instance with t3.medium specs
- Security groups and networking
- Automated tags and naming

📋 **What I need from you:**
- Instance size (t3.micro, t3.medium, t3.large)
- Operating System (Amazon Linux, Ubuntu, Windows)
- Any specific security requirements

Would you like me to generate a Terraform template? Just describe your VM requirements!"""
        
        elif any(word in message.lower() for word in ["cluster", "kubernetes", "k8s", "eks"]):
            return """Perfect! I can create a Kubernetes cluster for you:

🔧 **Terraform Template for EKS Cluster:**
- Managed Kubernetes cluster
- Auto-scaling node groups
- IAM roles and security policies
- Multi-AZ deployment

📋 **Configuration details:**
- Node count: 2-4 nodes
- Instance type: t3.medium
- Kubernetes version: 1.27

Ready to generate the Terraform configuration? Describe any specific cluster requirements!"""
        
        elif any(word in message.lower() for word in ["database", "db", "mysql", "postgres", "rds"]):
            return """I can help you set up a database! 

🔧 **Terraform Template for Database:**
- AWS RDS instance
- Encrypted storage
- Automated backups
- Security groups

📋 **Database options:**
- MySQL 8.0 or PostgreSQL
- Instance class: db.t3.micro to db.r5.large
- Storage: 20GB to 1TB

Tell me your database requirements and I'll generate the Terraform template!"""
        
        else:
            return """Hello! I'm your **Build Automate Bot** 🏗️

I specialize in creating **AI-powered Terraform templates** for cloud resources:

🚀 **What I can create:**
• Virtual Machines (EC2, Compute Engine)
• Kubernetes Clusters (EKS, GKE, AKS)
• Databases (RDS, Cloud SQL)
• Storage solutions
• Networking components

💡 **How it works:**
1. Describe the resources you need
2. I'll generate Terraform configuration
3. Review the template and resource details
4. Click "Create Resource" to get a ticket number

**Example prompts:**
- "Create a VM with 4GB RAM for web hosting"
- "I need a Kubernetes cluster for microservices"
- "Set up a MySQL database for my app"

What cloud resources would you like to create today?"""

    bot_responses = {
        "build-automate-bot": get_build_automate_response(chat_data.message),
        "monitoring-bot": "System monitoring is active. All services are running optimally.",
        "data-analyst-bot": "I can analyze your data and provide insights. What dataset would you like to explore?",
        "ml-bot": "Ready to help with machine learning tasks. What model would you like to train?",
        "productivity-bot": "I'm here to boost your productivity. What task can I automate for you?",
        "hr-bot": "How can I assist you with HR-related queries today?",
        "incident-bot": "No critical incidents detected. All systems operational.",
        "security-bot": "Security status: All clear. No threats detected."
    }
    
    response_text = bot_responses.get(chat_data.bot_id, "I'm here to help! How can I assist you today?")
    
    return ChatResponse(
        response=response_text,
        bot_id=chat_data.bot_id,
        timestamp=datetime.utcnow()
    )

@app.post("/terraform/generate", response_model=TerraformResponse)
async def generate_terraform_template(terraform_request: TerraformRequest, current_user: str = Depends(verify_token)):
    """Generate Terraform template based on user requirements"""
    
    # Simulate AI-generated Terraform configuration
    terraform_templates = {
        "vm": f"""
resource "{terraform_request.provider}_instance" "main" {{
  ami           = "ami-0c55b159cbfafe1d0"  # Amazon Linux 2
  instance_type = "t3.medium"
  
  tags = {{
    Name = "AI-Generated-VM"
    Environment = "production"
    ManagedBy = "BuildAutomateBot"
  }}
}}

output "instance_ip" {{
  value = {terraform_request.provider}_instance.main.public_ip
}}
""",
        "cluster": f"""
resource "{terraform_request.provider}_eks_cluster" "main" {{
  name     = "ai-generated-cluster"
  role_arn = {terraform_request.provider}_iam_role.cluster.arn
  version  = "1.27"

  vpc_config {{
    subnet_ids = var.subnet_ids
  }}

  depends_on = [
    {terraform_request.provider}_iam_role_policy_attachment.cluster_policy,
  ]
}}

resource "{terraform_request.provider}_eks_node_group" "main" {{
  cluster_name    = {terraform_request.provider}_eks_cluster.main.name
  node_group_name = "main-nodes"
  node_role_arn   = {terraform_request.provider}_iam_role.node.arn
  subnet_ids      = var.subnet_ids

  scaling_config {{
    desired_size = 2
    max_size     = 4
    min_size     = 1
  }}

  instance_types = ["t3.medium"]
}}
""",
        "database": f"""
resource "{terraform_request.provider}_db_instance" "main" {{
  identifier = "ai-generated-db"
  
  engine         = "mysql"
  engine_version = "8.0"
  instance_class = "db.t3.micro"
  
  allocated_storage = 20
  storage_encrypted = true
  
  db_name  = "appdb"
  username = "admin"
  
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  tags = {{
    Name = "AI-Generated-Database"
    Environment = "production"
  }}
}}
"""
    }
    
    # Determine resource type from description
    resource_type = "vm"
    if any(word in terraform_request.resource_description.lower() for word in ["cluster", "kubernetes", "k8s", "eks"]):
        resource_type = "cluster"
    elif any(word in terraform_request.resource_description.lower() for word in ["database", "db", "mysql", "postgres"]):
        resource_type = "database"
    
    configuration = terraform_templates.get(resource_type, terraform_templates["vm"])
    
    # Generate resource details
    resource_details = {
        "resource_type": resource_type,
        "provider": terraform_request.provider,
        "estimated_deployment_time": "5-10 minutes",
        "resources_to_create": ["Virtual Machine", "Security Group", "Network Interface"] if resource_type == "vm" 
                              else ["EKS Cluster", "Node Group", "IAM Roles"] if resource_type == "cluster"
                              else ["RDS Instance", "Security Group", "Subnet Group"],
        "region": f"{terraform_request.provider}-us-east-1",
        "estimated_cost": "$50-100/month" if resource_type == "vm" 
                         else "$200-400/month" if resource_type == "cluster"
                         else "$30-80/month"
    }
    
    return TerraformResponse(
        configuration=configuration,
        resource_details=resource_details,
        estimated_cost=resource_details["estimated_cost"]
    )

@app.post("/terraform/create-ticket", response_model=ResourceTicket)
async def create_resource_ticket(terraform_request: TerraformRequest, current_user: str = Depends(verify_token)):
    """Create a ticket for resource provisioning"""
    
    ticket_id = f"TF-{uuid.uuid4().hex[:8].upper()}"
    
    # Simulate ticket creation
    ticket = ResourceTicket(
        ticket_id=ticket_id,
        resource_type=terraform_request.resource_type,
        configuration=f"Terraform configuration for {terraform_request.resource_description}",
        status="PENDING",
        created_at=datetime.utcnow()
    )
    
    return ticket

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 