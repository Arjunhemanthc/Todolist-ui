pipeline {
    agent any

    environment {
        IMAGE = "todo-frontend-ui:${BUILD_NUMBER}"
        CONT = "todo-frontend-ui"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                bat "docker build -t %IMAGE% ."
            }
        }

        stage('Run Frontend Container') {
            steps {
                // Stops any old container running on port 8082 gracefully
                bat "docker rm -f %CONT% 2>nul || exit 0"
                
                // Maps your host machine port 8082 to internal Nginx port 80
                bat "docker run -d --name %CONT% -p 8082:80 %IMAGE%"
            }
        }
    }

    post {
        success {
            echo "======================================================="
            echo "🎉 Todo Frontend UI Deployed Successfully!"
            echo "Access your complete application at: http://localhost:8082"
            echo "======================================================="
        }
        failure {
            echo "❌ Build failed. Please inspect the Console Output logs."
        }
    }
}