FROM google/cloud-sdk:latest

# Install default Java Runtime and required gcloud CLI components via apt
RUN apt-get update && \
    apt-get install -y \
    default-jre \
    google-cloud-cli-app-engine-go \
    google-cloud-cli-app-engine-java \
    google-cloud-cli-app-engine-python \
    google-cloud-cli-app-engine-python-extras \
    google-cloud-cli-bigtable-emulator \
    google-cloud-cli-cbt \
    google-cloud-cli-datastore-emulator \
    google-cloud-cli-firestore-emulator \
    google-cloud-cli-gke-gcloud-auth-plugin \
    google-cloud-cli-docker-credential-gcr \
    google-cloud-cli-kpt \
    kubectl \
    google-cloud-cli-local-extract \
    google-cloud-cli-package-go-module \
    google-cloud-cli-pubsub-emulator \
    google-cloud-cli-skaffold && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
