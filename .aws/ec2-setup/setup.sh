# AMI: Amazon Linux 2023

# instalation
sudo yum install -y docker
sudo yum install git

# init
sudo service docker start
sudo usermod -a -G docker ec2-user

# Importante: Definir um CIDR para o swarm previne problemas de resolução de nomes dos servicos das aws (não conecta para o RDS dentro do container, mas no host sim), quando a conflito nos IPs das subnets da VPC.
# Ex.: VPC Sub net usa CIDR 10.0.0.0/16 e por padrão o swarm tbm usa o mesmo CIDR 10.0.0.0/16
# https://stackoverflow.com/a/60140439
sudo docker swarm init --default-addr-pool 192.168.0.0/16

# create app folder
sudo mkdir /app
sudo chown ec2-user:ec2-user /app


# setup app
cd /app
git clone https://github.com/WalissonPires/MessagingApi.git .

sudo docker build -t messaging-api:latest .

cat > docker-compose.yaml << EOL
services:
  messaging-api:
    image: messaging-api:latest
    restart: always
    ports:
      - "3000:3000"
    dns:
      -
    environment:
      ENABLE_FASTIFY_LOG: "false"
      PUPPERTER_HEADLESS: "true"
      JWT_SECRET: "testesvllPxuxz9zKeXFv0CX02Ydyt0j"
      DATABASE_URL: "postgresql://postgres:masterkey@test-db.host.us-east-1.rds.amazonaws.com:5432/messaging?schema=public"
EOL

sudo docker stack up -c docker-compose.yaml messaging

# sudo docker stack services messaging
# curl http://127.0.0.1:3000
# sudo docker logs b4ac4fce1386
# curl -X POST -H 'Content-Type: application/json' -d '{ "username": "test", "password": "test" }' -v http://127.0.0.1:3000/auth/sign