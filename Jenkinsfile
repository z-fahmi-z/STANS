pipeline {
    agent any
    
    stages {
        
        stage('Checkout') {
            steps {
                script {
                    echo "=== Jenkins SCM Checkout ==="

                    // THIS is the key line for multibranch pipelines
                    def scmVars = checkout scm

                    echo "Git URL: ${scmVars.GIT_URL}"
                    echo "Branch: ${scmVars.GIT_BRANCH}"
                    echo "Commit: ${scmVars.GIT_COMMIT}"
                }
            }
        }

        stage('Build') {
            steps {
                echo 'Triggering build attempt 3...'
            }
        }
    }
}