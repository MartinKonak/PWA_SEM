Realtime chatapp
- login with username into one chat room

Frontend: Javascript, React
Backend: Node js
Database: HarperDB

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
              image: martinkonak/pwa_sem-frontend
              ports:
                - "3000:3000"  # Change this if your frontend listens on a different port

            backend:
              image: martinkonak/pwa_sem-backend
              ports:
                - "4000:4000"  # Change this if your backend listens on a different port
              env_file:
                - ./.env

- then in work directory: docker-compose up -d
