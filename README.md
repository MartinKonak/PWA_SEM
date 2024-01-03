Realtime chatapp
- login with username into one chat room and chat with other users

Frontend:        Javascript, React
Backend:         Node js
Database:        HarperDB
Communication:   Socket io

Run local with docker:
1.         git clone https://github.com/MartinKonak/PWA_SEM.git
2.         cd PWA_SEM
3.         docker-compose up




Run with docker hub images:
-         docker pull martinkonak/pwa_sem-frontend
-         docker pull martinkonak/pwa_sem-backend
- edit compose.yml:

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

- then in work directory:
  - copy ./server/.env
  -     docker-compose up -d
