# Use the official Google Cloud SDK image
FROM google/cloud-sdk:latest

# Install default Java Runtime Environment and other dependencies
RUN apt-get update && \
    apt-get install -y default-jre && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install required gcloud components
RUN gcloud components install -q \
    alpha beta \
    app-engine-go \
    app-engine-java \
    app-engine-python \
    app-engine-python-extras \
    bigtable \
    cbt \
    cloud-datastore-emulator \
    cloud-firestore-emulator \
    gke-gcloud-auth-plugin \
    docker-credential-gcr \
    kpt \
    kubectl \
    kustomize \
    local-extract \
    package-go-module \
    pubsub-emulator \
    skaffold && \
    gcloud components update -q && \
    gcloud components list
