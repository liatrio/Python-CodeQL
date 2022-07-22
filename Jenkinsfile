pipeline {
  agent { 
    docker {
      alwaysPull false
      image "codeql:${VERSION}"
      args "-v /var/run/docker.sock:/var/run/docker.sock --entrypoint='' -u 0"
    }
  }
  environment {
    GITHUB_PAT = credentials('github-pat')
  }

  stages {
    stage('Checkout SCM') {
      steps {
        sh 'git clone --branch ${GIT_BRANCH} https://github.com/${ORGANIZATION}/${REPOSITORY}.git'
      }
    }

    stage('CodeQL Scan') {
      steps {
        dir("${REPOSITORY}") {
          sh '''
            codeql database create /codeql-dbs/example-repo-multi --db-cluster --language javascript,python --overwrite
            for language in javascript python; do
              codeql database analyze "/codeql-dbs/example-repo-multi/$language" "$language-code-scanning.qls" --sarif-category="$language" --format=sarif-latest --output="/tmp/example-repo-$language.sarif"
            done
          '''
        }
      }
    }

    stage('Upload CodeQL Results') {
      steps {
        dir("${REPOSITORY}") {
          sh '''
            for language in javascript python; do
              echo $GITHUB_PAT | codeql github upload-results --sarif="/tmp/example-repo-$language.sarif" --github-auth-stdin -f=refs/heads/${GIT_BRANCH}
            done
          '''
        }
      }
    }

    stage('Build') {
      steps {
        dir("${REPOSITORY}") {
          sh 'docker build --file dockerfiles/app . -t mdc:latest'
        }
      }
    }

  }
}

