pipeline {
    agent any
    tools {
        nodejs "NodeJS 22.14.0"
    }
    environment {
        APP_NAME = 'fasili-backend-app'
        APP_DIR = '/home/ubuntu/apps/fasili-backend-app'
        PM2_APP_NAME = 'fasili-backend'
        ENV_FILE = '/home/ubuntu/configs/.env.production'
        PM2_CONFIG_FILE = '/home/ubuntu/configs/fasili_backend.pm2.ecosystem.js'
    }
        
    stages {
        stage('Getting Fasili backend repository') {
            steps {
                git url: 'git@bitbucket.org:ocass/peertopeerbackend.git',
                    credentialsId: 'bitbucket-fasili-back-ssh-key',
                    branch: 'master'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script {
                    echo "🧹 Nettoyage des dépendances..."
                    sh '''
                        rm -rf dist node_modules
                        npm cache clean --force
                    '''
                    
                    echo "📦 Installation des dépendances..."
                    sh 'npm ci'
                }
            }
        }
        
        stage('Load Environment & Build') {
            steps {
                script {
                    echo "🔧 Chargement des variables d'environnement..."
                    
                    // Vérification du fichier .env
                    sh '''
                        if [ -f /var/lib/jenkins/.fasili.env ]; then
                            echo "✅ Fichier .fasili.env trouvé"
                            echo "Contenu du fichier (masqué):"
                            sed 's/=.*/=***/' /var/lib/jenkins/.fasili.env
                        else
                            echo "❌ Fichier .fasili.env non trouvé"
                            exit 1
                        fi
                    '''
                    
                    echo "🏗️ Démarrage du build..."
                    timeout(time: 5, unit: 'MINUTES') {
                        sh '''
                            set -e
                            echo "Chargement des variables d'environnement..."
                            set -a && source /var/lib/jenkins/.fasili.env && set +a
                            
                            echo "✅ Variables d'environnement chargées"
                            echo "Démarrage du build..."
                            npm run build --verbose
                            
                            echo "✅ Build terminé avec succès"
                        '''
                    }
                }
            }
        }
        
        stage('Deploy App') {
            steps {
                script {
                    echo "🚀 Déploiement de l'application..."
                    sh '''
                        echo "=== CRÉATION DU RÉPERTOIRE D'APPLICATION ==="
                        mkdir -p ${APP_DIR}
                        echo "✅ Répertoire ${APP_DIR} créé"
                        
                        echo "=== COPIE DES FICHIERS ==="
                        cp -r dist/ ${APP_DIR}/
                        cp package*.json ${APP_DIR}/
                        cp -r node_modules/ ${APP_DIR}/
                        
                        # Copier le fichier d'environnement
                        cp ${ENV_FILE} ${APP_DIR}/.env
                        
                        # Copier le fichier pm2 config
                        cp ${PM2_CONFIG_FILE} ${APP_DIR}/ecosystem.config.js
                        
                        echo "✅ Fichiers copiés avec succès"
                        
                        echo "=== VÉRIFICATIONS ==="
                        # Vérifier que le fichier .env existe
                        if [ ! -f ${APP_DIR}/.env ]; then
                            echo "❌ Erreur: Fichier .env non trouvé!"
                            exit 1
                        fi
                    '''
                }
            }
        }
        
        stage('Start PM2 Service') {
            steps {
                script {
                    echo "🔄 Démarrage du service PM2..."
                    sh '''
                        # Aller dans le répertoire d'application
                        cd ${APP_DIR}
                        
                        # Arrêter l'ancienne version (en tant qu'ubuntu)
                        pm2 stop ${PM2_APP_NAME} || echo "Aucune instance à arrêter"
                        pm2 delete ${PM2_APP_NAME} || echo "Aucune instance à supprimer"
                        
                        # Démarrer la nouvelle version
                        pm2 start ecosystem.config.js --env production -- --env-file .env || echo "❌ Aucun service démarré"
                        pm2 save
                        echo "✅ Service PM2 démarré"
                    '''
                }
            }
        }
    }
}