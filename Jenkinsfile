pipeline {
  agent any
  environment {
    GITHUB_PAT = credentials('github-pat')
  }

  stages {
    stage('Checkout SCM') {
      steps {
        sh 'git clone --branch ${GIT_BRANCH} https://github.com/${ORGANIZATION}/${REPOSITORY}.git'
      }
    }

    stage('Build Agent') {
      steps {
        dir('${REPOSITORY}') {
          script {
            def codeqlAgent = docker.build("codeql:${VERSION}", "./dockerfiles/jenkinsagent")
          }
        }
      }
    }

    stage('CodeQL Scan and Upload') {
      steps {
        codeqlAgent.inside{
          sh '''
            git clone --branch ${GIT_BRANCH} https://github.com/${ORGANIZATION}/${REPOSITORY}.git
            cd ./${REPOSITORY}
            codeql database create /codeql-dbs/example-repo-multi --db-cluster --language javascript,python --overwrite
            for language in javascript python; do
              codeql database analyze "/codeql-dbs/example-repo-multi/$language" "$language-code-scanning.qls" --sarif-category="$language" \
                --format=sarif-latest --output="/tmp/example-repo-$language.sarif"
            done
            for language in javascript python; do
              echo $GITHUB_PAT | codeql github upload-results --sarif="/tmp/example-repo-$language.sarif" --github-auth-stdin -f=refs/heads/${GIT_BRANCH}
            done
          '''
        }
      }
    }

    stage('Build') {
      steps {
        dir('${REPOSITORY}') {
          sh 'docker build --file dockerfiles/app . -t mdc:latest'
        }
      }
    }

  stage('Manual Cleanup') {
    steps {
      sh 'rm -rf ./${REPOSITORY}'
    }
  }

  }
}
//This is a questionable approach

