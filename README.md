Run local with docker
1. git clone https://github.com/MartinKonak/PWA_SEM.git
2. cd PWA_SEM
3. docker-compose up


On docker hub
- docker pull martinkonak/pwa_sem-frontend
- docker pull martinkonak/pwa_sem-backend
- edit docker-compose.yml:

        version: '3'
            services:
            frontend:
              image: your-docker-username/frontend-image-name
              ports:
                - "80:80"  # Change this if your frontend listens on a different port

            backend:
              image: your-docker-username/backend-image-name
              ports:
                - "3000:3000"  # Change this if your backend listens on a different port
