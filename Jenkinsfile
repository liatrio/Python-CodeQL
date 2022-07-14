pipeline {
        agent { 
                label "python-codeql"
        }
	environment {
		GITHUB_PAT = credentials('github-pat')
	}

	stages {
		stage('CodeQL Scan') {
			steps {
					sh '''
						codeql database create /codeql-dbs/example-repo-multi --db-cluster --language javascript,python --overwrite
						for language in javascript python; do
							codeql database analyze "/codeql-dbs/example-repo-multi/$language" "$language-code-scanning.qls" --sarif-category="$language" \
							--format=sarif-latest --output="/tmp/example-repo-$language.sarif"
						done
					'''
			}
		}

		stage('Upload CodeQL Results (PR)') {
			when {
				not {
					branch 'main'
				}
			}

			steps {
					sh '''
						for language in javascript python; do
							echo $GITHUB_PAT | codeql github upload-results --sarif="/tmp/example-repo-$language.sarif" --github-auth-stdin -f=refs/heads/${CHANGE_BRANCH}
						done
					'''
			}
		}

		stage('Upload CodeQL Results (main)') {
			when {
				branch 'main'
			}

			steps {
					sh '''
						for language in javascript python; do
							echo $GITHUB_PAT | codeql github upload-results --sarif="/tmp/example-repo-$language.sarif" --github-auth-stdin -f=refs/heads/main
						done
					'''
			}
		}
		stage('Build') {
			steps {
					sh '''
						docker build --file dockerfiles/app . -t mdc:latest
					'''
			}
		}
	}
}

